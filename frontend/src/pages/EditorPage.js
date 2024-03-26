import React, { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [storedUserData, setStoredUserData] = useState(null);
  const [connectedUsernames, setConnectedUsernames] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [fileContent, setFileContent] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat window
  const [contentChanged, setContentChanged] = useState(false);

  const handleMessageSend = () => {
    if (inputText.trim() !== '') {
      const message = { text: inputText };
      socketRef.current.emit(ACTIONS.MESSAGE_SEND, { roomId, message, sender: storedUserData.sub, sendname: storedUserData.name });
      setInputText('');
    }
  };

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState); // Toggle chat window
  };

  const leaveRoom = () => {
    navigate('/', {
      state: { roomId },
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setContentChanged(!contentChanged);
    reader.onload = (e) => {
      const content = e.target.result;
      setFileContent(content);
    };
    if(file)
    {reader.readAsText(file);}
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
        navigate('/');
      }

      const userData = localStorage.getItem("userData");
      if (userData) {
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
        setMessages(prev => [...prev, { text, sender, sentByCurrentUser: sender === storedUserData.sub, sendname }]);
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
         
