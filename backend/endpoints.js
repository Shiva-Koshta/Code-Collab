const express = require("express");
const router = express.Router();
const RoomCodeMap = require("./models/RoomCodeMap");
const RoomUserCount = require("./models/RoomUserCount");
const FileNodeSchema = require("./models/FileNode");
const authRoute = require("./routes/auth");
const nodemailer = require("nodemailer");
const { io, server, http } = require("./server");
const ACTIONS = require("../frontend/src/Actions");
const mongoose = require("mongoose");
//initialise env file
const FileNode = mongoose.model("FileNode", FileNodeSchema);
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
  if (!roomId) {
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
// Endpoint to handle deleting room entry
router.post("/delete-entry", async (req, res) => {
  const { roomId, username } = req.body;

  try {
    // Decrement userCount in RoomUserCount model
    const room = await RoomUserCount.findOneAndUpdate(
      { roomId },
      { $inc: { userCount: -1 } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Remove the disconnected user from the room's user list
    const index = room.users.findIndex((user) => user.username === username);
    const updatedUsers =
      index !== -1
        ? [...room.users.slice(0, index), ...room.users.slice(index + 1)]
        : room.users;

    // Check if the removed user was the host
    let newHost = null;
    if (room.hostname === username) {
      // If the removed user was the host, find a new host among the remaining users
      const editor = updatedUsers.find((user) => user.role === "editor");
      if (editor) {
        // If an editor is available, make them the new host
        newHost = editor.username;
      } else {
        // If no editor is available, promote a viewer to an editor and make them the host
        const viewerIndex = updatedUsers.findIndex(
          (user) => user.role === "viewer"
        );
        if (viewerIndex !== -1) {
          // Promote the viewer to an editor
          updatedUsers[viewerIndex].role = "editor";
          // Set the new host
          newHost = updatedUsers[viewerIndex].username;
        }
      }
    }
    let flag = 0;

    // Update RoomUserCount model with updated users and possibly a new host
    if (newHost === null) {
      flag = 1;
      newHost = room.hostname;
    }
    await RoomUserCount.findOneAndUpdate(
      { roomId },
      { users: updatedUsers, hostname: newHost },
      { new: true }
    );

    // If a new host is assigned, emit a socket action for host change
    if (flag == 0) {
      console.log(`Host for room ${roomId} changed to ${newHost}.`);
      io.to(roomId).emit(ACTIONS.HOST_CHANGE, { newHost });
    }

    // If userCount becomes 0, delete the room code map entry
    if (room.userCount === 0) {
      console.log("hi");
      const deletedRoomCodeMap = await RoomCodeMap.findOneAndDelete({ roomId });
      let deletedCount = 0;
      const fileNodes = await FileNode.find({ roomId });

      for (const fileNode of fileNodes) {
        const deletedFileNode = await FileNode.findOneAndDelete({
          roomId: fileNode.roomId,
        });
        if (deletedFileNode) {
          deletedCount++;
        }
      }

      if (!deletedRoomCodeMap) {
        return res.status(404).json({ error: "Room code map entry not found" });
      }
    }

    return res.json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error removing user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/initialize", async (req, res) => {
  const { roomId, username } = req.body;

  try {
    // Check if the room exists
    const existingRoom = await RoomUserCount.findOne({ roomId });

    if (!existingRoom) {
      // If the room doesn't exist, create a new room document
      const newRoom = new RoomUserCount({
        roomId,
        userCount: 1, // Increment the user count by 1 when initializing the room
        hostname: username,
        users: [{ username, role: "editor" }],
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
      existingRoom.users.push({ username, role: "viewer" });
      existingRoom.userCount++; // Increment user count by 1
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

router.post("/help", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, Email and Message are required" });
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
