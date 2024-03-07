import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./Editor.css";
import ACTIONS from "../Actions";
import toast from 'react-hot-toast';
import Editor from "../components/Editor";
import FileView from "../components/FileView";
import { initSocket } from "../socket";
import { set } from "mongoose";
import { Toaster } from 'react-hot-toast';
const EditorPage = () => {

  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [storedUserData, setStoredUserData] = useState([]); 

  const leaveRoom = () => {
    console.log("in LeaveRoom")
    reactNavigator('/', {
      roomId: roomId,
    });
  };
  const [connectedUsernames, setConnectedUsernames] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
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

      socketRef.current.on(ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (socketId !== socketRef.current.id && socketId != socketRef.current.id) {
            toast.success(
              <div style={{ display: "flex", alignItems: "center" }}>
                <span role="img" aria-label="enter" style={{ marginRight: "8px" }}>➡️</span>
                <span><strong>{username}</strong> entered the room</span>
              </div>
            );
            console.log(`${username} joined`);
          }
          setClients(clients);
          setConnectedUsernames(clients.map(client => client.username));
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(
          <div style={{ display: "flex", alignItems: "center" }}>
            <span role="img" aria-label="enter" style={{ marginRight: "8px" }}>⬅️</span>
            <span><strong>{username}</strong> left the room</span>
          </div>
        );
        
        console.log(`${username} left the room`);
        setClients((prev) => {
          const updatedClients = prev.filter(
            client => client.socketId !== socketId
          );
          setConnectedUsernames(updatedClients.map(client => client.username));
          return updatedClients;
        });
      });
    }
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);

      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  }

  return (
    <div className="mainWrap">
      <Toaster />
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img className="logoImage" src="" alt="logo" />
          </div>
          <div className="fileTreeView">
            <FileView></FileView>
          </div>
          <div className="Users">
            <h3>Connected Users here</h3>
            {connectedUsernames.map(username => (
              <div key={username}>{username}</div>
            ))}
          </div>


        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div >
        <Editor></Editor>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default EditorPage;
