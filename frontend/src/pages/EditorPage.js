import React, { useState, useEffect, useRef, Children } from 'react'
import { ToastContainer, toast as reactToastify } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
	Navigate,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom'

import ACTIONS from '../Actions'
import toast, { Toaster } from 'react-hot-toast'
import { initSocket } from '../socket'

import logo from '../images/Logo.png'

// import './Editor.css'
import '../styles/EditorPage.css'
import '../styles/Chat.css'

import Editor from '../components/Editor'
import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'
import SecondarySidebar from '../components/SecondarySidebar'

import axios from 'axios'
import { protocol } from 'socket.io-client'


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
	// const [storedUserData, setStoredUserData] = useState([])
	// const [host, setHost] = useState('')
	const storedUserData = useRef([])
	const host = useRef('')
	const [connectedUserRoles, setConnectedUserRoles] = useState([])
	const connectedUsernamesRef = useRef([])
	const [connectedUsers, setConnectedUsers] = useState([])

	const [messages, setMessages] = useState(() => {
		const storedMessages = window.localStorage.getItem(`messages_${roomId}`)
		return storedMessages ? JSON.parse(storedMessages) : []
	})
	const [currTheme, setCurrTheme] = useState('dracula')

	const CHAT_LIMIT = 15 // Global variable for chat limit

	const [inputText, setInputText] = useState('')
	const [isChatOpen, setIsChatOpen] = useState(false) // State to control chat window

	const downloadFileExtension = ''
	const downloadFileName = ''
	const [isLeftDivOpen, setIsLeftDivOpen] = useState(true)

	const getRoot = async () => {
		const rootFolder = await axios.get(`${process.env.REACT_APP_API_URL}/filesystem/fetchroot`, {
            params: {
				roomId, // Send the roomId as a query parameter
			  },
          });

		return rootFolder
	}

	const [selectedFileFolder, setSelectedFileFolder] = useState(getRoot)
		
	// const [menuOpen, setMenuOpen] = useState({})

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
	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
		handleMessageSend();
		}
	};
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
					backgroundColor: '#1c1e29', // Change this to your desired color
				},
			})
		}
	}, [messages])

	useEffect(() => {
		connectedUsernamesRef.current = connectedUsernames
		console.log(connectedUsernamesRef.current.length)
	}, [connectedUsernames])

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
				// setStoredUserData(JSON.parse(userData))
				storedUserData.current = JSON.parse(userData)
				socketRef.current.emit(ACTIONS.JOIN, {
					roomId,
					username: JSON.parse(userData).name,
					picture: JSON.parse(userData).picture,
				})
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
									style={{ marginRight: '8px' }}>
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
					const updatedUsers = clients.map((client) => ({
						username: client.username,
						profileImage: client.picture,
					}))
					setConnectedUsers(updatedUsers)
					setConnectedUsernames(clients.map((client) => client.username))

					setConnectedUserRoles((prevRoles) => [
						...prevRoles,
						{ id: socketId, name: username, role: 'editor' },
					])

					console.log(host.current)
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

			socketRef.current.on(ACTIONS.ROLE_CHANGE, ({ username, newRole }) => {
				// console.log('yes')
				console.log(username)
				console.log(newRole)

				// console.log(storedUserData.name)
				setConnectedUserRoles((prevRoles) =>
					prevRoles.map((prevUser) => {
						if (prevUser.name === username) {
							return { ...prevUser, role: newRole }
						}
						return prevUser
					})
				)
				console.log(connectedUserRoles)
				console.log(connectedUsers)

				if (username === storedUserData.current.name && newRole == 'viewer') {
					console.log('yes')
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
						const response = await fetch('http://localhost:8080/getdetails', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},

							body: JSON.stringify({ roomId }), // Include roomId in the request body
						})
						if (response.ok) {
							const data = await response.json()
							console.log(data)
							setConnectedUserRoles(
								data.users.map((user) => ({ name: user.name, role: user.role }))
							)
							// setHost(data.host)
							host.current = data.host
						} else {
							throw new Error('Failed to fetch user details')
						}
					} catch (error) {
						console.error('Error fetching user details:', error)
					}
				}

				fetchUserDetails()
				// fetchUserDetails()
			})
		}

		init()

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect()
			}
		}
	}, [roomId])
	useEffect(() => {
		const fetchUserDetails = async () => {
			try {
				const response = await fetch('http://localhost:8080/getdetails', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},

					body: JSON.stringify({ roomId }), // Include roomId in the request body
				})
				if (response.ok) {
					const data = await response.json()
					console.log(data)
					setConnectedUserRoles(
						data.users.map((user) => ({ name: user.name, role: user.role }))
					)
					// setHost(data.host)
					host.current = data.host
				} else {
					throw new Error('Failed to fetch user details')
				}
			} catch (error) {
				console.error('Error fetching user details:', error)
			}
		}

		fetchUserDetails()
	}, [roomId]) // Afetr this everythong can be done in the frontend using the data received.

	if (!location.state) {
		return <Navigate to='/' />
	}

	const backgroundColors = {
		'monokai': '#272823',
		'dracula': '#282A35',
		'nord': '#2F343F',
		'neat': '#FFFFFF',
		'mbo': '#2C2C2C',
		'abcdef': '#0F0F0F',
		'midnight': '#111929',
		'material-ocean': '#0F1119',
		'material-darker': '#212121',
		'material-palenight': '#2A2D3D',
		'material': '#283237',
		'twilight': '#141414',
		'the-matrix': '#000000',
		'rubyblue': '#152434',
		'shadowfox': '#2A2A2E',
		'eclipse': '#fff',
		'seti': '#151718',
		'yeti': '#ECEAE8',
		'oceanic-next': '#334147',
		'panda-syntax': '#292A2B'
	}

	return (
		<div className='flex w-full overflow-y-scroll overflow-x-scroll'>
            <div
                className='flex flex-col justify-start w-12 items-center gap-2 border border-gray-600'
				style={{backgroundColor: `${backgroundColors[currTheme]}`}}
            >
                <SecondarySidebar
					currTheme={currTheme}
					setCurrTheme={setCurrTheme}
					isLeftDivOpen={isLeftDivOpen}
					setIsLeftDivOpen={setIsLeftDivOpen}
					isChatOpen={isChatOpen}
					setIsChatOpen={setIsChatOpen}
					messages={messages}
				 />
            </div>
			<div
				className='grid grid-cols-10'
				style={{ width: isChatOpen ? `calc(100% - 300px)` : '100%' }}
			>
				{<Toaster position='top-center' reverseOrder={false} />}
				{isLeftDivOpen &&
					<div
						className='flex flex-col justify-between h-screen text-white px-4 col-span-2'
						style={{ backgroundColor: '#1c1e29' }}
					>
						<Sidebar
							contentChanged={contentChanged}
							setContentChanged={setContentChanged}
							fileContent={fileContent}
							setFileContent={setFileContent}
							editorRef={editorRef}
							// isConnectedComponentOpen={isConnectedComponentOpen}
							// handleToggle={handleToggle}
							connectedUsers={connectedUsers}
							// copyRoomId={copyRoomId}
							// leaveRoom={leaveRoom}
							roomId={roomId}
							storedUserData={storedUserData}
							host={host}
							connectedUserRoles={connectedUserRoles}
							setConnectedUserRoles={setConnectedUserRoles}
							socketRef={socketRef}
							selectedFileFolder={selectedFileFolder}
							setSelectedFileFolder={setSelectedFileFolder}
						/>
					</div>
				}
				<div
					className={`${isLeftDivOpen ? 'col-span-8' : 'col-span-10'
						}  overflow-y-auto`}
					style={{ width: isChatOpen ? `calc(100% - 45px)` : '100%' }}
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
						currTheme={currTheme}
						isLeftDivOpen={isLeftDivOpen}
					/>
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

				{isChatOpen && (
					<Chat
						setIsChatOpen={setIsChatOpen}
						messages={messages}
						CHAT_LIMIT={CHAT_LIMIT}
						inputText={inputText}
						setInputText={setInputText}
						handleKeyPress={handleKeyPress}
						handleMessageSend={handleMessageSend}
						roomId={roomId}
						socketRef={socketRef}
						storedUserData={storedUserData}
					/>
				)}
			</div>
		</div>
	)
}

export default EditorPage
