import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBotStart from './components/ChatBotStart';
import ChatBotApp from './components/ChatBotApp';
import Footer from './components/Footer';

const App = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem('chats') || []);
    setChats(storedChats);

    if (storedChats.length > 0) {
      setActiveChatId(storedChats[0].id);
    }
  }, []);

  const handleStartChat = () => {
    setIsChatting(true);

    if (chats.length === 0) {
      // const newChat = {
      //   id: `Chat ${new Date().toLocaleDateString('en-US')} ${new Date().toLocaleTimeString()}`,
      //   messages: [],
      // };
      // setChats([newChat]);
      createNewChat();
    }
  };

  const handleGoBack = () => {
    setIsChatting(false);
  };

  const createNewChat = (initialMessage = '') => {
    const newChat = {
      id: uuidv4(),
      displayId: `Chat ${new Date().toLocaleDateString(
        'en-US'
      )} ${new Date().toLocaleTimeString()}`,
      messages: initialMessage
        ? [{ type: 'prompt', text: initialMessage, timestamp: new Date().toLocaleTimeString() }]
        : [],
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    localStorage.setItem('chats', JSON.stringify(updatedChats)); // 0: {id: xxx...', displayedId: 'Chat 8/24/2025 2:05:30 PM', messages: {0: {type: 'prompt, text: 'Hi!', timestamp: '2:01:29 PM'}, 1: {type: 'response', ...}}}, 1: {id: 'yyy...', displayedId: ...}
    setActiveChatId(newChat.id);
    localStorage.setItem(newChat.id, JSON.stringify(newChat.messages)); // 0: {type: 'prompt, text: 'Hi!', timestamp: '2:01:29 PM'}, 1: {type: 'response', ...}
  };

  return (
    <div className="container">
      {isChatting ? (
        <ChatBotApp
          onGoBack={handleGoBack}
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onNewChat={createNewChat}
        />
      ) : (
        <div>
          <ChatBotStart onStartChat={handleStartChat} />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default App;
