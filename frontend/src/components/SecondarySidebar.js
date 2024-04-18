import React, { useEffect, useState } from 'react'
import Tooltip from "../components/ToolTip"
import SettingsMenu from '../components/Settings'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import ChatIcon from '@mui/icons-material/Chat'

const SecondarySidebar = ({
    currTheme,
    setCurrTheme,
    isLeftDivOpen,
    setIsLeftDivOpen,
    isChatOpen,
    setIsChatOpen,
    messages
 }) => {
    const [unreadMessages, setUnreadMessages] = useState(-1)
    const toggleLeftDiv = () => {
		setIsLeftDivOpen((prevState) => !prevState)
	}
    const toggleChat = () => {
		setIsChatOpen((prevState) => !prevState) // Toggle chat window
		setUnreadMessages(-1)
	}

    useEffect(() => {
		if (!isChatOpen) {
			setUnreadMessages((prevCount) => prevCount + 1)
		}
	}, [messages])
    
	return (
		<>
			<div
				className={`z-10 w-full flex justify-center h-10 ${
					isLeftDivOpen ? 'border-l-2' : 'border-l-0'
				}`}>
				{/* <button
                        className={`${currTheme === 'neat' || currTheme === 'eclipse' || currTheme === 'yeti' ? 'text-black hover:text-gray-600' : 'text-gray-400 hover:text-gray-200'}`}
                        onClick={toggleLeftDiv}
                    >
                        <FolderOpenIcon />
                    </button> */}
				<Tooltip text='Open File Tree'>
					<button
						className={`${
							currTheme === 'neat' ||
							currTheme === 'eclipse' ||
							currTheme === 'yeti'
								? 'text-black hover:text-gray-600'
								: 'text-gray-400 hover:text-gray-200'
						}`}
						onClick={toggleLeftDiv}>
						<FolderOpenIcon />
					</button>
				</Tooltip>
			</div>
			<div
				className={`z-10 relative w-full flex justify-center h-10 ${
					isChatOpen ? 'border-l-2' : 'border-l-0'
				}`}>
				{/* <button
						className={`relative ${currTheme === 'neat' || currTheme === 'eclipse' || currTheme === 'yeti' ? 'text-black hover:text-gray-600' : 'text-gray-400 hover:text-gray-200'}`}
						onClick={toggleChat}
					>
	                    <ChatIcon />
	                    {unreadMessages > 0 && (
	                        <span
	                            className='absolute top-[-5px] right-[-5px] text-black rounded-full w-[30px] h-[30px] inline-flex items-center justify-center text-center text-[14px] font-bold border-2 border-black bg-white'
	                        >
	                            {unreadMessages}
	                        </span>
	                    )}
	                </button> */}
				<Tooltip text='Chat Button'>
					<button
						className={`relative ${
							currTheme === 'neat' ||
							currTheme === 'eclipse' ||
							currTheme === 'yeti'
								? 'text-black hover:text-gray-600'
								: 'text-gray-400 hover:text-gray-200'
						}`}
						onClick={toggleChat}>
						<ChatIcon />
						{unreadMessages > 0 && (
							<span className='absolute top-[-5px] right-[-5px] text-black rounded-full w-[30px] h-[30px] inline-flex items-center justify-center text-center text-[14px] font-bold border-2 border-black bg-white'>
								{unreadMessages}
							</span>
						)}
					</button>
				</Tooltip>
			</div>
			<div className='relative h-10 w-full flex justify-center'>
				{/* <SettingsMenu currTheme={currTheme} setCurrTheme={setCurrTheme}/> */}
				<Tooltip text='Settings Menu'>
					<div>
						<SettingsMenu currTheme={currTheme} setCurrTheme={setCurrTheme} />
					</div>
				</Tooltip>
			</div>
		</>
	)
}

export default SecondarySidebar
