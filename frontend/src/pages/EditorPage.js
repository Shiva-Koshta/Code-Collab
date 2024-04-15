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
import FileView from "../components/FileView";
import { initSocket } from "../socket";
import "../styles/EditorPage.css";
import "../styles/Chat.css";
import logo from "../images/Logo.png";
import Chat from "../components/Chat";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { ToastContainer, toast as reactToastify } from "react-toastify";
import ChatIcon from "@mui/icons-material/Chat";
import "react-toastify/dist/ReactToastify.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

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
  const [storedUserData, setStoredUserData] = useState([]);
  const [host, setHost] = useState("");
  const [connectedUserroles, setConnectedUserroles] = useState([]);
  const connectedUsernamesRef = useRef([]);
  // const [connectedUsernames, setConnectedUsernames] = useState([])
  const [connectedUsers, setConnectedUsers] = useState([]);
  // const [messages, setMessages] = useState([]);

  const [messages, setMessages] = useState(() => {
    const storedMessages = window.localStorage.getItem(`messages_${roomId}`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  });
  const CHAT_LIMIT = 15; // Global variable for chat limit

  const [inputText, setInputText] = useState("");

  // const fileRef=useRef(null);
  // const [isOpen, setIsOpen] = useState(true);
  const [isConnectedComponentOpen, setIsConnectedComponentOpen] =
    useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat window

  const [unreadMessages, setUnreadMessages] = useState(-1);
  const downloadFileExtension = "";
  const downloadFileName = "";
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(true);
  const leftIcon = isLeftDivOpen ? <ChevronLeft /> : <ChevronRight />;

  const toggleLeftDiv = () => {
    setIsLeftDivOpen((prevState) => !prevState);
  };

  const handleMessageSend = () => {
    console.log(storedUserData);
    if (inputText.trim() !== "") {
      const message = { text: inputText };
      socketRef.current.emit(ACTIONS.MESSAGE_SEND, {
        roomId,
        message,
        sender: storedUserData.sub,
        sendname: storedUserData.name,
      });
      setInputText("");
    }
  };

  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState); // Toggle chat window
    setUnreadMessages(-1);
  };
  useEffect(() => {
    if (!isChatOpen) {
      setUnreadMessages((prevCount) => prevCount + 1);
    }
  }, [messages, isChatOpen]);

  const handleToggle = () => {
    setIsConnectedComponentOpen(!isConnectedComponentOpen);
  };

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
        setStoredUserData(JSON.parse(userData));
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
      );
      socketRef.current.on(ACTIONS.HOST_CHANGE, ({ }) => {
        console.log("host changed");
      });
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
          setConnectedUserroles(
            data.users.map((user) => ({ name: user.name, role: user.role }))
          );
          setHost(data.host);
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
  const leaveRoom = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userCountResponse = await fetch("http://localhost:8080/rooms/numUsersInRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });
      if (userCountResponse.ok) {
        const { numUsers } = await userCountResponse.json();
        if (numUsers === 1) {
          const confirmDownload = window.confirm(
            "You are the last user in the room. Once leaving the room the data will be deleted permanently. Do you want to download the content of the room before leaving ?"
          );
          if (confirmDownload) {
            handleDownloadFile();
            setTimeout(async () => {
              const leaveResponse = await fetch("http://localhost:8080/delete-entry", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomId, username: userData.name }),
              });

              if (leaveResponse.ok) {
                const data = await leaveResponse.json();
                console.log(data);
                reactNavigator("/", { roomId });
              } else {
                reactNavigator("/", { roomId });
              }
            }, 2000);
          } else {
            const leaveResponse = await fetch("http://localhost:8080/delete-entry", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ roomId, username: userData.name }),
            });

            if (leaveResponse.ok) {
              const data = await leaveResponse.json();
              console.log(data);
              reactNavigator("/", { roomId });
            } else {
              reactNavigator("/", { roomId });
            }
          }
        } else {
          const leaveResponse = await fetch("http://localhost:8080/delete-entry", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, username: userData.name }),
          });

          if (leaveResponse.ok) {
            const data = await leaveResponse.json();
            console.log(data);
            reactNavigator("/", { roomId });
          } else {
            reactNavigator("/", { roomId });
          }
        }
      } else {
        throw new Error("Failed to fetch user count from the server");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };


  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };

  const handleDownloadFile = () => {
    const myContent = editorRef.current.getValue();
    const element = document.createElement("a");
    const file = new Blob([myContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${downloadFileName}.${downloadFileExtension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="grid grid-cols-10">
        {<Toaster position="top-center" reverseOrder={false} />}

        {/* {isLeftDivOpen && ( */}

        <div
          className={`flex flex-col justify-between h-screen text-white px-4 relative transition-all duration-500 ease-in-out transform ${isLeftDivOpen ? "col-span-2 " : "-translate-x-full"
            }`}
          style={{ backgroundColor: "#1c1e29" }}
        >
          <div className="logo flex items-center">
            <img className="h-20" src={logo} alt="logo" />
            <div className="flex flex-col w-full">
              <p className="text-4xl md:text-2xl text-center lg:text-3xl xl:text-4xl madimi-one-regular whitespace-nowrap">
                Code Collab
              </p>
            </div>
          </div>
          {/* <UploadFilesFolders />           */}
          <FileView
            contentChanged={contentChanged}
            setContentChanged={setContentChanged}
            fileContent={fileContent}
            setFileContent={setFileContent}
            editorRef={editorRef}
          />
          <div className="Users z-10">
            <div
              className="flex justify-between items-center"
              onClick={handleToggle}
            >
              <p className="my-3 font-bold text-lg">Connected Users here</p>
              {isConnectedComponentOpen && <ArrowDropUpIcon />}
              {!isConnectedComponentOpen && <ArrowDropDownIcon />}
            </div>
            <div className="UserListContainer">
              <div className="UserListContainer">
                {isConnectedComponentOpen &&
                  connectedUsers.map((user) => (
                    <div className="UserListItem" key={user.username}>
                      <img
                        src={user.profileImage}
                        alt={user.username}
                        className="img"
                      />
                      <div className="username">
                        {user.username.split(" ")[0]}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              <button
                className="btn chat-btn"
                onClick={toggleChat}
                style={{ position: "relative" }}
              >
                Chat{" "}
                {unreadMessages > 0 && (
                  <span
                    className="unread-messages"
                    style={{
                      position: "absolute",
                      top: "-5px", // Adjust the positioning to align properly
                      right: "-5px", // Adjust the positioning to align properly
                      color: "black",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "bold",
                      border: "2px solid black",
                      background: "white",
                    }}
                  >
                    {unreadMessages}
                  </span>
                )}
              </button>
              <button className="btn-edit copyBtn" onClick={copyRoomId}>
                Copy Room ID
              </button>
            </div>
            <button className="btn-edit leaveBtn" onClick={leaveRoom}>
              Leave
            </button>
          </div>

          <div className="absolute right-0 top-1/2 transform transition duration-500 hover:animate-bounce-left">
            <button onClick={toggleLeftDiv}>{leftIcon}</button>
          </div>
        </div>
        <div
          className={`${isLeftDivOpen ? "col-span-8" : "w-full absolute top-0 left-0 "
            }  overflow-y-auto transition-all duration-500 ease-in-out`}
          style={{ width: isChatOpen ? `calc(100% - 300px)` : "100%" }}
        >
          <Editor
            handleDownloadFile={handleDownloadFile}
            socketRef={socketRef}
            roomId={roomId}
            fileContent={fileContent}
            setFileContent={setFileContent}
            editorRef={editorRef}
            contentChanged={contentChanged}
            connectedClients={connectedUsernamesRef}
          />
          {!isLeftDivOpen && (
            <div className="absolute left-0 top-1/2 transform transition duration-500 hover:animate-bounce-right">
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
          <div>
            <Chat
              setIsChatOpen={setIsChatOpen}
              messages={messages}
              CHAT_LIMIT={CHAT_LIMIT}
              inputText={inputText}
              setInputText={setInputText}
              handleKeyPress={handleKeyPress}
              handleMessageSend={handleMessageSend}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage;
