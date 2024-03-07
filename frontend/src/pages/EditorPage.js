import React, { useState, useEffect, useRef } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./Editor.css";
import ACTIONS from "../Actions";
import toast from "react-hot-toast";
import Editor from "../components/Editor";
import FileView from "../components/FileView";
import logo from "../res/bg.png";
import { initSocket } from "../socket";
import { set } from "mongoose";

const EditorPage = () => {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [storedUserData, setStoredUserData] = useState([]);
  const [fileContent, setFileContent] = useState("");

  const leaveRoom = () => {
    console.log("in LeaveRoom");
    reactNavigator("/", {
      roomId: roomId,
    });
  };

  const handleFileChange = (event) => {
    console.log("reached");
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
      console.log(content);
    };

    reader.readAsText(file);
  };

  const [connectedUsernames, setConnectedUsernames] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        reactNavigator("/");
      }

      const userData = localStorage.getItem("userData");
      if (userData) {
        console.log(JSON.parse(userData).name);
        setStoredUserData(JSON.parse(userData));
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: JSON.parse(userData).name,
        });
      }

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (socketId !== socketRef.current.id) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          setConnectedUsernames(clients.map((client) => client.username));
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        console.log(`${username} left the room`);
        setClients((prev) => {
          const updatedClients = prev.filter(
            (client) => client.socketId !== socketId
          );
          setConnectedUsernames(
            updatedClients.map((client) => client.username)
          );
          return updatedClients;
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);

      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src={logo} alt="logo" />
            <div className="Codecollab">Code Collab</div>
          </div>
          <div className="fileTreeView">
            <label className="fileLabel" for="file_input">
              Upload file
            </label>
            <input
              className="FileInput"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
            <FileView></FileView>
          </div>
        </div>
        <div className="Users">
          <h3>Connected Users here</h3>
          {connectedUsernames.map((username,) => (
            <div className="Userlist"key={username}>{username}</div>
          ))}
        </div>

        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div>
        <Editor fileContent={fileContent}></Editor>
      </div>
    </div>
  );
};

export default EditorPage;
