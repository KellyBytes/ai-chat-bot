import { useState } from 'react';
import './ChatBotStart.css';

const ChatBotStart = ({ onStartChat }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onStartChat(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="start-page">
      <h1>What are you up to?</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
        />
      </form>
      <button className="start-page-btn" onClick={() => onStartChat()}>
        Start Chat
      </button>
    </div>
  );
};

export default ChatBotStart;
