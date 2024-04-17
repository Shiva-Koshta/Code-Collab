import React, { useState, useEffect, useRef } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
// import "./Editor.css";

import ACTIONS from "../Actions";
import toast, { Toaster } from "react-hot-toast";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import "../styles/EditorPage.css";
import "../styles/Chat.css";
import ChatIcon from "@mui/icons-material/Chat";
import Chat from "../components/Chat";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { ToastContainer, toast as reactToastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Sidebar from "../components/Sidebar";
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { MenuItem, Menu, IconButton } from '@mui/material';



const EditorPage = () => {
  const editorRef = useRef(null);
  const [fileContent, setFileContent] = useState("");
  const [contentChanged, setContentChanged] = useState(false);
  const { roomId } = useParams();
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  const [connectedUsernames, setConnectedUsernames] = useState([]);
  // const [storedUserData, setStoredUserData] = useState([]);
  // const [host, setHost] = useState("");
  const storedUserData = useRef([]);
  const host = useRef("");
  const [connectedUserRoles, setConnectedUserRoles] = useState([]);
  const connectedUsernamesRef = useRef([]);
  // const [connectedUsernames, setConnectedUsernames] = useState([])
  const [connectedUsers, setConnectedUsers] = useState([]);
  // const [messages, setMessages] = useState([]);

  const [messages, setMessages] = useState(() => {
    const storedMessages = window.localStorage.getItem(`messages_${roomId}`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const CHAT_LIMIT = 15; // Global variable for chat limit

  // const [inputText, setInputText] = useState("");

  // const fileRef=useRef(null);
  // const [isOpen, setIsOpen] = useState(true);
  // const [isConnectedComponentOpen, setIsConnectedComponentOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat window

  // const downloadFileExtension = "";
  // const downloadFileName = "";
  const [unreadMessages, setUnreadMessages] = useState(-1);
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(true);
  const leftIcon = isLeftDivOpen ? <ChevronLeft /> : <ChevronRight />;
  // const [menuOpen, setMenuOpen] = useState({})

  const toggleLeftDiv = () => {
    setIsLeftDivOpen(prevState => !prevState)
    console.log(isLeftDivOpen);
  }

  // const handleUserMenuToggle = (username) => {
  //   setMenuOpen(prevMenuOpen => ({
  //     ...prevMenuOpen,
  //     [username]: !prevMenuOpen[username]
  //   }));
  // };

  // const handleUserMenuToggle = (username) => {
  //   setMenuOpen(prevMenuOpen => ({
  //     ...prevMenuOpen,
  //     [username]: !prevMenuOpen[username]
  //   }));
  // };
  // const handleChangeRole = (username) => {
  //   const user = connectedUserRoles.find(user => user.name === username)
  //   if(!user)
  //   {
  //     console.error(`User with id ${username} not found.`)
  //     return
  //   }
  //   const newRole = user.role === 'viewer' ? 'editor' : 'viewer'

  //   setConnectedUserRoles(prevRoles => prevRoles.map(prevUser => {
  //     if(prevUser.name === username)
  //     {
  //       return {...prevUser, role:newRole}
  //     }
  //     return prevUser
  //   }))

  //   socketRef.current.emit(ACTIONS.ROLE_CHANGE, {
  //     roomId,
  //     username,
  //     newRole,
  //   })

  // }

  // const handleMessageSend = () => {
  //   console.log(storedUserData);
  //   if (inputText.trim() !== "") {
  //     const message = { text: inputText };
  //     socketRef.current.emit(ACTIONS.MESSAGE_SEND, {
  //       roomId,
  //       message,
  //       sender: storedUserData.sub,
  //       sendname: storedUserData.name,
  //     });
  //     setInputText("");
  //   }
  // };

  // const handleToggle = () => {
  //   setIsConnectedComponentOpen(!isConnectedComponentOpen);
  // };
  // const leaveRoom = async () => {
  //   try {
  //     const userData = JSON.parse(localStorage.getItem("userData"));
  //     const response = await fetch("http://localhost:8080/delete-entry", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ roomId, username: userData.name }), // Include roomId and username in the request body
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data); // log the response if needed
  //       reactNavigator("/", { roomId }); // Navigate to the home page after leaving the room
  //     } else {
  //       reactNavigator("/", { roomId });
  //     }
  //   } catch (error) {
  //     console.error("Error leaving room:", error);
  //     // Handle errors as needed
  //   }
  // };

  // async function copyRoomId() {
  //   try {
  //     await navigator.clipboard.writeText(roomId);
  //     toast.success("Room ID has been copied to your clipboard");
  //   } catch (err) {
  //     toast.error("Could not copy the Room ID");
  //     console.error(err);
  //   }
  // }

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter") {
  //     handleMessageSend();
  //   }
  // };

  // const handleDownloadFile = () => {
  //   const myContent = editorRef.current.getValue();
  //   const element = document.createElement("a");
  //   const file = new Blob([myContent], { type: "text/plain" });
  //   element.href = URL.createObjectURL(file);
  //   element.download = `${downloadFileName}.${downloadFileExtension}`;
  //   document.body.appendChild(element);
  //   element.click();
  //   document.body.removeChild(element);
  // };


  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState); // Toggle chat window
    setUnreadMessages(-1);
  };
  useEffect(() => {
    if (!isChatOpen) {
      setUnreadMessages((prevCount) => prevCount + 1);
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !isChatOpen) {
      reactToastify.info(`${lastMessage.sendname} : ${lastMessage.text}`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          backgroundColor: "#1c1e29", // Change this to your desired color
        },
      });
      // reactToastify.info(`${lastMessage.sendname} : ${lastMessage.text}`)
    }
  }, [messages]);
  useEffect(() => {
    connectedUsernamesRef.current = connectedUsernames;
    console.log(connectedUsernamesRef.current.length);
  }, [connectedUsernames]);

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
      const userData = window.localStorage.getItem("userData");
      if (userData) {
        console.log(JSON.parse(userData).name);
        // setStoredUserData(JSON.parse(userData));
        storedUserData.current = JSON.parse(userData)
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: JSON.parse(userData).name,
          picture: JSON.parse(userData).picture,
        });
      }
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, picture, socketId }) => {
          if (socketId !== socketRef.current.id) {
            toast.success(
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  role="img"
                  aria-label="enter"
                  style={{ marginRight: "8px" }}
                >
                  ➡️
                </span>
                <span>
                  <strong>{username}</strong> entered the room
                </span>
              </div>
            );
            console.log(`${username} joined`);
          }
          setClients(clients);
          const updatedUsers = clients.map((client) => ({
            username: client.username,
            profileImage: client.picture,
          }));
          setConnectedUsers(updatedUsers);
          setConnectedUsernames(clients.map((client) => client.username));

          setConnectedUserRoles(prevRoles => [...prevRoles, { id: socketId, name: username, role: 'editor' }])

          console.log(host.current)
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ username }) => {
        toast.success(
          <div style={{ display: "flex", alignItems: "center" }}>
            <span role="img" aria-label="enter" style={{ marginRight: "8px" }}>
              ⬅️
            </span>
            <span>
              <strong>{username}</strong> left the room
            </span>
          </div>
        );
        console.log(`${username} left the room`);
        console.log(clients); // added because clients was not used anywhere to avoid linting error
        setClients((prevClients) => {
          let removed = false;
          const updatedClients = prevClients.filter((client) => {
            if (!removed && client.username === username) {
              removed = true;
              return false;
            }
            return true;
          });
          const updatedUsers = updatedClients.map((client) => ({
            username: client.username,
            profileImage: client.picture,
          }));
          setConnectedUsers(updatedUsers);
          setConnectedUsernames(
            updatedClients.map((client) => client.username)
          );
          return updatedClients;
        });
        setConnectedUserRoles(prevRoles => prevRoles.filter(user => user.username !== username))
      });
      socketRef.current.on(
        ACTIONS.MESSAGE_RECEIVE,
        ({ text, sender, sendname }) => {
          const newMessage = {
            text,
            sender,
            sentByCurrentUser: sender === JSON.parse(userData).sub,
            sendname,
          };
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage].slice(
              -CHAT_LIMIT
            );
            window.localStorage.setItem(
              `messages_${roomId}`,
              JSON.stringify(updatedMessages)
            );
            return updatedMessages;
          });
        }

      )

      socketRef.current.on(ACTIONS.ROLE_CHANGE, ({ username, newRole }) => {
        // console.log("yes")
        console.log(username)
        console.log(newRole)

        // console.log(storedUserData.name)
        setConnectedUserRoles(prevRoles => prevRoles.map(prevUser => {
          if (prevUser.name === username) {
            return { ...prevUser, role: newRole }
          }
          return prevUser
        }))
        console.log(connectedUserRoles)
        console.log(connectedUsers)

        if (username === storedUserData.current.name && newRole == 'viewer') {

          console.log("yes")
          editorRef.current.setOption('readOnly', true)
          // editor.setOption('readOnly', true)
          // editor.readOnly.of(true)
        }
        if (username === storedUserData.current.name && newRole === 'editor') {
          editorRef.current.setOption('readOnly', false)
          // const editor = editorRef.current.getCodeMirror()
          // editor.setOption('readOnly', false)
        }
      })

      socketRef.current.on(ACTIONS.HOST_CHANGE, ({ username }) => {

        console.log(username)
        // setHost(username)
        host.current = username
        const fetchUserDetails = async () => {
          try {
            const response = await fetch("http://localhost:8080/getdetails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({ roomId }), // Include roomId in the request body
            });
            if (response.ok) {
              const data = await response.json();
              console.log(data);
              setConnectedUserRoles(
                data.users.map((user) => ({ name: user.name, role: user.role }))
              );
              // setHost(data.host);
              host.current = data.host;
            } else {
              throw new Error("Failed to fetch user details");
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        };


        fetchUserDetails();
        // fetchUserDetails();
      })
    };


    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:8080/getdetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ roomId }), // Include roomId in the request body
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setConnectedUserRoles(
            data.users.map((user) => ({ name: user.name, role: user.role }))
          );
          // setHost(data.host);
          host.current = data.host;
        } else {
          throw new Error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [roomId]); // Afetr this everythong can be done in the frontend using the data received.

  if (!location.state) {
    return <Navigate to="/" />;
  }


  return (
    <div className="flex flex-col justify-center">
      <div className="grid grid-cols-10">
        {<Toaster position="top-center" reverseOrder={false} />}

        {/* {isLeftDivOpen && ( */}
        <div style={{width: "300px", position:"fixed", left:"0", top:"0"}}>
        <Sidebar
          contentChanged={contentChanged}
          setContentChanged={setContentChanged}
          fileContent={fileContent}
          setFileContent={setFileContent}
          editorRef={editorRef}
          // isConnectedComponentOpen={isConnectedComponentOpen}
          // handleToggle={handleToggle}
          connectedUsers={connectedUsers}
          toggleChat={toggleChat}
          unreadMessages={unreadMessages}
          // copyRoomId={copyRoomId}
          // leaveRoom={leaveRoom}
          roomId={roomId}
          isLeftDivOpen={isLeftDivOpen}
          toggleLeftDiv={toggleLeftDiv}
          leftIcon={leftIcon}
          storedUserData={storedUserData}
          host={host}
          connectedUserRoles={connectedUserRoles}
          setConnectedUserRoles={setConnectedUserRoles}
          socketRef={socketRef}
        />

        </div>
        
        <div
          className={`overflow-y-scroll overflow-x-scroll transition-all duration-500 ease-in-out absolute top-0 `}
          style={{ width: isChatOpen ? (isLeftDivOpen ? `calc(100% - 592px)` : `calc(100% - 320px)`) : (isLeftDivOpen ? `calc(100% - 300px)` : `calc(100%)`),  left: isLeftDivOpen ?"300px": "0px", overflowX: "scroll", position:"fixed" }}
        >
          <Editor
            // handleDownloadFile={handleDownloadFile}
            socketRef={socketRef}
            roomId={roomId}
            fileContent={fileContent}
            setFileContent={setFileContent}
            editorRef={editorRef}
            contentChanged={contentChanged}
            connectedClients={connectedUsernamesRef}
          />
          {!isLeftDivOpen && (
            <div style={{zIndex: "9999"}} className="absolute left-0 top-1/2 transform transition duration-500 hover:animate-bounce-right">
              <button className="text-white" onClick={toggleLeftDiv}>
                {leftIcon}
              </button>
            </div>
          )}
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        {isChatOpen && (
          <div style={{backgroundColor: "#1c1e29"}}>
            <Chat
              setIsChatOpen={setIsChatOpen}
              messages={messages}
              // CHAT_LIMIT={CHAT_LIMIT}
              // inputText={inputText}
              // setInputText={setInputText}
              // handleKeyPress={handleKeyPress}
              // handleMessageSend={handleMessageSend}
              roomId={roomId}
              socketRef={socketRef}
              storedUserData={storedUserData}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;
