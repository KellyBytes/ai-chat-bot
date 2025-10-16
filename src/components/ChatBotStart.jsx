import { useState } from 'react';
import './ChatBotStart.css';

const ChatBotStart = ({ onStartChat }) => {
  const [input, setInput] = useState('');

  const handleClick = () => {
    onStartChat(input.trim() || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };

  return (
    <div className="start-page">
      <h1>What are you up to?</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type something or click the button..."
        />
        <button type="submit" className="start-page-btn">
          <i className="bx bx-message-dots"></i>
        </button>
      </form>
      {/* <button
        type="button"
        className="start-page-btn"
        onClick={() => onStartChat()}
      >
        View Previous Chats
      </button> */}
    </div>
  );
};

export default ChatBotStart;
