import React, { useState, useRef, useEffect } from 'react'
import logo from '../images/Logo.png'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import FileView from './FileView'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp'
import { MenuItem, Menu, IconButton } from '@mui/material'
import ACTIONS from '../Actions'

const Sidebar = ({
	contentChanged,
	setContentChanged,
	fileContent,
	setFileContent,
	editorRef,
	// isConnectedComponentOpen,
	// handleToggle,
	connectedUsers,
	// copyRoomId,
	// leaveRoom,
	roomId,
	storedUserData,
	host,
	connectedUserRoles,
	setConnectedUserRoles,
	socketRef,
	selectedFileFolder,
	setSelectedFileFolder
}) => {
	const [menuOpen, setMenuOpen] = useState({})
	const handleUserMenuToggle = (username) => {
		setMenuOpen((prevMenuOpen) => ({
			...prevMenuOpen,
			[username]: !prevMenuOpen[username]
		}))
	}
	const handleChangeRole = (username) => {
		const user = connectedUserRoles.find((user) => user.name === username)
		if (!user) {
			console.error(`User with id ${username} not found.`)
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
			newRole
		})
	}
	const [isConnectedComponentOpen, setIsConnectedComponentOpen] =
		useState(false)
	const handleToggle = () => {
		setIsConnectedComponentOpen(!isConnectedComponentOpen)
	}
	const [downloadFileExtension, setFileExtension] = useState('')
	const [downloadFileName, setFileName] = useState('')
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

	const reactNavigator = useNavigate()
	const leaveRoom = async () => {
		try {
			const userData = JSON.parse(localStorage.getItem('userData'))
			const userCountResponse = await fetch(
				'http://localhost:8080/rooms/numUsersInRoom',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ roomId })
				}
			)
			if (userCountResponse.ok) {
				const { numUsers } = await userCountResponse.json()
				if (numUsers === 1) {
					const confirmDownload = window.confirm(
						'You are the last user in the room. Once leaving the room the data will be deleted permanently. Do you want to download the content of the room before leaving ?'
					)
					if (confirmDownload) {
						handleDownloadFile()
						setTimeout(async () => {
							const leaveResponse = await fetch(
								'http://localhost:8080/delete-entry',
								{
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({ roomId, username: userData.name })
								}
							)

							if (leaveResponse.ok) {
								const data = await leaveResponse.json()
								console.log(data)
								reactNavigator('/', { roomId })
							} else {
								reactNavigator('/', { roomId })
							}
						}, 2000)
					} else {
						const leaveResponse = await fetch(
							'http://localhost:8080/delete-entry',
							{
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({ roomId, username: userData.name })
							}
						)

						if (leaveResponse.ok) {
							const data = await leaveResponse.json()
							console.log(data)
							reactNavigator('/', { roomId })
						} else {
							reactNavigator('/', { roomId })
						}
					}
				} else {
					const leaveResponse = await fetch(
						'http://localhost:8080/delete-entry',
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({ roomId, username: userData.name })
						}
					)

					if (leaveResponse.ok) {
						const data = await leaveResponse.json()
						console.log(data)
						reactNavigator('/', { roomId })
					} else {
						reactNavigator('/', { roomId })
					}
				}
			} else {
				throw new Error('Failed to fetch user count from the server')
			}
		} catch (error) {
			console.error('Error leaving room:', error)
		}
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
	return (
		<>
			{/* Sidebar content */}
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
				fileContent={fileContent}
				setFileContent={setFileContent}
				editorRef={editorRef}
				selectedFileFolder={selectedFileFolder}
				setSelectedFileFolder={setSelectedFileFolder}
			/>
			<div className='Users z-10'>
				<div
					className='flex justify-between items-center'
					onClick={handleToggle}>
					<p className='my-3 font-bold text-lg'>Connected Users here</p>
					{isConnectedComponentOpen && <ArrowDropUpIcon />}
					{!isConnectedComponentOpen && <ArrowDropDownIcon />}
				</div>
				<div className='UserListContainer'>
                    {isConnectedComponentOpen && connectedUsers.map((user) => (
	                    <div className='UserListItem' key={user.username}>
	                        <img id={`user-${user.username}`} src={user.profileImage} alt={user.username} className='img' onClick={() => handleUserMenuToggle(user.username)} />
	                        <div className='username' onClick={() => handleUserMenuToggle(user.username)} onMouseEnter={(event) => event.target.style.cursor = 'pointer'}>
	                            {user.username.split(' ')[0]}
	                        </div>
	                        {menuOpen[user.username] && (
	                            <Menu
	                                anchorEl={menuOpen[user.username] ? document.getElementById(`user-${user.username}`) : null}
	                                open={true}
	                                onClose={() => setMenuOpen(prevMenuOpen => ({ ...prevMenuOpen, [user.username]: false }))}
	                            >
	                                <MenuItem>
	                                    <div className='font-bold uppercase'>
	                                        {user.username === host.current ? 'host' : connectedUserRoles.find(userRole => userRole.name === user.username)?.role}
	                                    </div>
	                                </MenuItem>
	                                {storedUserData.current.name === host.current && storedUserData.current.name !== user.username && (
	                                    <MenuItem onClick={() => handleChangeRole(user.username)}>
	                                        Change Role
	                                    </MenuItem>
	                                )}
	                            </Menu>
	                        )}
	                    </div>
	                ))}
                </div>
			</div>
            <div className='p-4 mb-2'>
	            <div className='flex gap-2'>
	                <button className='bg-green-500 p-3 rounded-lg w-full font-bold text-lg transition delay-150 hover:bg-green-700 hover:scale-x-[1.025]' onClick={copyRoomId}>
	                    Copy Room Id
	                </button>
                    <button className=' bg-red-500 p-3 rounded-lg w-full font-bold text-lg transition delay-150 hover:bg-red-700 hover:scale-x-[1.025]' onClick={leaveRoom}>
                        Leave
                    </button>
	            </div>
            </div>
		</>
	)
}

export default Sidebar