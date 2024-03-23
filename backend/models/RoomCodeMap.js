const mongoose = require("mongoose");

const roomCodeMapSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const RoomCodeMap = mongoose.model("RoomCodeMap", roomCodeMapSchema);

module.exports = RoomCodeMap;
