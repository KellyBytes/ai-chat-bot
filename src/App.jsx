import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBotStart from './components/ChatBotStart';
import ChatBotApp from './components/ChatBotApp';

const App = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

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

  const createNewChat = () => {
    const newChat = {
      id: uuidv4(),
      displayId: `Chat ${new Date().toLocaleDateString(
        'en-US'
      )} ${new Date().toLocaleTimeString()}`,
      messages: [],
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setActiveChat(newChat.id);
  };

  return (
    <div className="container">
      {isChatting ? (
        <ChatBotApp
          onGoBack={handleGoBack}
          chats={chats}
          setChats={setChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
          onNewChat={createNewChat}
        />
      ) : (
        <ChatBotStart onStartChat={handleStartChat} />
      )}
    </div>
  );
};

export default App;
