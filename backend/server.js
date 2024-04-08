require("dotenv").config();
const express = require("express");
// eslint-disable-next-line no-unused-vars
const passportStrategy = require("./passport");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const filesysrouter = require("./routes/filesystem.routes");
const endpoints = require("./endpoints");
const middleware = require("./middleware");
const RoomCodeMap = require("./models/RoomCodeMap");
const RoomUserCount = require("./models/RoomUserCount");
const ACTIONS = require("../frontend/src/Actions");
const { log } = require("console");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;

app.use(middleware);
app.use("/filesystem", filesysrouter);
app.use(endpoints);
const userSocketMap = {};
const usercnt = {};
const cursorPosition = {}

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

    // Increment the user count for the room
    try {
      // Find the document for the room ID and update the user count
      // console.log("hi");
      const updatedRoom = await RoomUserCount.findOneAndUpdate(
        { roomId },
        { $inc: { userCount: 1 } }, // Increment userCount by 1
        { new: true, upsert: true } // Return the updated document and create if it doesn't exist
      );
      // console.log(updatedRoom);

      // Get all connected clients for the room
      const clients = getAllConnectedClients(roomId);
      // Emit the JOINED event to all clients in the room
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          picture,
          socketId: socket.id,
          userCount: updatedRoom.userCount, // Pass the updated user count to clients
        });
      });
    } catch (error) {
      console.error("Error updating user count:", error);
    }
  })
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code ,cursorData, socketid}) => {
    // Save or update the code in the database
    RoomCodeMap.findOneAndUpdate(
      { roomId },
      { code },
      { new: true, upsert: true }
    )
      .then((updatedMap) => {
        // console.log("Code updated in database:");
      })
      .catch((error) => {
        console.error("Error retrieving code from database:", error);
      });

    cursorPosition[socketid]= cursorData
    // Emit the code change to other sockets in the room
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code, cursorPosition})
  })
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

    // Iterate through each room the socket is connected to
    for (const roomId of socket.rooms) {
      if (usercnt[roomId]) {
        //console.log(usercnt[roomId]);
        if (usercnt[roomId] == 1) {
          console.log("yes");
          try {
            // Delete the entry from the code map model
            await RoomCodeMap.deleteOne({ roomId });
            console.log(
              `Entry for room ${roomId} deleted from code map model.`
            );
          } catch (error) {
            console.error(
              "Error deleting entry from code map model as room became empty:",
              error
            );
          }
          usercnt[roomId] = usercnt[roomId] - 1;
        } else {
          usercnt[roomId] = usercnt[roomId] - 1;
        }
      }
      // Find the document for the room ID
      const room = await RoomUserCount.findOne({ roomId });

      if (room) {
        // Decrement user count by 1
        const updatedRoom = await RoomUserCount.findOneAndUpdate(
          { roomId },
          { $inc: { userCount: -1 } },
          { new: true }
        );

        if (updatedRoom) {
          // If the disconnecting user is the host and there are other users
          if (
            room.hostname === userSocketMap[socket.id].username &&
            updatedRoom.userCount > 0
          ) {
            // Find a new host among the remaining users
            const newHost = updatedRoom.users.find(
              (user) => user.username !== room.hostname
            );
            if (newHost) {
              try {
                // Update the hostname to the new host
                await RoomUserCount.findOneAndUpdate(
                  { roomId },
                  { hostname: newHost.username },
                  { new: true }
                );
                console.log(
                  `Host for room ${roomId} changed to ${newHost.username}.`
                );
                // Emit a socket action for host change
                io.to(roomId).emit(ACTIONS.HOST_CHANGE, {
                  newHost: newHost.username,
                });
              } catch (error) {
                console.error("Error changing host:", error);
              }
            } else {
              console.log(`No new host found for room ${roomId}.`);
            }
          }

          // If user count becomes 0
          if (updatedRoom.userCount === 0) {
            try {
              // Delete the entry from the code map model
              await RoomCodeMap.deleteOne({ roomId });
              console.log(
                `Entry for room ${roomId} deleted from code map model.`
              );
            } catch (error) {
              console.error(
                "Error deleting entry from code map model as room became empty:",
                error
              );
            }
          }
          // Remove the name of the disconnected user from the user list
          console.log(userSocketMap[socket.id].username);
          const updatedUsers = updatedRoom.users.filter(
            (user) => user.username !== userSocketMap[socket.id].username
          );
          try {
            console.log(updatedUsers);
            await RoomUserCount.findOneAndUpdate(
              { roomId },
              { users: updatedUsers },
              { new: true }
            );
            console.log(
              `Disconnected user removed from user list in room ${roomId}.`
            );
          } catch (error) {
            console.error(
              "Error removing disconnected user from user list:",
              error
            );
          }
        }
      }
    }

    // Leave all rooms
    rooms.forEach((roomId) => {
      socket.leave(roomId);
    });
  });

  socket.on(ACTIONS.JOIN, ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on(ACTIONS.ROLE_CHANGE, ({roomId, username, newRole}) => {
    RoomUserCount.findOneAndUpdate(
      { roomId, 'users.username': username },
      { $set: { 'users.$.role': newRole } },
      { new: true }
    )
    .then(() => {io.to(roomId).emit(ACTIONS.ROLE_CHANGE, {
      username,
      newRole
    })})
    .catch((error) => {
      console.error("Error in changing role",error)
    })
  })
  
  socket.on(ACTIONS.MESSAGE_SEND, ({ roomId, message, sender, sendname }) => {
    console.log(sender);
    console.log(sendname);
    io.to(roomId).emit(ACTIONS.MESSAGE_RECEIVE, {
      text: message.text,
      sender,
      sendname
    })
  })
})

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
