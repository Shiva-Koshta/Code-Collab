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
  const editorRef = useRef(null);
  const [fileContent, setFileContent] = useState("");

  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [storedUserData, setStoredUserData] = useState([]);
  const [connectedUsernames, setConnectedUsernames] = useState([]);
 // const [messages, setMessages] = useState([]);
 const [messages, setMessages] = useState(() => {
      const storedMessages = localStorage.getItem(`messages_${roomId}`);
      return storedMessages ? JSON.parse(storedMessages) : [];
     });
  const CHAT_LIMIT = 15; // Global variable for chat limit    
   
 
 const [inputText, setInputText] = useState('');
  
  // const fileRef=useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  // const [isOpen, setIsOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat window

  const [unreadMessages, setUnreadMessages] = useState(-1);
  const [downloadFileExtension, setFileExtension] = useState("");
  const [downloadFileName, setFileName] = useState("");
  


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
          picture: JSON.parse(userData).picture,
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
        const newMessage = { text, sender, sentByCurrentUser: sender === JSON.parse(userData).sub, sendname };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, newMessage].slice(-CHAT_LIMIT);
         localStorage.setItem(`messages_${roomId}`, JSON.stringify(updatedMessages));
          return updatedMessages;
        });  
      
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

  const handleDownloadFile = () => {
    const myContent = editorRef.current.getValue();
    const element = document.createElement("a");
    const file = new Blob([myContent], { type: `text/plain` });
    element.href = URL.createObjectURL(file);
    element.download = `${downloadFileName}.${downloadFileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="grid grid-cols-10" >
        <Toaster />

        <div
          className="col-span-2 flex flex-col justify-between h-screen text-white p-4 pb-5"
          style={{ backgroundColor: "#1c1e29" }}
          >
          <div className="logo flex items-center">
            <img className="h-20" src={logo} alt="logo" />
            <div className="flex flex-col w-full">
              <p className="text-4xl md:text-2xl text-center lg:text-3xl xl:text-4xl madimi-one-regular whitespace-nowrap">Code Collab</p>
            </div>
          </div>
          <div className="flex flex-col justify-between h-full">
            <FileView fileContent={fileContent} setFileContent={setFileContent} editorRef={editorRef}/>
            <div className="Users">
              <h3 className="my-3 font-bold text-lg">Connected Users here</h3>
              {connectedUsernames.map(username => (
                <div className="UserList" key={username}>{username}</div>
                ))}
            </div>
          </div>
          <div>
            <div className="flex gap-2">
              <button className="btn chatBtn" onClick={toggleChat} >Chat {unreadMessages > 0 && <span className="unread-messages" style={{ color : "red" , borderRadius : "50%", border: "black", background:"white"}}>{unreadMessages}</span>}</button>
              <button className="btn-edit copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
            </div>
            <button className="btn-edit leaveBtn" onClick={leaveRoom}>
              Leave
            </button>

          </div>
        </div>


        <div className="col-span-8 overflow-y-auto">
          <Editor
            handleDownloadFile={handleDownloadFile}
            socketRef={socketRef}
            roomId={roomId}
            fileContent={fileContent}
            setFileContent={setFileContent}
            editorRef = {editorRef}
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
                {messages.slice(-CHAT_LIMIT).map((message, index) => (
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
    </div>

  );
};

export default EditorPage;
