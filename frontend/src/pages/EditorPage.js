import React, { useState, useEffect, useRef } from 'react'
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import ACTIONS from '../Actions'
import toast, { Toaster } from 'react-hot-toast'
import Editor from '../components/Editor'
import { initSocket } from '../socket'
import '../styles/EditorPage.css'
import '../styles/Chat.css'
import Chat from '../components/Chat'
import { Tooltip } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { ToastContainer, toast as reactToastify } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from '../components/Sidebar'

const EditorPage = () => {
  const editorRef = useRef(null)
  const [fileContent, setFileContent] = useState('')
  const [contentChanged, setContentChanged] = useState(false)
  const { roomId } = useParams()
  const socketRef = useRef(null)
  const location = useLocation()
  const reactNavigator = useNavigate()
  const [clients, setClients] = useState([])
  const [connectedUsernames, setConnectedUsernames] = useState([])
  const storedUserData = useRef([])
  const host = useRef('')
  const [connectedUserRoles, setConnectedUserRoles] = useState([])
  const connectedUsernamesRef = useRef([])
  const [connectedUsers, setConnectedUsers] = useState([])
  const [messages, setMessages] = useState(() => {
    const storedMessages = window.localStorage.getItem(`messages_${roomId}`)
    return storedMessages ? JSON.parse(storedMessages) : []
  })
  const CHAT_LIMIT = 50 // Global variable for chat limit
  const currentFile = useRef(null)
  const [isChatOpen, setIsChatOpen] = useState(false) // State to control chat window
  const [unreadMessages, setUnreadMessages] = useState(-1)
  const [isLeftDivOpen, setIsLeftDivOpen] = useState(true)
  const leftIcon = isLeftDivOpen ? <ChevronLeft /> : <ChevronRight />
  const [menuOpen, setMenuOpen] = useState({})
  //function to Toggle sidebar
  const toggleLeftDiv = () => {
    setIsLeftDivOpen(prevState => !prevState)
  }
  //function to Toggle chat window
  const toggleChat = () => {
    setIsChatOpen((prevState) => !prevState)
    setUnreadMessages(-1)
  }
  //fetch details of all users including thier roles and set roles state variable and host variable
  //set readonly according to roles
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getdetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      })
      if (response.ok) {
        const data = await response.json()
        setConnectedUserRoles(
          data.users.map((user) => ({ name: user.name, role: user.role }))
        )
        const currentUserRole = data.users.find(
          (user) => user.name === storedUserData.current.name
        )?.role
        if (currentUserRole === 'viewer') {
          editorRef.current.setOption('readOnly', true)
        }
        if (currentUserRole === 'editor' && currentFile.current!=null) {
          editorRef.current.setOption('readOnly', false)
        }
        host.current = data.host
      } else {
        throw new Error('Failed to fetch user details')
      }
    } catch (error) {
      console.log('Error fetching user details:', error)
    }
  }
  //useeffect to increase unread messages when chat is not open and message arrives, runs when message arrives or chat is toggled
  useEffect(() => {
    if (!isChatOpen) {
      setUnreadMessages((prevCount) => prevCount + 1)
    }
  }, [messages, isChatOpen])
  //useeffect to display the notification of chat when chat is not opened, runs when messages arrive
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage && !isChatOpen) {
      reactToastify.info(`${lastMessage.sendname} : ${lastMessage.text}`, {
        position: 'bottom-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        style: {
          backgroundColor: '#1c1e29',
        },
      })
    }
  }, [messages])
  //useffect which assigns connectedUsernames to connectedUsernamesRef, runs when connectedUsernames changes
  useEffect(() => {
    connectedUsernamesRef.current = connectedUsernames
  }, [connectedUsernames])

  useEffect(() => {
    const init = async () => {
      //handes socket connection and error detection
      socketRef.current = await initSocket()
      socketRef.current.on('connect_error', (err) => handleErrors(err))
      socketRef.current.on('connect_failed', (err) => handleErrors(err))
      function handleErrors(e) {
        toast.error('Socket connection failed, try again later.')
        reactNavigator('/')
      }
      //Retrieve user data from local storage and emit data to room with JOIN event
      const userData = window.localStorage.getItem('userData')
      if (userData) {
        storedUserData.current = JSON.parse(userData)
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: JSON.parse(userData).name,
          picture: JSON.parse(userData).picture,
        })
      }
      //listen JOINED socket event which provides clients, username , picture and socketid and display message of joining
      //and sets state variables of ConnectedUsenames and roles appropriately
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
          }
          setClients(clients)
          const updatedUsers = clients.map((client) => ({
            username: client.username,
            profileImage: client.picture,
          }))
          setConnectedUsers(updatedUsers)
          setConnectedUsernames(clients.map((client) => client.username))
          setMenuOpen((prevMenuOpen) => ({
            ...prevMenuOpen,
            [username]: false,
          }))
          //call fetch user details
          fetchUserDetails()
        }
      )
      //Listen DISCONNECTED event and display message and set state variables of connectedusername and role accordingly 
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
        console.log(clients) // added because clients was not used anywhere to avoid linting error
        setClients((prevClients) => {
          let removed = false
          const updatedClients = prevClients.filter((client) => {
            if (!removed && client.username === username) {
              removed = true
              return false
            }
            return true
          })
          const updatedUsers = updatedClients.map((client) => ({
            username: client.username,
            profileImage: client.picture,
          }))
          setConnectedUsers(updatedUsers)
          setConnectedUsernames(
            updatedClients.map((client) => client.username)
          )
          return updatedClients
        })
        setConnectedUserRoles((prevRoles) =>
          prevRoles.filter((user) => user.username !== username)
        )
      })
      //Listen MESSAGE_RECIEVE event which provides message, sender and sender name details and set messages state accordingly
      socketRef.current.on(
        ACTIONS.MESSAGE_RECEIVE,
        ({ text, sender, sendname }) => {
          const newMessage = {
            text,
            sender,
            sentByCurrentUser: sender === JSON.parse(userData).sub,
            sendname,
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
      //Listen ROLE_CHANGE event which provides the username and newrole changed
      //set readonly and state variables accordingly
      socketRef.current.on(ACTIONS.ROLE_CHANGE, ({ username, newRole }) => {
        setConnectedUserRoles((prevRoles) =>
          prevRoles.map((prevUser) => {
            if (prevUser.name === username) {
              return { ...prevUser, role: newRole }
            }
            return prevUser
          })
        )
        if (username === storedUserData.current.name && newRole == 'viewer') {
          editorRef.current.setOption('readOnly', true)
        }
        if (username === storedUserData.current.name && newRole === 'editor' && currentFile.current!=null) {
          editorRef.current.setOption('readOnly', false)
        }
      })
      //Listen HOST_CHANGE event which provides username and update host accordingly and fetch details from backend
      socketRef.current.on(ACTIONS.HOST_CHANGE, ({ username }) => {
        host.current = username
        fetchUserDetails()
      })
    }

    init()
    //disconnect socket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [roomId])
  //fetch details of all users once room is changed
  useEffect(() => {
    fetchUserDetails()
  }, [roomId])

  if (!location.state) {
    return <Navigate to='/' />
  }

  return (
    <div className='flex flex-col justify-center' style={{backgroundColor: '#1c1e29'}}>
      <div className='grid grid-cols-10' style={{backgroundColor: '#1c1e29'}}>
        {<Toaster position='top-center' reverseOrder={false} />}
        <div style={{width: '300px', position:'fixed', left:'0', top:'0', backgroundColor: '#1c1e29'}}>
          <Sidebar
            contentChanged={contentChanged}
            setContentChanged={setContentChanged}
            fileContent={fileContent}
            setFileContent={setFileContent}
            editorRef={editorRef}
            connectedUsers={connectedUsers}
            toggleChat={toggleChat}
            unreadMessages={unreadMessages}
            roomId={roomId}
            isLeftDivOpen={isLeftDivOpen}
            toggleLeftDiv={toggleLeftDiv}
            leftIcon={leftIcon}
            storedUserData={storedUserData}
            host={host}
            connectedUserRoles={connectedUserRoles}
            setConnectedUserRoles={setConnectedUserRoles}
            socketRef={socketRef}
            currentFile={currentFile}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        </div> 
        <div
          className={`overflow-y-scroll overflow-x-scroll transition-all duration-500 ease-in-out absolute top-0 `}
          style={{ width: isChatOpen ? (isLeftDivOpen ? `calc(100% - 592px)` : `calc(100% - 298px)`) : (isLeftDivOpen ? `calc(100% - 300px)` : `calc(100%)`),  left: isLeftDivOpen ?'300px': '0px', overflowX: 'scroll', position:'fixed', backgroundColor: '#282A36', paddingRight: '10px'}}
        >
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            fileContent={fileContent}
            editorRef={editorRef}
            contentChanged={contentChanged}
            connectedClients={connectedUsernamesRef}
          />
          {!isLeftDivOpen && (
            <Tooltip title='Toggle Left Div'>
              <div style={{zIndex: '9999'}} className='absolute left-0 top-1/2 transform transition duration-500 hover:animate-bounce-right'>
                <button className='text-white' onClick={toggleLeftDiv}>
                  {leftIcon}
                </button>
              </div>
            </Tooltip>
          )}
        </div>
        <ToastContainer
          position='bottom-right'
          autoClose={2000}
          hideProgressBar={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />
        <div style={{backgroundColor: '#1c1e29'}}>
          {isChatOpen && (
            <div style={{backgroundColor: '#1c1e29'}}>
              <Chat
                setIsChatOpen={setIsChatOpen}
                messages={messages}
                roomId={roomId}
                socketRef={socketRef}
                storedUserData={storedUserData}
              />
            </div>
          )}
          {
            !isChatOpen && (
              <div style={{backgroundColor: '#1c1e29'}}></div>
            )
          }
        </div> 
      </div>
    </div>
  )
}

export default EditorPage
