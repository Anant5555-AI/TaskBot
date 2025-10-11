import { useState, useRef, useEffect } from 'react';
import { ChakraProvider, Box, Flex, useToast } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import { processPDF, queryLLM } from './services/api';

function App() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('chatHistory');
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
  };

  const handleFileUpload = async (file) => {
    try {
      setIsLoading(true);
      const result = await processPDF(file);

      setChats(chats =>
        chats.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                pdfData: result,
                title: `PDF: ${file.name}`,
                messages: [
                  ...chat.messages,
                  {
                    id: uuidv4(),
                    content: `Uploaded and processed PDF: ${file.name}`,
                    sender: 'system',
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : chat
        )
      );

      toast({
        title: 'PDF Processed',
        description:
          'The PDF has been successfully processed and is ready for querying.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process PDF',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !activeChat) return;

    const userMessage = {
      id: uuidv4(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedChats = chats.map(chat =>
      chat.id === activeChat
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    );
    setChats(updatedChats);

    setIsLoading(true);
    try {
      const response = await queryLLM({
        message,
        chatHistory:
          updatedChats.find(c => c.id === activeChat)?.messages || [],
        context: updatedChats.find(c => c.id === activeChat)?.pdfData,
      });

      const aiMessage = {
        id: uuidv4(),
        content: response.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setChats(chats =>
        chats.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
                title:
                  chat.messages.length === 0
                    ? message.slice(0, 30) + '...'
                    : chat.title,
              }
            : chat
        )
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error getting response',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Flex h="100vh" bg="gray.50">
        {/* Sidebar */}
        <ChatHistory
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onCreateNewChat={createNewChat}
        />

        {/* Main Chat Area */}
        <Box flex={1} display="flex" flexDirection="column" h="100vh" position="relative">
          {/* Always render ChatWindow */}
          <ChatWindow
            messages={activeChat ? (chats.find(c => c.id === activeChat)?.messages || []) : []}
            onSendMessage={activeChat ? handleSendMessage : () => {}}
            onFileUpload={activeChat ? handleFileUpload : () => {}}
            isLoading={isLoading}
            fileInputRef={fileInputRef}
          />

          {/* Overlay welcome screen when no active chat */}
          {!activeChat && (
            <Box
              position="absolute"
              inset={0}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              p={4}
              bg="white"
              zIndex={1}
            >
              <Box maxW="md" p={8} borderRadius="lg" boxShadow="sm">
                <Box fontSize="2xl" fontWeight="bold" mb={4}>
                  Welcome to PDF Chat
                </Box>
                <Box mb={6} color="gray.600">
                  Start a new chat or select an existing one from the sidebar
                </Box>
                <button
                  onClick={createNewChat}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  New Chat
                </button>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
