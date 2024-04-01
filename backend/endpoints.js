const express = require("express");
const router = express.Router();
const RoomCodeMap = require("./models/RoomCodeMap");
const RoomUserCount = require("./models/RoomUserCount");
const authRoute = require("./routes/auth");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "codecollabhelp@gmail.com",
    pass: "dogk zdwu jdws dxpp",
  },
});

router.use("/auth", authRoute);

// Endpoint to get the number of users in a room
router.post("/rooms/numUsersInRoom", async (req, res) => {
  try {
    const { roomId } = req.body;

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

router.post("/delete-entry", async (req, res) => {
  const { roomId } = req.body;

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
router.post("/initialize", async (req, res) => {
  // console.log("hey");
  const { roomId, username } = req.body;

  try {
    // Check if the room exists
    const existingRoom = await RoomUserCount.findOne({ roomId });

    if (!existingRoom) {
      // If the room doesn't exist, create a new room document
      const newRoom = new RoomUserCount({
        roomId,
        userCount: 0, // Initial user count is 1
        hostname: username, // Set the hostname to the username of the current user
        users: [{ username, role: "editor" }], // Add the current user as the host with role 'editor'
      });

      // Save the new room document
      await newRoom.save();

      // Respond with success message
      return res.status(200).json({ message: "Room initialized successfully" });
    }

    // If the room already exists
    // Check if the user is already present in the room
    const existingUser = existingRoom.users.find(
      (user) => user.username === username
    );
    if (!existingUser) {
      // If the user is not already present, add the user to the room as an editor
      existingRoom.users.push({ username, role: "editor" });
      await existingRoom.save();
    }

    // Respond with success message
    return res.status(200).json({ message: "Room initialized successfully" });
  } catch (error) {
    console.error("Error initializing room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/getdetails", async (req, res) => {
  console.log("hi");
  const { roomId } = req.body; // Assuming roomId is sent as a query parameter

  try {
    // Fetch room details including user list and hostname
    const roomDetails = await RoomUserCount.findOne({ roomId });

    if (!roomDetails) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Extract usernames and roles from the room details
    const userRoles = roomDetails.users.map((user) => ({
      name: user.username,
      role: user.role,
    }));
    const host = roomDetails.hostname;

    // Respond with user details and hostname
    return res.status(200).json({ users: userRoles, host });
  } catch (error) {
    console.error("Error fetching room details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
