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

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      console.log("userSocketMap:");
      console.log(userSocketMap);
      return {
        socketId,
        username: userSocketMap[socketId].username,
        picture: userSocketMap[socketId].picture,
        //consolelog(username)
      };
    }
  );
}
// Define socket.io logic
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on(ACTIONS.JOIN, async ({ roomId, username, picture }) => {
    // Add the user to the socket map
    userSocketMap[socket.id] = { username, picture };
    usercnt[roomId] = (usercnt[roomId] || 0) + 1;

    // Join the room
    socket.join(roomId);

    try {
      // Get all connected clients for the room
      const clients = getAllConnectedClients(roomId);
      // Emit the JOINED event to all clients in the room
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          picture,
          socketId: socket.id,
          // Pass the updated user count to clients
        });
      });
    } catch (error) {
      console.error("Error updating user count:", error);
    }
  });
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code, cursorData, socketid }) => {
    // Save or update the code in the database
    // RoomCodeMap.findOneAndUpdate(
    //   { roomId },
    //   { code },
    //   { new: true, upsert: true }
    // )
    //   .then((updatedMap) => {
    //     // console.log("Code updated in database:");
    //   })
    //   .catch((error) => {
    //     console.error("Error retrieving code from database:", error);
    //   });
    cursorPosition[socketid] = cursorData;
    // Emit the code change to other sockets in the room
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code, cursorPosition });
  });

  socket.on(ACTIONS.SAVE_FILE, async ({ code, fileId }) => {
    // console.log("fileId", fileId);
    // console.log("code", code);
    if (fileId === null || fileId === undefined || fileId === "") {
      // console.log("fileId is null");
      return;
    } else {
      try {
        await FileSystemService.saveFile(fileId, code);
      } catch (error) {
        // console.error("Error in saving file", error);
      }
    }
  });

  socket.on(ACTIONS.CURSOR_CHANGE, ({ roomId, cursorData }) => {
    socket.in(roomId).emit(ACTIONS.CURSOR_CHANGE, { cursorData });
  });
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    // console.log("yes code syncing");
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id].username,
      });
    });
    // Leave all rooms
    rooms.forEach((roomId) => {
      socket.leave(roomId);
    });
  });

  socket.on(ACTIONS.JOIN, ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

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

  socket.on(ACTIONS.MESSAGE_SEND, ({ roomId, message, sender, sendname }) => {
    console.log(sender);
    console.log(sendname);
    io.to(roomId).emit(ACTIONS.MESSAGE_RECEIVE, {
      text: message.text,
      sender,
      sendname,
    });
  });

  socket.on(ACTIONS.FILESYSTEM_CHANGE, ({ roomId }) => {
    console.log("ho hioooo");
    // Emit the FILE_CHANGE event to all room members except the current socket
    socket.to(roomId).emit(ACTIONS.FILESYSTEM_CHANGE, {});
  });
});

module.exports = { io, server, http };
const endpoints = require("./endpoints");
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
