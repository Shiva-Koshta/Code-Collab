import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
// import "./Editor.css";
import ACTIONS from "../Actions";
import toast from 'react-hot-toast';
import Editor from "../components/Editor";
import FileView from "../components/FileView";
import { initSocket } from "../socket";
import { Toaster } from 'react-hot-toast';
import '../styles/EditorPage.css';
import '../styles/Chat.css';
import logo from '../images/Logo.png'

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
  const [fileContent, setFileContent] = useState("");
  // const fileRef=useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  // const [isOpen, setIsOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat window
  const [contentChanged, setContentChanged] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(-1);
  const handleMessageSend = () => {
    console.log(storedUserData);
    if (inputText.trim() !== '') {
      const message = { text: inputText };
      socketRef.current.emit(ACTIONS.MESSAGE_SEND, { roomId, message, sender: storedUserData.sub, sendname: storedUserData.name });
      setInputText('');
    }
  };

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState); // Toggle chat window
    setUnreadMessages(-1);
  };
  useEffect(() => {
    if (!isChatOpen) {
      setUnreadMessages(prevCount => prevCount + 1);
    }
  }, [messages, isChatOpen]);
  const leaveRoom = () => {
    console.log("in LeaveRoom")
    reactNavigator('/', {
      roomId: roomId,
    });
  };
  const handleFileChange = (event) => {
    console.log("reached");
    const file = event.target.files[0];
    const reader = new FileReader();
      setContentChanged(!contentChanged);
      // console.log(contentChanged);
    reader.onload = (e) => {
     const content = e.target.result;
      setFileContent(content);
      // console.log(content);
      // fileRef.current = content;
    };
    if(file)
    {reader.readAsText(file);}
    // console.log("fileref here:",fileContent);
    event.target.value = null;
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
        if (socketId !== socketRef.current.id) {
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

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ username }) => {
        toast.success(
          <div style={{ display: "flex", alignItems: "center" }}>
            <span role="img" aria-label="enter" style={{ marginRight: "8px" }}>⬅️</span>
            <span><strong>{username}</strong> left the room</span>
          </div>
        );
        console.log(`${username} left the room`);
        setClients(prev => {
          const updatedClients = prev.filter(client => client.username !== username);
          setConnectedUsernames(updatedClients.map(client => client.username));
          return updatedClients;
        });
      });
      socketRef.current.on(ACTIONS.MESSAGE_RECEIVE, ({ text, sender, sendname }) => {
        console.log(`${sender}: ${text}`);
        console.log(storedUserData);
        console.log(userData);
        setMessages(prev => [...prev, { text, sender, sentByCurrentUser: sender === JSON.parse(userData).sub, sendname }]);
      });
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);


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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMessageSend();
    }
  };

  return (
    <div className="" style={{display: "grid", gridTemplateColumns: "1fr 6fr"}}>
      <Toaster />

      <div 
        className="flex flex-col justify-between h-screen text-white p-4 pb-5"
        style={{backgroundColor: "#1c1e29"}}
      >
        <div className="logo flex gap-6">
          <img className="h-24" src={logo} alt="logo" />
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl madimi-one-regular">Code Collab</h2>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="fileTreeView">
            <p className="my-3 text-lg font-bold" for="file_input">
              Upload file
            </p>
            <input
              className="mb-3"
              style={{color: "#1c1e29"}}
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />

            <FileView></FileView>
          </div>

          <div className="Users">
            <h3 className="my-3 font-bold text-lg">Connected Users here</h3>
            {connectedUsernames.map(username => (
              <div className="UserList" key={username}>{username}</div>
            ))}
          </div>
        </div>
        <div>
          <button className="btn chatBtn" onClick={toggleChat} >Chat {unreadMessages > 0 && <span className="unread-messages" style={{ color : "red" , borderRadius : "50%", border: "black", background:"white"}}>{unreadMessages}</span>}</button>
          <button className="btn-edit copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
          <button className="btn-edit leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
        </div>
      </div>

       
      <div className="overflow-y-auto">
        <Editor
          fileContent={fileContent}
          socketRef={socketRef}
          roomId={roomId}
          contentChanged={contentChanged}
        />
      </div>

      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-popup">
            <div className="chat-header">
              <h2>Chat</h2>
              <button className="close-icon" onClick={() => setIsChatOpen(false)}>X</button>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={` ${message.sentByCurrentUser ? 'sent_by_user' : 'chat-message'}`}>
                  <span className="message-sender">{message.sentByCurrentUser ? 'You' : message.sendname}:</span> {message.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="input-field"
              />
              <button onClick={handleMessageSend} className="send-button">Send</button>
            </div>
          </div>
        </div>
      )}




    </div>

  );
};

export default EditorPage;
