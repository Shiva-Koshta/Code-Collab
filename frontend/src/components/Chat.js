import React, { useState } from 'react'
import ACTIONS from '../Actions'
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault'
import '../styles/Chat.css'

const Chat = ({
  setIsChatOpen,
  messages,
  roomId,
  socketRef,
  storedUserData
}) => {
  const CHAT_LIMIT = 50
  const [inputText, setInputText] = useState('')
  //Checks if the inputText state variable is not empty, creates a message object,
  //emits a Socket event to send the message along with sender information to room and sets the inputText state variable to empty
  const handleMessageSend = () => {
    if (inputText.trim() !== '') {
      const message = { text: inputText }
      socketRef.current.emit(ACTIONS.MESSAGE_SEND, {
        roomId,
        message,
        sender: storedUserData.current.sub,
        sendname: storedUserData.current.name,
      })
      setInputText('')
    }
  }
  //Checks if the pressed key is Enter and calls handleMessageSend function if true
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMessageSend()
    }
  }
  return (
    <div className='chat-container' style={{backgroundColor: '#1c1e29'}}>
      <div className='chat-popup' style={{backgroundColor: '#1c1e29'}}>
        <div className='chat-header' >
          Chat
          <DisabledByDefaultIcon className='close-icon mt-1' onClick={() => setIsChatOpen(false)} />
        </div>
        <div className='chat-messages'>
          {messages.slice(-CHAT_LIMIT).map((message, index) => (
            <div key={index} className={` ${message.sentByCurrentUser ? 'sent-by-user' : 'chat-message'}`}>
              <span className='message-sender'>{message.sentByCurrentUser ? 'You' : message.sendname}:</span> {message.text}
            </div>
          ))}
        </div>
        <div className='chat-input'>
          <input
            type='text'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Type your message...'
            className='input-field'
          />
          <button onClick={handleMessageSend} className='send-button'>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Chat
