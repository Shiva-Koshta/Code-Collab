const express = require("express");
const router = express.Router();
const RoomCodeMap = require("./models/RoomCodeMap");
const RoomUserCount = require("./models/RoomUserCount");
const authRoute = require("./routes/auth");
const nodemailer = require("nodemailer");
//initialise env file
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});

router.use("/auth", authRoute);

// Endpoint to get the number of users in a room
router.post("/rooms/numUsersInRoom", async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }
    // Fetch the room from the database
    const room = await RoomUserCount.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Return the number of users in the room
    res.json({ numUsers: room.userCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to handle receiving code
router.post("/receivecode", async (req, res) => {
  const { roomId } = req.body;
  if(!roomId){
    return res.status(400).json({ error: "Room ID is required" });
  }

  try {
    const roomMap = await RoomCodeMap.findOne({ roomId });
    if (roomMap) {
      res.json({ code: roomMap.code });
    } else {
      res.status(404).json({ error: "Code not found for the specified room" });
    }
  } catch (error) {
    console.error("Error retrieving code from database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to handle help request
// router.post("/help", (req, res) => {
//   console.log("hi", req.body);
//   res.status(200).json({ message: "Form submitted" });
// });

// Endpoint to handle deleting room entry
router.post("/delete-entry", async (req, res) => {
  const { roomId } = req.body;
  //   console.log("hi", roomId);
  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }
  try {
    const room = await RoomUserCount.findOne({ roomId });
    if (!room) {
      return res.status(200).json({ message: "Room not found" });
    }
    if (room.userCount !== 0) {
      return res.status(200).json({ message: "done" });
    }

    const deletedRoomCodeMap = await RoomCodeMap.findOneAndDelete({ roomId });

    if (!deletedRoomCodeMap) {
      return res.status(404).json({ error: "Room code map entry not found" });
    }

    return res.json({ message: "Room code map entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting room code map entry:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/help", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if(!name || !email || !message){
      return res.status(400).json({ error: "Name, Email and Message are required" });
    }
    console.log(email);
    let mailOptions = {
      from: "codecollabhelp@gmail.com",
      to: "codecollabhelp@gmail.com",
      subject: "Help for Code Collab",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    let info = await transporter.sendMail(mailOptions);
    let mailOptions1 = {
      from: "codecollabhelp@gmail.com",
      to: email,
      subject: "Message recieved: Code Collab",
      text: `We have recieved your messgae: ${message}.\nAnd we will be getting back to you soon. Have a Good Day`,
    };

    let info1 = await transporter.sendMail(mailOptions1);
    console.log("Email sent: " + info.response);
    console.log("Email sent: " + info1.response);
    res.status(200).json({ message: "Form submitted" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the email" });
  }
});

module.exports = router;
