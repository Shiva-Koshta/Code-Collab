import React from 'react'
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault'
import '../styles/Chat.css'

const Chat = ({ setIsChatOpen, messages, CHAT_LIMIT, inputText, setInputText, handleKeyPress, handleMessageSend }) => {
  return (
    <div className='chat-container'>
      <div className='chat-popup'>
        <div className='chat-header'>
          <h2>Chat</h2>
          {/* <button className='close-icon' onClick={() => setIsChatOpen(false)}>X</button> */}
          <DisabledByDefaultIcon className='close-icon mt-1' onClick={() => setIsChatOpen(false)} />
        </div><div className='chat-header'>
          <h2>Chat</h2>
          {/* <button className='close-icon' onClick={() => setIsChatOpen(false)}>X</button> */}
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
