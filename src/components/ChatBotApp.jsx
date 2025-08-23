import { useState, useEffect, useRef } from 'react';
import './ChatBotApp.css';

const ChatBotApp = ({ onGoBack, chats, setChats, activeChatId, setActiveChatId, onNewChat }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(chats[0]?.messages || []);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const activeChatObj = chats.find((chat) => chat.id === activeChatId);
    setMessages(activeChatObj ? activeChatObj.messages : []);
  }, [activeChatId, chats]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      type: 'prompt',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    if (!activeChatId) {
      onNewChat(inputValue);
      setInputValue('');
    } else {
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputValue('');

      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      });

      setChats(updatedChats);

      setIsTyping(true);

      const api_key = import.meta.env.VITE_API_KEY;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api_key}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-2024-07-18',
          messages: [{ role: 'user', content: inputValue }],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      const chatResponse = data.choices[0].message.content.trim();

      const newResponse = {
        type: 'response',
        text: chatResponse,
        timestamp: new Date().toLocaleTimeString(),
      };

      const updatedMessagesWithResponse = [...updatedMessages, newResponse];
      setMessages(updatedMessagesWithResponse);

      setIsTyping(false);

      const updatedChatsWithResponse = chats.map((chat) => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: updatedMessagesWithResponse };
        }
        return chat;
      });
      setChats(updatedChatsWithResponse);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
  };

  const handleDeleteChat = (id) => {
    const updatedChats = chats.filter((chat) => chat.id !== id);
    setChats(updatedChats);

    if (id === activeChatId) {
      const newActiveChatId = updatedChats.length > 0 ? updatedChats[0].id : null;
      setActiveChatId(newActiveChatId);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-app">
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i className="bx bx-edit-alt new-chat" onClick={() => onNewChat()}></i>
        </div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => handleSelectChat(chat.id)}
          >
            <h4>{chat.displayId}</h4>
            <i
              className="bx bx-x-circle"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat.id);
              }}
            ></i>
          </div>
        ))}
      </div>
      <div className="chat-window">
        <div className="chat-title">
          <h3>Chat with AI</h3>
          <i className="bx bx-arrow-back arrow" onClick={onGoBack}></i>
        </div>
        <div className="chat">
          {messages.map((msg, index) => (
            <div key={index} className={msg.type === 'prompt' ? 'prompt' : 'response'}>
              {msg.text} <span>{msg.timestamp}</span>
            </div>
          ))}
          {isTyping && <div className="typing">Typing...</div>}
          <div ref={chatEndRef}></div>
        </div>
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <i className="fa-solid fa-face-smile emoji"></i>
          <input
            type="text"
            className="msg-input"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <i className="fa-solid fa-paper-plane" onClick={sendMessage}></i>
        </form>
      </div>
    </div>
  );
};

export default ChatBotApp;
