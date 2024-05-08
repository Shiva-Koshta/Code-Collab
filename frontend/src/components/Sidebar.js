import React, { useState} from 'react'
import logo from '../images/Logo.png'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import FileView from './FileView'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { MenuItem, Menu, IconButton } from '@mui/material'
import ACTIONS from '../Actions'
import { Tooltip } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import DownloadIcon from '@mui/icons-material/Download'
import axios from 'axios'

const Sidebar = ({
    contentChanged,
    setContentChanged,
    editorRef= useRef(null),
    // isConnectedComponentOpen,
    // handleToggle,
    connectedUsers,
    toggleChat,
    unreadMessages,
    roomId,
    isLeftDivOpen,
    toggleLeftDiv,
    leftIcon,
    storedUserData,
    host,
    connectedUserRoles,
    setConnectedUserRoles,
    socketRef= useRef(null),
    currentFile = useRef(null),
}) => {
   const [menuOpen, setMenuOpen] = useState({})
  onst [isConnectedComponentOpen, setIsConnectedComponentOpen] = useState(false)
  const reactNavigator = useNavigate()
  const downloadZipFile = async (roomId) => {
    try {
      // Make a GET request to the backend endpoint
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/filesystem/download/${roomId}`, {
        responseType: 'blob' // Specify the response type as blob
      })
      // Trigger the download by creating a blob URL and clicking on a temporary link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `room_${roomId}_files.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log('Error downloading zip file:', error)
    }
  }
  //takes username as input and toggles Menu open/close corresponding to that username 
  const handleUserMenuToggle = (username) => {
    console.log('handleUserMenuToggle called with:', username);
    setMenuOpen((prevMenuOpen) => ({
      ...prevMenuOpen,
      [username]: !prevMenuOpen[username],
    }))
  }
  //takes username as input and sets newrole of user to viewer if previously editor and to editor if previously viewer,
  //emits socket event with username and newrole to room
  const handleChangeRole = (username) => {
    const user = connectedUserRoles.find((user) => user.name === username)
    if (!user) {
      return
    }
    const newRole = user.role === 'viewer' ? 'editor' : 'viewer'
    setConnectedUserRoles((prevRoles) =>
      prevRoles.map((prevUser) => {
        if (prevUser.name === username) {
          return { ...prevUser, role: newRole }
        }
        return prevUser
      })
    )
    socketRef.current.emit(ACTIONS.ROLE_CHANGE, {
      roomId,
      username,
      newRole,
    })
  }
  //toggles the connected component state to open/close
  const handleToggle = () => {
    setIsConnectedComponentOpen(!isConnectedComponentOpen)
  }
  //Handles leaving the room by fetching user count, prompting confirming leave
  //if user is last one in room prompts for downloading project else simply deletes room entry and navigates to home page
  const leaveRoom = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'))
      const userCountResponse = await fetch(`${process.env.REACT_APP_API_URL}/rooms/numUsersInRoom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId }),
      })

      if (userCountResponse.ok) {
        const { numUsers } = await userCountResponse.json()
        const confirmLeave = window.confirm('Confirm leave room?')

        if (confirmLeave) {
          if (numUsers === 1) {
            const confirmDownload = window.confirm(
              'Changes are not saved.\nContinue downloading project?'
            )
            if (confirmDownload) {
              downloadZipFile(roomId)
            }
            // Regardless of download confirmation, proceed with leaving the room
            const leaveResponse = await fetch(`${process.env.REACT_APP_API_URL}/delete-entry`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ roomId, username: userData.name }),
            })
            if (leaveResponse.ok) {
              const data = await leaveResponse.json()
              reactNavigator('/', { roomId })
            } else {
              reactNavigator('/', { roomId })
            }
          } else {
            // Not the last user, simply leave the room
            const leaveResponse = await fetch(`${process.env.REACT_APP_API_URL}/delete-entry`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ roomId, username: userData.name }),
            })
            if (leaveResponse.ok) {
              const data = await leaveResponse.json()
              reactNavigator('/', { roomId })
            } else {
              reactNavigator('/', { roomId })
            }
          }
        }
      } else {
        throw new Error('Failed to fetch user count from the server')
      }
    } catch (error) {
      console.log('Error leaving room:', error)
    }
  }
  //Asynchronously copies the roomId to the user's clipboard
  //Displays a success message if successful, or an error message if copying fails
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId)
      toast.success('Room ID has been copied to your clipboard')
    } catch (err) {
      toast.error('Could not copy the Room ID')
    }
  }
  //Asynchronously calls downloadzipfile function
  const download = async () => { downloadZipFile(roomId) }
  return (
    <div
      className={`flex flex-col justify-between h-screen text-white px-4 relative transition-all duration-500 ease-in-out transform ${isLeftDivOpen ? 'col-span-2 ' : '-translate-x-full'
        }`}
      style={{ backgroundColor: '#1c1e29', minWidth: '80px' }}
    >
      <div className='logo flex items-center'>
        <img className='h-20' src={logo} alt='logo' />
        <div className='flex flex-col w-full'>
          <p className='text-4xl md:text-2xl text-center lg:text-3xl xl:text-4xl madimi-one-regular whitespace-nowrap'>
            Code Collab
          </p>
        </div>
      </div>
      <FileView
        contentChanged={contentChanged}
        setContentChanged={setContentChanged}
        editorRef={editorRef}
        socketRef={socketRef}
        connectedUserRoles={connectedUserRoles}
        storedUserData={storedUserData}
        currentFile={currentFile}
      />
      <div className='Users z-10 '>
        <div
          data-testid = 'handle-Toggle'
          className='flex justify-between items-center'
          onClick={handleToggle}
        >
          <p className='my-3 font-bold text-lg'>Connected Users here</p>
          {isConnectedComponentOpen && <ArrowDropUpIcon />}
          {!isConnectedComponentOpen && <ArrowDropDownIcon />}
        </div>
        <div
          data-testid = 'handle-User'
          className='UserListContainer overflow-y-scroll'
          style={{ maxHeight: '60px' }}
        >
          {isConnectedComponentOpen &&
            connectedUsers.map((user) => (
              <div className='UserListItem' key={user.username} >
                <img
                  data-testid ="user-List"
                  id={`user-${user.username}`}
                  src={user.profileImage}
                  alt={user.username}
                  className='img'
                  onClick={() => handleUserMenuToggle(user.username)}
                />
                <div
                data-testid = 'handle-User-Menu'
                  className='username'
                  onClick={() => handleUserMenuToggle(user.username)}
                  onMouseEnter={(event) =>
                    (event.target.style.cursor = 'pointer')
                  }
                >
                  {user.username.split(' ')[0]}
                </div>
                {menuOpen?.[user.username] && (
                  <Menu test-dataid= "inside-Menu"
                    anchorEl={
                      menuOpen[user.username]
                        ? document.getElementById(`user-${user.username}`)
                        : null
                    }
                    open={true}
                    onClose={() =>
                      setMenuOpen((prevMenuOpen) => ({
                        ...prevMenuOpen,
                        [user.username]: false,
                      }))
                    }
                  >
                    <MenuItem>
                      <div className='font-bold uppercase' data-testid ="sohell">
                        {user.username === host.current
                          ? 'host'
                          : connectedUserRoles.find(
                            (userRole) => userRole.name === user.username
                          )?.role}
                      </div>
                    </MenuItem>
                    {storedUserData?.current?.name === host?.current &&
                      storedUserData.current.name !== user.username && (
                        <MenuItem
                          data-testid = 'menuitem'
                          onClick={() => handleChangeRole(user.username)}
                        >
                          Change Role
                        </MenuItem>
                      )}
                  </Menu>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className='p-4'>
        <div
          className='flex gap-2'
          style={{ display: 'flex', justifyContent: 'right' }}
        >
          <Tooltip title='Download'>
            <IconButton
            data-testid='Download-button'
              onClick={download}
              style={{ color: '#e74c3c' }}
            >
              <DownloadIcon style={{ fontSize: 35 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Chat'>
            <IconButton
              data-testid = 'Chat-button'
              onClick={toggleChat}
              style={{ color: '#2ecc71' }}
            >
              <ChatIcon style={{ fontSize: 35 }} />
              {unreadMessages > 0 && (
                <span
                  className='unread-messages'
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    color: 'black',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: '2px solid black',
                    background: 'white',
                  }}
                >
                  {unreadMessages}
                </span>
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title='Copy ROOM ID'>
            <IconButton
              data-testid='copy-button'
              onClick={copyRoomId}
              style={{ color: '#3498db' }}
            >
              <FileCopyIcon style={{ fontSize: 35 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Leave'>
            <IconButton
              data-testid='leave-button'
              onClick={leaveRoom}
              style={{ color: '#e74c3c' }}
            >
              <ExitToAppIcon style={{ fontSize: 35 }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className='absolute right-0 top-1/2 transform transition duration-500 hover:animate-bounce-left'>
        <Tooltip title='Toggle Left Div'>
          <IconButton onClick={toggleLeftDiv} style={{ color: 'white' }}>
            {leftIcon}
          </IconButton>
        </Tooltip>
      </div>
      <input type="hidden"
        onClick={() => {setIsConnectedComponentOpen(true)}}
        data-testid="inside-hello"
        />
    </div>
  )
}

export default Sidebar
