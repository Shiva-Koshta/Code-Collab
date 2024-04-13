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
  const [inputText, setInputText] = useState("");
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
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleMessageSend();
    }
  };
  const CHAT_LIMIT = 15;
  return (
    <div className='chat-container'>

      <div className='chat-popup'>
        <div className='chat-header'>
          Chat
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
