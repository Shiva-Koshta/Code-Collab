require("dotenv").config();
const express = require("express");
// eslint-disable-next-line no-unused-vars
const passportStrategy = require("./passport");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
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
app.use(endpoints);
const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      // console.log("userSocketMap:")
      //console.log(userSocketMap)
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
  });
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
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

    // Emit the code change to other sockets in the room

    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code })
  })
  socket.on(ACTIONS.CURSOR_CHANGE, ({ roomId, cursorData }) => {
    socket.in(roomId).emit(ACTIONS.CURSOR_CHANGE, { cursorData });
  });
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    // console.log("yes code syncing");
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id].username,
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on("disconnecting", async () => {
    // Iterate through each room the socket is connected to
    for (const roomId of socket.rooms) {
      // Find the document for the room ID, decrement the userCount, and return the updated document
      const updatedRoom = await RoomUserCount.findOneAndUpdate(
        { roomId },
        { $inc: { userCount: -1 } }, // Decrement userCount by 1
        { new: true } // Return the updated document
      );
      

      if (updatedRoom && updatedRoom.userCount === 0) {
        // If user count becomes 0, delete the entry from the code map model
        try {
          await RoomCodeMap.deleteOne({ roomId });
          console.log(`Entry for room ${roomId} deleted from code map model.`);
        } catch (error) {
          console.error(
            "Error deleting entry from code map model as room becsme empty:",
            error
          );
        }
      }
    }
  });
  socket.on(ACTIONS.JOIN, ({ roomId }) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
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
});

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
