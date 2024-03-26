const { Server } = require("socket.io");
const ACTIONS = require("../frontend/src/Actions");
const RoomCodeMap = require("./models/RoomCodeMap");

const userSocketMap = {};

const initSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
      userSocketMap[socket.id] = username;
      socket.join(roomId);
      const clients = getAllConnectedClients(roomId);
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
        });
      });
    });

    socket.on(ACTIONS.CODE_CHANGE, async ({ roomId, code }) => {
      await RoomCodeMap.findOneAndUpdate(
        { roomId },
        { code },
        { new: true, upsert: true }
      );

      socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.CURSOR_CHANGE, ({ roomId, cursorData }) => {
      socket.in(roomId).emit(ACTIONS.CURSOR_CHANGE, { cursorData });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
      io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms];
      rooms.forEach((roomId) => {
        socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
          socketId: socket.id,
          username: userSocketMap[socket.id],
        });
      });
      delete userSocketMap[socket.id];
      socket.on("disconnect");
    });

    socket.on(ACTIONS.JOIN, ({ roomId }) => {
      socket.join(roomId);
      console.log(`User joined room ${roomId}`);
    });

    socket.on(ACTIONS.MESSAGE_SEND, ({ roomId, message, sender, sendname }) => {
      io.to(roomId).emit(ACTIONS.MESSAGE_RECEIVE, {
        text: message.text,
        sender,
        sendname,
      });
    });
  });
};

const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

module.exports = { initSocketEvents };


const mongoose = require("mongoose");

const connectToDatabase = async (MONGO_URL) => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
};

module.exports = { connectToDatabase };


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportStrategy = require("./passport");
const { Server } = require("socket.io");
const http = require("http");
const { connectToDatabase } = require("./database");
const { initSocketEvents } = require("./socket");
const authRoute = require("./routes/auth");
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);
app.post("/receivecode", async (req, res) => {
  const { roomId } = req.body;

  try {
    const roomMap = await RoomCodeMap.findOne({ roomId });
    if (roomMap) {
      res.json({ code: roomMap.code });
    } else {
      res
        .status(404)
        .json({ error: "Code not found for the specified room" });
    }
  } catch (error) {
    console.error("Error retrieving code from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const startServer = async () => {
  const MONGO_URL = process.env.MONGO_URL;
  await connectToDatabase(MONGO_URL);

  initSocketEvents(new Server(
