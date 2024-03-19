require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const authRoute = require('./routes/auth')
const cookieSession = require('cookie-session')
// eslint-disable-next-line no-unused-vars
const passportStrategy = require('./passport')
const { Server } = require('socket.io')
const http = require('http')
const ACTIONS = require('../frontend/src/Actions')
const RoomCodeMap = require('./models/RoomCodeMap')
const RoomUserCount = require('./models/RoomUserCount')
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 8080

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  })
)
const bodyParser = require('body-parser')
app.use(bodyParser.json())
// const roomCodeMap = {}

const io = new Server(server)

// might to needed to store it in redux or database
const userSocketMap = {}
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
function getAllConnectedClients (roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId]
      }
    }
  )
}

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id)

  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    // Add the user to the socket map
    userSocketMap[socket.id] = username

    // Join the room
    socket.join(roomId)

    // Increment the user count for the room
    try {
      // Find the document for the room ID and update the user count
      // console.log("hi");
      const updatedRoom = await RoomUserCount.findOneAndUpdate(
        { roomId },
        { $inc: { userCount: 1 } }, // Increment userCount by 1
        { new: true, upsert: true } // Return the updated document and create if it doesn't exist
      )
      // console.log(updatedRoom);

      // Get all connected clients for the room
      const clients = getAllConnectedClients(roomId)

      // Emit the JOINED event to all clients in the room
      clients.forEach(({ socketId }) => {
        io.to(socketId).emit(ACTIONS.JOINED, {
          clients,
          username,
          socketId: socket.id,
          userCount: updatedRoom.userCount // Pass the updated user count to clients
        })
      })
    } catch (error) {
      console.error('Error updating user count:', error)
    }
  })
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
        console.error('Error retrieving code from database:', error)
      })

    // Emit the code change to other sockets in the room
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code })
  })
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    // console.log("yes code syncing");
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code })
  })

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms]
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id]
      })
    })
    delete userSocketMap[socket.id]
    socket.leave()
  })

  socket.on('disconnecting', () => {
    // Iterate through each room the socket is connected to
    socket.rooms.forEach((roomId) => {
      // Find the document for the room ID, decrement the userCount, and return the updated document
      RoomUserCount.findOneAndUpdate(
        { roomId },
        { $inc: { userCount: -1 } }, // Decrement userCount by 1
        { new: true } // Return the updated document
      )
        .then((updatedRoom) => {
          // console.log('User count updated:', updatedRoom)
        })
        .catch((error) => {
          console.error('Error updating user count:', error)
        })
    })
  })

  socket.on(ACTIONS.JOIN, ({ roomId }) => {
    socket.join(roomId)
    console.log(`User joined room ${roomId}`)
  })

  socket.on(ACTIONS.MESSAGE_SEND, ({ roomId, message, sender, sendname }) => {
    console.log(sender)
    console.log(sendname)
    io.to(roomId).emit(ACTIONS.MESSAGE_RECEIVE, {
      text: message.text,
      sender,
      sendname
    })
  })
})

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
    name: 'session',
    keys: ['cyberwolve'],
    maxAge: 24 * 60 * 60 * 100
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoute)
app.post('/receivecode', (req, res) => {
  const { roomId } = req.body

  // Retrieve the code from the database
  RoomCodeMap.findOne({ roomId })
    .then((roomMap) => {
      if (roomMap) {
        res.json({ code: roomMap.code })
      } else {
        res
          .status(404)
          .json({ error: 'Code not found for the specified room' })
      }
    })
    .catch((error) => {
      console.error('Error retrieving code from database:', error)
      res.status(500).json({ error: 'Internal server error' })
    })
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
    console.log('connected to database')
    // server.listen(port, () => console.log(`Listenting on port ${port}...`));
  })
  .catch((error) => {
    console.log(error)
  })

server.listen(port, () => console.log(`Listenting on port ${port}...`))
