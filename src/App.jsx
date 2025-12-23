import { useState, useRef, useEffect, useCallback } from 'react';
import { ChakraProvider, Box, Flex, useToast, useColorModeValue, extendTheme, useDisclosure } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import AuthModal from './components/AuthModal';
import { uploadFiles, queryLLM, logout } from './services/api';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      },
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-thumb': {
        background: props.colorMode === 'dark' ? 'gray.700' : 'gray.300',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      }
    },
    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        }
      })
    }
  }
});

function App() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('chatHistory');
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  const fileInputRef = useRef(null);
  const toast = useToast();

  // Auth Modal State
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure({
    defaultIsOpen: !isAuthenticated
  });

  useEffect(() => {
    if (!isAuthenticated) {
      onAuthOpen();
    } else {
      onAuthClose();
    }
  }, [isAuthenticated, onAuthOpen, onAuthClose]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chats));
  }, [chats]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    onAuthClose();
  };

  const handleLogout = () => {
    logout();
    // logout function in api.js reloads page, but if it didn't:
    setIsAuthenticated(false);
  };

  const createNewChat = useCallback(() => {
    const newChat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats(prevChats => [newChat, ...prevChats]);
    setActiveChat(newChat.id);
  }, []);

  const handleDeleteChat = useCallback((id) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== id));
    if (activeChat === id) {
      setActiveChat(null);
    }
  }, [activeChat]);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    // Auto-create chat if none active
    let currentChatId = activeChat;
    if (!currentChatId) {
      const newChat = {
        id: uuidv4(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date().toISOString(),
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat.id);
      currentChatId = newChat.id;
    }

    try {
      setIsProcessingPdf(true);
      const result = await uploadFiles(files);

      const fileNames = Array.from(files).map(f => f.name).join(', ');

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? {
              ...chat,
              title: chat.messages.length === 0 ? fileNames.slice(0, 30) : chat.title,
              messages: [
                ...chat.messages,
                {
                  id: uuidv4(),
                  content: `📂 **Uploaded ${files.length} file(s)**: ${fileNames}\n\nProcessed successfully! I've added this to my context.`,
                  sender: 'system',
                  timestamp: new Date().toISOString(),
                },
              ],
            }
            : chat
        )
      );

      toast({
        title: 'Files Ready',
        description: 'You can now chat with your documents.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: 'Processing Failed',
        description: error.message || 'Failed to process files',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleSendMessage = async (message) => {
    const chatId = activeChat;
    if (!message.trim()) return;

    if (!chatId) {
      const newChat = {
        id: uuidv4(),
        title: message.slice(0, 30),
        messages: [],
        createdAt: new Date().toISOString(),
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat.id);
      return;
    }

    const userMessage = {
      id: uuidv4(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setIsLoading(true);
    try {
      const currentChat = chats.find(c => c.id === chatId);

      const response = await queryLLM({
        message,
        chatHistory: currentChat?.messages || [],
        // server manages context now via session/user
      });

      const aiMessage = {
        id: uuidv4(),
        content: response.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === chatId
            ? {
              ...chat,
              messages: [...chat.messages, aiMessage],
              title: chat.messages.length === 0 ? message.slice(0, 30) : chat.title,
            }
            : chat
        )
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: "Failed to get response. Please try again.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentMessages = activeChat
    ? (chats.find(c => c.id === activeChat)?.messages || [])
    : [];

  return (
    <ChakraProvider theme={theme}>
      <Flex h="100vh" overflow="hidden">
        <ChatHistory
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onCreateNewChat={createNewChat}
          onDeleteChat={handleDeleteChat}
          onLogout={handleLogout}
        />

        <Box flex={1} h="100vh" position="relative">
          <ChatWindow
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
            isProcessingPdf={isProcessingPdf}
            fileInputRef={fileInputRef}
          />
        </Box>
      </Flex>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={onAuthClose}
        onLoginSuccess={handleLoginSuccess}
      />
    </ChakraProvider>
  );
}

export default App;