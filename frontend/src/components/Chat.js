import React, { useState } from 'react';
import '../styles/Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isOpen, setIsOpen] = useState(true);

    const handleMessageSend = () => {
        if (inputText.trim() !== '') {
            setMessages([...messages, { text: inputText }]);
            setInputText('');
        }
    };
    const handleCloseChat = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && (
                <div className="chat-popup">
                    <div className="chat-header">
                        <h2>Chat</h2>
                        <button onClick={handleCloseChat} className="close-button">
                            X
                        </button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div key={index} className="chat-message">
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message..."
                            className="input-field"
                        />
                        <button onClick={handleMessageSend} className="send-button">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}; 

export default Chat;
