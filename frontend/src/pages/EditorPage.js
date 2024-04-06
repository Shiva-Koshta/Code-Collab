import React, { useState, useEffect, useRef } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
// import "./Editor.css";
import ACTIONS from '../Actions'
import toast, { Toaster } from 'react-hot-toast'
import Editor from '../components/Editor'
import FileView from '../components/FileView'
import { initSocket } from '../socket'
import '../styles/EditorPage.css'
import '../styles/Chat.css'
import logo from '../images/Logo.png'
import Chat from '../components/Chat'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { ToastContainer, toast as reactToastify } from 'react-toastify';
import ChatIcon from '@mui/icons-material/Chat';
import 'react-toastify/dist/ReactToastify.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import { MenuItem, Menu, IconButton } from '@mui/material';


const EditorPage = () => {
  const editorRef = useRef(null)
  const [fileContent, setFileContent] = useState('')
  const [contentChanged, setContentChanged] = useState(false)
  const { roomId } = useParams()
  const socketRef = useRef(null)
  const location = useLocation()
  const reactNavigator = useNavigate()
  const [clients, setClients] = useState([])
  const [storedUserData, setStoredUserData] = useState([])
  // const [connectedUsernames, setConnectedUsernames] = useState([])
  const [connectedUsers, setConnectedUsers] = useState([])
  // const [messages, setMessages] = useState([]);

  const [messages, setMessages] = useState(() => {
    const storedMessages = window.localStorage.getItem(`messages_${roomId}`)
    return storedMessages ? JSON.parse(storedMessages) : []
  })
  const CHAT_LIMIT = 15 // Global variable for chat limit

  const [inputText, setInputText] = useState('')

  // const fileRef=useRef(null);
  // const [isOpen, setIsOpen] = useState(true);
  const [isConnectedComponentOpen, setIsConnectedComponentOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false) // State to control chat window

  const [unreadMessages, setUnreadMessages] = useState(-1)
  const downloadFileExtension = ''
  const downloadFileName = ''
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(true)
  const leftIcon = isLeftDivOpen ? <ChevronLeft /> : <ChevronRight />
  const [anchorEl,setAnchorEl] = useState(null)

  const toggleLeftDiv = () => {
    setIsLeftDivOpen(prevState => !prevState)
  }

  const handleUserMenuOpen = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleChangeRole = (username) => {
    const user = connectedUserRoles.find(user => user.name === username)
    if(!user)
    {
      console.error(`User with id ${username} not found.`)
      return
    }

    const newRole = user.role === 'viewer' ? 'editor' : 'viewer'
    
    setConnectedUserRoles(prevRoles => prevRoles.map(prevUser => {
      if(prevUser.name === username)
      {
        return {...prevUser, role:newRole}
      }
      return prevUser
    }))

    socketRef.current.emit(ACTIONS.ROLE_CHANGE, {
      roomId,
      username,
      newRole,
    })

    // fetch('/http://localhost:8080/changerole', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     roomId: roomId,
    //     name: username, 
    //     role: newRole
    //   })
    // })
    // .then(response => {
    //   if (!response.ok) {
    //     console.error('Failed to change role')
    //   }
    // })
    // .catch(error => {
    //   console.error('Error changing role:', error)
    // })
  }
  const handleMessageSend = () => {
    console.log(storedUserData)
    if (inputText.trim() !== '') {
      const message = { text: inputText }
      socketRef.current.emit(ACTIONS.MESSAGE_SEND, {
        roomId,
        message,
        sender: storedUserData.sub,
        sendname: storedUserData.name
      })
      setInputText('')
    }
  }

  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState) // Toggle chat window
    setUnreadMessages(-1)
  }
  useEffect(() => {
    if (!isChatOpen) {
      setUnreadMessages((prevCount) => prevCount + 1)
    }
  }, [messages, isChatOpen])

  const leaveRoom = () => {
    reactNavigator('/', {
      roomId
    })
  }
  const handleToggle = () => {
    setIsConnectedComponentOpen(!isConnectedComponentOpen)
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && !isChatOpen) {

      reactToastify.info(
        `${lastMessage.sendname} : ${lastMessage.text}`, {
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
  }, [messages])

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket()
      socketRef.current.on('connect_error', (err) => handleErrors(err))
      socketRef.current.on('connect_failed', (err) => handleErrors(err))

      function handleErrors(e) {
        console.log('socket error', e)
        toast.error('Socket connection failed, try again later.')
        reactNavigator('/')
      }
      const userData = window.localStorage.getItem('userData')
      if (userData) {
        console.log(JSON.parse(userData).name)
        setStoredUserData(JSON.parse(userData))
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  role='img'
                  aria-label='enter'
                  style={{ marginRight: '8px' }}
                >
                  ➡️
                </span>
                <span>
                  <strong>{username}</strong> entered the room
                </span>
              </div>
            )
            console.log(`${username} joined`)
          }
          setClients(clients)
          const updatedUsers = clients.map(client => ({ username: client.username, profileImage: client.picture }));
          setConnectedUsers(updatedUsers);
          // setConnectedUsernames(clients.map((client) => client.username))
          setConnectedUserRoles(prevRoles => [...prevRoles, { id: socketId, name:username, role: 'editor' }])
        }
      )

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ username }) => {
        toast.success(
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span role='img' aria-label='enter' style={{ marginRight: '8px' }}>
              ⬅️
            </span>
            <span>
              <strong>{username}</strong> left the room
            </span>
          </div>
        )
        console.log(`${username} left the room`)
        console.log(clients)// added because clients was not used anywhere to avoid linting error
        setClients((prev) => {
          const updatedClients = prev.filter(
            (client) => client.username !== username
          )
          const updatedUsers = updatedClients.map(client => ({ username: client.username, profileImage: client.picture }));
          setConnectedUsers(updatedUsers);
          // setConnectedUsernames(
          //   updatedClients.map((client) => client.username)
          // )
          return updatedClients
        })
        setConnectedUserRoles(prevRoles => prevRoles.filter(user => user.username !== username))
      })
      socketRef.current.on(
        ACTIONS.MESSAGE_RECEIVE,
        ({ text, sender, sendname }) => {
          const newMessage = {
            text,
            sender,
            sentByCurrentUser: sender === JSON.parse(userData).sub,
            sendname
          }
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, newMessage].slice(
              -CHAT_LIMIT
            )
            window.localStorage.setItem(
              `messages_${roomId}`,
              JSON.stringify(updatedMessages)
            )
            return updatedMessages
          })
        }
      )
      socketRef.current.on(ACTIONS.ROLE_CHANGE, ({ username, newRole }) => {
        setConnectedUserRoles(prevRoles => prevRoles.map(prevUser => {
          if (prevUser.name === username) {
            return { ...prevUser, role: newRole }
          }
          return prevUser
        }))

        if (username === storedUserData.name && newRole=='viewer') { 
          const editor = editorRef.current.getCodeMirror()
          editor.setOption('readOnly', true)
        }
        if (username === storedUserData.name && newRole === 'editor') {
          const editor = editorRef.current.getCodeMirror()
          editor.setOption('readOnly', false)
        }
      })
      socketRef.current.on(ACTIONS.HOST_CHANGE, ({username}) => {
        setHost(username)
      })
    }

    init()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [roomId])

  if (!location.state) {
    return <Navigate to='/' />
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success('Room ID has been copied to your clipboard')
    } catch (err) {
      toast.error('Could not copy the Room ID')
      console.error(err)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMessageSend()
    }
  }

  const handleDownloadFile = () => {
    const myContent = editorRef.current.getValue()
    const element = document.createElement('a')
    const file = new Blob([myContent], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${downloadFileName}.${downloadFileExtension}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className='flex flex-col justify-center'>
      <div className='grid grid-cols-10'>
        {<Toaster position="top-center" reverseOrder={false} />}

        {/* {isLeftDivOpen && ( */}

        <div
          className={`flex flex-col justify-between h-screen text-white px-4 relative transition-all duration-500 ease-in-out transform ${isLeftDivOpen ? 'col-span-2 ' : '-translate-x-full'}`}
          style={{ backgroundColor: '#1c1e29' }}
        >
          <div className='logo flex items-center'>
            <img className='h-20' src={logo} alt='logo' />
            <div className='flex flex-col w-full'>
              <p className='text-4xl md:text-2xl text-center lg:text-3xl xl:text-4xl madimi-one-regular whitespace-nowrap'>Code Collab</p>
            </div>
          </div>
          <FileView
            contentChanged={contentChanged}
            setContentChanged={setContentChanged}
            fileContent={fileContent}
            setFileContent={setFileContent}
            editorRef={editorRef}
          />
          <div className='Users z-10'>
            <div className='flex justify-between items-center' onClick={handleToggle}>
              <p className='my-3 font-bold text-lg'>Connected Users here</p>
              {isConnectedComponentOpen && <ArrowDropUpIcon />}
              {!isConnectedComponentOpen && <ArrowDropDownIcon />}
            </div>
            <div className='UserListContainer'>
              <div className='UserListContainer'>
                {isConnectedComponentOpen && connectedUsers.map((user) => (
                  <div className='UserListItem' key={user.username}>
                    <img src={user.profileImage} alt={user.username} className='img' />
                    <div className='username'>{user.username.split(' ')[0]}</div>
                  </div>
                ))}
              </div>

            </div>

          </div>
          <div className='p-4'>
            <div className='flex gap-2'>
              <button className='btn chat-btn' onClick={toggleChat}>
                Chat{' '}
                {unreadMessages > 0 && (
                  <span
                    className='unread-messages'
                    style={{
                      color: 'red',
                      borderRadius: '50%',
                      border: 'black',
                      background: 'white'
                    }}
                  >
                    {unreadMessages}
                  </span>
                )}
              </button>
              <button className='btn-edit copyBtn' onClick={copyRoomId}>
                Copy ROOM ID
              </button>
            </div>
            <button className='btn-edit leaveBtn' onClick={leaveRoom}>
              Leave
            </button>

          </div>
          <div className='absolute right-0 top-1/2 transform -translate-y-1/2 transition duration-500 hover:animate-bounce-left'>
            <button onClick={toggleLeftDiv}>{leftIcon}</button>
          </div>
        </div>
        <div className={`${isLeftDivOpen ? 'col-span-8' : 'w-full absolute top-0 left-0 '}  overflow-y-auto transition-all duration-500 ease-in-out`} style={{ width: isChatOpen ? `calc(100% - 300px)` : '100%' }}>
          <Editor
            handleDownloadFile={handleDownloadFile}
            socketRef={socketRef}
            roomId={roomId}
            fileContent={fileContent}
            setFileContent={setFileContent}
            editorRef={editorRef}
            contentChanged={contentChanged}
          />
          {!isLeftDivOpen && (
            <div className='absolute left-0 top-1/2 transform -translate-y-1/2 transition duration-500 hover:animate-bounce-right'>
              <button className='text-white' onClick={toggleLeftDiv}>{leftIcon}</button>
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

  )
}

export default EditorPage
