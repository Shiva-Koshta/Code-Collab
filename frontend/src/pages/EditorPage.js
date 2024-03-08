import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import "./Editor.css";
import ACTIONS from "../Actions";
import toast from 'react-hot-toast';
import Editor from "../components/Editor";
import FileView from "../components/FileView";
import { initSocket } from "../socket";
import { Toaster } from 'react-hot-toast';
import '../styles/EditorPage.css';
import '../styles/Chat.css';


const EditorPage = () => {
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [storedUserData, setStoredUserData] = useState([]);
  const [connectedUsernames, setConnectedUsernames] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const handleMessageSend = () => {
    if (inputText.trim() !== '') {
      setMessages([...messages, { text: inputText }]);
      setInputText('');
    }
  };
  const leaveRoom = () => {
    console.log("in LeaveRoom")
    reactNavigator('/', {
      roomId: roomId,
    });
  };

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

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
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
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(
          <div style={{ display: "flex", alignItems: "center" }}>
            <span role="img" aria-label="enter" style={{ marginRight: "8px" }}>⬅️</span>
            <span><strong>{username}</strong> left the room</span>
          </div>
        );

        console.log(`${username} left the room`);
        setClients(prev => {
          const updatedClients = prev.filter(client => client.socketId !== socketId);
          setConnectedUsernames(updatedClients.map(client => client.username));
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
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy the Room ID');
      console.error(err);
    }
  }

  return (
    <div className="editor-page-grid">
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

      <div className="editor-container">
        <Editor />
      </div>

      <div className="chat-container">
        <div className="chat-popup">
          <div className="chat-header">
            <h2>Chat</h2>
            {/* <button onClick={handleCloseChat} className="close-button">
                            X
                        </button> */}
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className="chat-message">
                {message.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="input-field"
            />
            <button onClick={handleMessageSend} className="send-button">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
