const express = require("express");
const router = express.Router();
const RoomUserCount = require("../models/RoomUserCount");
const FileNodeSchema = require("../models/FileNode");
const authRoute = require("./auth");
const nodemailer = require("nodemailer");
const { io, server, http } = require("../server");
const ACTIONS = require("../../frontend/src/Actions");
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

 /*
  Handles the POST request for '/rooms/numUsersInRoom' endpoint to get the number of users in a room.
  Inputs:
    req (object): The request object containing the room ID in the body.
    res (object): The response object.
  Outputs:
    JSON: Response with the number of users in the room or error message.
  Implementation:
    - Retrieves the room ID from the request body.
    - If room is found, returns the number of users in the room.
    - If an error occurs during the process, it is caught and a 500 error is returned.
  */
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


  /*
  Handles the POST request for '/delete-entry' endpoint to delete a room entry.
  Inputs:
    req (object): The request object containing the room ID and username in the body.
    res (object): The response object.
  Outputs:
    JSON: Response with success message or error message.
  Implementation:
    - Retrieves the room ID and username from the request body.
    - Decrements the user count in the RoomUserCount model for the specified room.
    - Removes the disconnected user from the room's user list and determines if a new host needs to be assigned.
    - Updates the RoomUserCount model with the updated users and possibly a new host.
  */
router.post("/delete-entry", async (req, res) => {
  const { roomId, username } = req.body;

  try {
   
    const room = await RoomUserCount.findOneAndUpdate(
      { roomId },
      { $inc: { userCount: -1 } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    
    const index = room.users.findIndex((user) => user.username === username);
    const updatedUsers =
      index !== -1
        ? [...room.users.slice(0, index), ...room.users.slice(index + 1)]
        : room.users;

   
    let newHost = null;
    if (room.hostname === username) {
      
      const editor = updatedUsers.find((user) => user.role === "editor");
      if (editor) {
        
        newHost = editor.username;
      } else {
        
        const viewerIndex = updatedUsers.findIndex(
          (user) => user.role === "viewer"
        );
        if (viewerIndex !== -1) {
          
          updatedUsers[viewerIndex].role = "editor";
          
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

    
    if (flag == 0) {
      console.log(`Host for room ${roomId} changed to ${newHost}.`);
      io.to(roomId).emit(ACTIONS.HOST_CHANGE, { newHost });
    }

    // If userCount becomes 0, delete the room code map entry
    if (room.userCount === 0) {
      
      
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

      
    }

    return res.json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Error removing user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//Initaialize the newly created room
router.post("/initialize", async (req, res) => {
  const { roomId, username } = req.body;

  try {
   
    const existingRoom = await RoomUserCount.findOne({ roomId });

    if (!existingRoom) {
     
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
  /*
  Handles the POST request for '/getdetails' endpoint to retrieve room details.
  Inputs:
    req (object): The request object containing the room ID in the body.
    res (object): The response object.
  Outputs:
    JSON: Response with user details and hostname or error message.
  Implementation:
    - Retrieves the room ID from the request body.
    - Fetches room details including user list and hostname from the database.
    - Extracts usernames and roles from the room details.
    - Responds with user details and hostname.
  */
router.post("/getdetails", async (req, res) => {
  
  const { roomId } = req.body; 

  try {
    
    const roomDetails = await RoomUserCount.findOne({ roomId });

    if (!roomDetails) {
      return res.status(404).json({ error: "Room not found" });
    }

    
    const userRoles = roomDetails.users.map((user) => ({
      name: user.username,
      role: user.role,
    }));
    const host = roomDetails.hostname;

    
    return res.status(200).json({ users: userRoles, host });
  } catch (error) {
    console.error("Error fetching room details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//Endpoint called to help the user and send the query to administrator.
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
