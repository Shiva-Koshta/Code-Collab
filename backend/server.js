require("dotenv").config();
const express = require("express");
// eslint-disable-next-line no-unused-vars
const passportStrategy = require("./passport");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const filesysrouter = require("./routes/filesystem.routes");
const FileSystemService = require("./services/filesystem.services");
const middleware = require("./middleware");
const RoomCodeMap = require("./models/RoomCodeMap");
const RoomUserCount = require("./models/RoomUserCount");
const ACTIONS = require("../frontend/src/Actions");
const { log } = require("console");
const FileNodeSchema = require("./models/FileNode");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;

app.use(middleware);
app.use("/filesystem", filesysrouter);

const userSocketMap = {};
const usercnt = {};
const cursorPosition = {};
  /*
  Retrieves information about all connected clients in the specified room.
  Inputs:
    roomId (string): The ID of the room for which connected clients are to be retrieved.
  Outputs:
    Array: An array containing objects representing connected clients, each object containing socketId, username, and picture.
  */
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId].username,
        picture: userSocketMap[socketId].picture,
        
      };
    }
  );
}
// Define socket.io logic for handling client connections
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
   /*
    Handles the JOIN event when a user joins a room.
    Inputs:
      roomId (string): The ID of the room the user is joining.
      username (string): The username of the user joining.
      picture (string): The picture URL of the user joining.
    Outputs:
      None
    */

  socket.on(ACTIONS.JOIN, async ({ roomId, username, picture }) => {
    userSocketMap[socket.id] = { username, picture };
    usercnt[roomId] = (usercnt[roomId] || 0) + 1;
    socket.join(roomId);

    try {
      
      const clients = getAllConnectedClients(roomId);
      
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          picture,
          socketId: socket.id,
          
        });
      });
    } catch (error) {
      console.error("Error updating user count:", error);
    }
  });
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code, cursorData, socketid }) => {

    cursorPosition[socketid] = cursorData;
  
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code, cursorPosition });
  });

  /*
  Handles the SAVE_FILE event to save code to a file.
  Inputs:
    code (string): The code content to be saved.
    fileId (string): The ID of the file to which the code will be saved.
  Outputs:
    None
  */
  socket.on(ACTIONS.SAVE_FILE, async ({ code, fileId }) => {
    
    if (fileId === null || fileId === undefined || fileId === "") {
      
      return;
    } else {
      try {
        await FileSystemService.saveFile(fileId, code);
      } catch (error) {
        
      }
    }
  });

 //handles cursor change.
  socket.on(ACTIONS.CURSOR_CHANGE, ({ roomId, cursorData }) => {
    socket.in(roomId).emit(ACTIONS.CURSOR_CHANGE, { cursorData });
  });

  //handles the syncing of files.
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  /*
  Handles the disconnecting event when a socket disconnects from the server.
  Inputs:
    None
  Outputs:
    None
  Implementation:
    - Retrieves the rooms associated with the disconnecting socket.
    - Emits the DISCONNECTED event to all clients in each room to notify them about the disconnection.
    - Leaves each room.
  */
  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id].username,
      });
    });
    
    rooms.forEach((roomId) => {
      socket.leave(roomId);
    });
  });

  socket.on(ACTIONS.JOIN, ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

 /*
  Handles the ROLE_CHANGE event when a user's role changes in a room.
  Inputs:
    roomId (string): The ID of the room where the role change occurs.
    username (string): The username of the user whose role is changing.
    newRole (string): The new role assigned to the user.
  Outputs:
    None
  Implementation:
    - Updates the user's role in the database for the specified room.
    - Emits the ROLE_CHANGE event to all clients in the room to notify them about the role change.
    - If an error occurs during the process, it is caught and logged.
  */
  socket.on(ACTIONS.ROLE_CHANGE, ({ roomId, username, newRole }) => {
    RoomUserCount.findOneAndUpdate(
      { roomId, "users.username": username },
      { $set: { "users.$.role": newRole } },
      { new: true }
    )
      .then(() => {
        io.to(roomId).emit(ACTIONS.ROLE_CHANGE, {
          username,
          newRole,
        });
      })
      .catch((error) => {
        console.error("Error in changing role", error);
      });
  });

//This action is triggered when a message is to be sent to all users of the room.
  socket.on(ACTIONS.MESSAGE_SEND, ({ roomId, message, sender, sendname }) => {
    console.log(sender);
    console.log(sendname);
    io.to(roomId).emit(ACTIONS.MESSAGE_RECEIVE, {
      text: message.text,
      sender,
      sendname,
    });
  });

  /*
  Handles the FILESYSTEM_CHANGE event triggered when filesystem changes are made in a room.
  Inputs:
    roomId (string): The ID of the room where filesystem changes occur.
  Outputs:
    None
  Implementation:
    - Logs a message indicating filesystem changes.
    - Emits the FILESYSTEM_CHANGE event to all clients in the room to notify them about the changes.
  */

  socket.on(ACTIONS.FILESYSTEM_CHANGE, ({ roomId ,isdelete}) => {
    console.log("ho hioooo");
    // Emit the FILE_CHANGE event to all room members except the current socket
    if(isdelete)
    {
      socket.to(roomId).emit(ACTIONS.FILESYSTEM_CHANGE, {isdelete})
    }
    else 
    {
      socket.to(roomId).emit(ACTIONS.FILESYSTEM_CHANGE, {})
    }
  });

  socket.on(ACTIONS.SELECTED_FILE_CHANGE, ({ roomId ,folder, parentFolder}) => {
    // Emit the SELECTED_FILE_CHANGE event to all room members except the current socket
    socket.to(roomId).emit(ACTIONS.SELECTED_FILE_CHANGE, {folder, parentFolder});

  });
});

module.exports = { io, server, http };
const endpoints = require("./routes/endpoints");
app.use(endpoints);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
    server.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
