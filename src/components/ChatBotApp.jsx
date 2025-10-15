import { useState, useEffect, useRef, act } from 'react';
import './ChatBotApp.css';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import FormatResponse from './FormatResponse';

const ChatBotApp = ({
  onGoBack,
  chats,
  setChats,
  activeChatId,
  setActiveChatId,
  onNewChat,
  initialMessage,
  setInitialMessage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(chats[0]?.messages || []);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    setInputValue((prevInput) => prevInput + emoji.native);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const sendMessage = async (messageParam, chatIdParam) => {
    const messageToSend = messageParam ?? inputValue;
    const currentChatId = chatIdParam ?? activeChatId;

    if (!currentChatId || !messageToSend.trim()) return;

    const prevMessages = JSON.parse(localStorage.getItem(currentChatId)) || [];
    const newMessage = {
      type: 'prompt',
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...prevMessages, newMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    const updatedChats = chats.map((chat) =>
      chat.id === currentChatId ? { ...chat, messages: updatedMessages } : chat
    );

    setChats(updatedChats);
    localStorage.setItem(currentChatId, JSON.stringify(updatedMessages));
    localStorage.setItem('chats', JSON.stringify(updatedChats));

    try {
      const res = await fetch('/.netlify/functions/fetchData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputValue: messageToSend }),
      });

      const data = await res.json();

      const newResponse = {
        type: 'response',
        text: data.chatResponse || '(no response)',
        timestamp: new Date().toLocaleTimeString(),
      };

      const messagesWithResponse = [...updatedMessages, newResponse];
      setMessages(messagesWithResponse);

      const updatedChatsWithResponse = chats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: messagesWithResponse,
            }
          : chat
      );

      setChats(updatedChatsWithResponse);
      localStorage.setItem(currentChatId, JSON.stringify(messagesWithResponse));
      localStorage.setItem('chats', JSON.stringify(updatedChatsWithResponse));
      // updatedMessages.push(newResponse);
    } catch {
      const errorMessage = {
        type: 'response',
        text: 'Error',
        timestamp: new Date().toLocaleTimeString(),
      };

      const messagesWithError = [...updatedMessages, errorMessage];
      setMessages(messagesWithError);

      const updatedChatsWithError = chats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messages: messagesWithError,
            }
          : chat
      );

      setChats(updatedChatsWithError);
      localStorage.setItem(currentChatId, JSON.stringify(messagesWithError));
      localStorage.setItem('chats', JSON.stringify(updatedChatsWithError));
    } finally {
      setIsTyping(false);
    }
  };

  // Enter > send, shift + Enter > new line
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
    localStorage.setItem('chats', JSON.stringify(updatedChats));
    localStorage.removeItem(id);

    if (id === activeChatId) {
      const newActiveChatId =
        updatedChats.length > 0 ? updatedChats[0].id : null;
      setActiveChatId(newActiveChatId);
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset
    textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height
  };

  useEffect(() => {
    const activeChatObj = chats.find((chat) => chat.id === activeChatId);
    setMessages(activeChatObj ? activeChatObj.messages : []);
  }, [activeChatId, chats]);

  useEffect(() => {
    if (activeChatId) {
      const storedMessages =
        JSON.parse(localStorage.getItem(activeChatId)) || [];
      setMessages(storedMessages);
    }
  }, [activeChatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!initialMessage || !activeChatId) return;

    const sendInitialMessage = async () => {
      await sendMessage(initialMessage, activeChatId);
    };

    sendInitialMessage();
    setInitialMessage('');
  }, [initialMessage, activeChatId]);

  return (
    <div className="chat-app">
      <div className={`chat-list ${showChatList ? 'show' : ''}`}>
        <div className="chat-list-header">
          <h2>Chat List</h2>
          <i
            className="new-chat bx bx-edit-alt"
            onClick={() => onNewChat()}
          ></i>
          <i
            className="bx bx-x-circle hide-chat-icon"
            onClick={() => setShowChatList(false)}
          ></i>
        </div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item ${
              chat.id === activeChatId ? 'active' : ''
            }`}
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
          <i className="bx bx-menu" onClick={() => setShowChatList(true)}></i>
          <i className="bx bx-arrow-back arrow" onClick={onGoBack}></i>
        </div>
        <div className="chat">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.type === 'prompt' ? 'prompt' : 'response'}
            >
              <FormatResponse text={msg.text} /> <span>{msg.timestamp}</span>
            </div>
          ))}
          {isTyping && <div className="typing">Typing...</div>}
          <div ref={chatEndRef}></div>
        </div>
        <form className="msg-form" onSubmit={(e) => e.preventDefault()}>
          <i
            className="emoji fa-solid fa-face-smile"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          ></i>
          {showEmojiPicker && (
            <div className="picker">
              <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            </div>
          )}
          <textarea
            ref={textareaRef}
            className="msg-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowEmojiPicker(false)}
            onInput={handleInput}
            rows="1"
            placeholder="Type a message..."
          />
          <i className="fa-solid fa-paper-plane" onClick={sendMessage}></i>
        </form>
      </div>
    </div>
  );
};

export default ChatBotApp;
