const mongoose = require("mongoose");

// Ensure Mongoose connection is established before defining schema and model
mongoose.connect("mongodb://localhost:27017/my-app-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
}, {
  // Add a timestamp field to each document
  timestamps: true,
});

// Define a static method to find a document by its roomId field
roomCodeMapSchema.statics.getByRoomId = function(roomId) {
  return this.findOne({ roomId });
};

const RoomCodeMap = mongoose.model("RoomCodeMap", roomCodeMapSchema);

// Handle any errors that may occur during Mongoose connection
mongoose.connection.on("error", (error) => {
  console.error("Mongoose connection error:", error);
});

// Export the RoomCodeMap model, along with a disconnect method
module.exports = {
  RoomCodeMap,
  disconnect: () => mongoose.disconnect(),
};

