require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoute = require("./routes/auth");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");
const { Server } = require("socket.io");
const http = require("http");
const ACTIONS = require("../frontend/src/Actions");
const RoomCodeMap = require("./models/RoomCodeMap");
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
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const roomCodeMap = {};

const io = new Server(server);

// might to needed to store it in redux or database
const userSocketMap = {};
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => {
//     console.log("connected to database");
//     server.listen(port, () => console.log(`Listenting on port ${port}...`));
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// this function could be shifted to some other file where all similar functions are written
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
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
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // Save or update the code in the database
    RoomCodeMap.findOneAndUpdate(
      { roomId },
      { code },
      { new: true, upsert: true }
    )
      .then((updatedMap) => {
        //console.log("Code updated in database:");
      })
      .catch((error) => {
        //console.error("Error updating code in database:", error);
      });

    // Emit the code change to other sockets in the room
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  socket.on(ACTIONS.CURSOR_CHANGE, ({ roomId, cursorData }) => {
    socket.in(roomId).emit(ACTIONS.CURSOR_CHANGE, { cursorData });
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
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
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

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });
// app.use(cors({ origin: "*" }));

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
app.post("/receivecode", (req, res) => {
  const { roomId } = req.body;

  // Retrieve the code from the database
  RoomCodeMap.findOne({ roomId })
    .then((roomMap) => {
      if (roomMap) {
        res.json({ code: roomMap.code });
      } else {
        res
          .status(404)
          .json({ error: "Code not found for the specified room" });
      }
    })
    .catch((error) => {
      console.error('Error retrieving code from database:', error)
      res.status(500).json({ error: 'Internal server error' })
    })
})
// to handle post request from help page
app.post('/help', (req, res) => {
  console.log(req.body)
  res.status(200).json({ message: 'Form submitted' })
})

// check and delete the room data if no user in the room
app.post('/delete-entry', async (req, res) => {
  // console.log("hit");
  const { roomId } = req.body

  try {
    // Check if the user count for the room is zero
    const room = await RoomUserCount.findOne({ roomId })

    if (!room) {
      return res.status(200).json({ message: 'Room not found' })
    }

    if (room.userCount !== 0) {
      return res.status(200).json({ message: 'done' })
    }

    // If user count is zero, delete the entry from RoomCodeMap
    const deletedRoomCodeMap = await RoomCodeMap.findOneAndDelete({ roomId })

    if (!deletedRoomCodeMap) {
      return res.status(404).json({ error: 'Room code map entry not found' })
    }

    return res.json({ message: 'Room code map entry deleted successfully' })
  } catch (error) {
    console.error('Error deleting room code map entry:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})
// connect to database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to database");
    // server.listen(port, () => console.log(`Listenting on port ${port}...`));
  })
  .catch((error) => {
    console.log(error);
  });

server.listen(port, () => console.log(`Listenting on port ${port}...`));
