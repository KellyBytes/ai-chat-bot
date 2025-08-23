import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBotStart from './components/ChatBotStart';
import ChatBotApp from './components/ChatBotApp';

const App = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

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
    setActiveChatId(newChat.id);
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
        <ChatBotStart onStartChat={handleStartChat} />
      )}
    </div>
  );
};

export default App;
