// RoomUserCount.js

const mongoose = require('mongoose')

const roomUserCountSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  userCount: {
    type: Number,
    required: true,
    default: 0
  }
})

const RoomUserCount = mongoose.model('RoomUserCount', roomUserCountSchema)

module.exports = RoomUserCount
