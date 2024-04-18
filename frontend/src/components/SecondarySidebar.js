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
    const [isVisible, setIsVisible] = useState([false, false, false]);

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
				<Tooltip isVisible={isVisible} setIsVisible={setIsVisible} i={0} text='Open File Tree'>
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
				<Tooltip isVisible={isVisible} setIsVisible={setIsVisible} i={1} text='Chat Button'>
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
							<span className='absolute top-[-5px] right-[-5px] text-black rounded-full w-[20px] h-[20px] inline-flex items-center justify-center text-center text-[8px] font-bold border-2 border-black bg-white'>
								{unreadMessages}
							</span>
						)}
					</button>
				</Tooltip>
			</div>
			<div className='relative h-10 w-full flex justify-center'>
                <Tooltip isVisible={isVisible} setIsVisible={setIsVisible} i={2} text='Settings Menu'>
                    <SettingsMenu setIsVisible={setIsVisible} currTheme={currTheme} setCurrTheme={setCurrTheme} />
                </Tooltip>
			</div>
		</>
	)
}

export default SecondarySidebar
