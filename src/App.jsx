import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatBotStart from './components/ChatBotStart';
import ChatBotApp from './components/ChatBotApp';
import Footer from './components/Footer';
import ThemeProvider from './components/ThemeProvider';

const App = () => {
  const [isChatting, setIsChatting] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');

  const handleStartChat = async (message = '') => {
    // const handleStartChat = (message = '') => {
    setIsChatting(true);

    if (message.trim()) {
      const newId = await createNewChat(message, true);
      // const newId = createNewChat();
      setActiveChatId(newId);
      setInitialMessage(message);
    } else {
      const storedChats = JSON.parse(localStorage.getItem('chats') || '[]');
      if (storedChats.length > 0) {
        setActiveChatId(storedChats[0].id);
      }
      setInitialMessage('');
    }
  };

  const handleGoBack = () => {
    setIsChatting(false);
  };

  const createNewChat = (initialMessage = '', returnPromise = false) => {
    const newChat = {
      id: uuidv4(),
      displayId: initialMessage
        ? initialMessage.slice(0, 30)
        : `Chat ${new Date().toLocaleDateString(
            'en-US'
          )} ${new Date().toLocaleTimeString()}`,
      messages: [],
    };

    if (returnPromise) {
      return new Promise((resolve) => {
        setChats((prev) => {
          const updatedChats = [newChat, ...prev];
          localStorage.setItem('chats', JSON.stringify(updatedChats)); // 0: {id: xxx...', displayedId: 'Chat 8/24/2025 2:05:30 PM', messages: {0: {type: 'prompt, text: 'Hi!', timestamp: '2:01:29 PM'}, 1: {type: 'response', ...}}}, 1: {id: 'yyy...', displayedId: ...}
          return updatedChats;
        });

        setActiveChatId(newChat.id);
        localStorage.setItem(newChat.id, JSON.stringify(newChat.messages)); // 0: {type: 'prompt, text: 'Hi!', timestamp: '2:01:29 PM'}, 1: {type: 'response', ...}
        resolve(newChat.id);
      });
    }

    setChats((prev) => {
      const updatedChats = [newChat, ...prev];
      localStorage.setItem('chats', JSON.stringify(updatedChats));
      return updatedChats;
    });

    setActiveChatId(newChat.id);
    localStorage.setItem(newChat.id, JSON.stringify(newChat.messages));
    return newChat.id;
  };

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem('chats') || '[]');
    setChats(storedChats);

    if (storedChats.length > 0) {
      setActiveChatId(storedChats[0].id);
    }
  }, []);

  return (
    <ThemeProvider>
      {/* <div className="container"> */}
      {isChatting ? (
        <ChatBotApp
          onGoBack={handleGoBack}
          chats={chats}
          setChats={setChats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onNewChat={createNewChat}
          initialMessage={initialMessage}
          setInitialMessage={setInitialMessage}
        />
      ) : (
        <>
          <ChatBotStart onStartChat={handleStartChat} />
          <Footer />
        </>
      )}
      {/* </div> */}
    </ThemeProvider>
  );
};

export default App;
