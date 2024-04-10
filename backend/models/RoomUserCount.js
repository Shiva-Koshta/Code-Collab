const mongoose = require("mongoose");

const roomUserCountSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  userCount: {
    type: Number,
    required: true,
    default: 0,
  },
  hostname: {
    type: String,
    required: false,
  },
  users: [
    {
      username: {
        type: String,
        required: false,
      },
      role: {
        type: String,
        required: false,
      },
    },
  ],
});

const RoomUserCount = mongoose.model("RoomUserCount", roomUserCountSchema);

module.exports = RoomUserCount;
