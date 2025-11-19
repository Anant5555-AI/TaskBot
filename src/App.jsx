//1⭐
// import { useState, useRef, useEffect } from 'react';
// import { ChakraProvider, Box, Flex, useToast, useColorModeValue, Button } from '@chakra-ui/react';
// import { v4 as uuidv4 } from 'uuid';
// import ChatHistory from './components/ChatHistory';
// import ChatWindow from './components/ChatWindow';
// import { processPDF, queryLLM } from './services/api';
// import { extendTheme } from '@chakra-ui/react';

// function App() {
//   const [chats, setChats] = useState(() => {
//     const savedChats = localStorage.getItem('chatHistory');
//     return savedChats ? JSON.parse(savedChats) : [];
//   });
//   const [activeChat, setActiveChat] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const fileInputRef = useRef(null);
//   const toast = useToast();

//   useEffect(() => {
//     localStorage.setItem('chatHistory', JSON.stringify(chats));
//   }, [chats]);

// const config = {
//   initialColorMode: 'light',
//   useSystemColorMode: false,
// };

// const theme = extendTheme({
//   config,
//   styles: {
//     global: (props) => ({
//       body: {
//         bg: 'gray.50',
//       },
//     }),
//   },
// });

//   const createNewChat = () => {
//     const newChat = {
//       id: uuidv4(),
//       title: 'New Chat',
//       messages: [],
//       createdAt: new Date().toISOString(),
//     };
//     setChats([newChat, ...chats]);
//     setActiveChat(newChat.id);
//   };
//    // Delete chat
//   const handleDeleteChat = (id) => {
//     setChats(prevChats => prevChats.filter(chat => chat.id !== id));
//     if (activeChat === id) setActiveChat(null);
//     toast({
//       title: 'Chat deleted',
//       status: 'info',
//       duration: 3000,
//       isClosable: true,
//     });
//   };

//   const handleFileUpload = async (file) => {
//     try {
//       setIsLoading(true);
//       const result = await processPDF(file);

//       setChats(chats =>
//         chats.map(chat =>
//           chat.id === activeChat
//             ? {
//                 ...chat,
//                 pdfData: result,
//                 title: `PDF: ${file.name}`,
//                 messages: [
//                   ...chat.messages,
//                   {
//                     id: uuidv4(),
//                     content: `Uploaded and processed PDF: ${file.name}`,
//                     sender: 'system',
//                     timestamp: new Date().toISOString(),
//                   },
//                 ],
//               }
//             : chat
//         )
//       );

//       toast({
//         title: 'PDF Processed',
//         description:
//           'The PDF has been successfully processed and is ready for querying.',
//         status: 'success',
//         duration: 5000,
//         isClosable: true,
//       });
//     } catch (error) {
//       console.error('Error in handleFileUpload:', error);
//       toast({
//         title: 'Error',
//         description: error.message || 'Failed to process PDF',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSendMessage = async (message) => {
//     if (!message.trim() || !activeChat) return;

//     const userMessage = {
//       id: uuidv4(),
//       content: message,
//       sender: 'user',
//       timestamp: new Date().toISOString(),
//     };

//     const updatedChats = chats.map(chat =>
//       chat.id === activeChat
//         ? { ...chat, messages: [...chat.messages, userMessage] }
//         : chat
//     );
//     setChats(updatedChats);

//     setIsLoading(true);
//     try {
//       const response = await queryLLM({
//         message,
//         chatHistory:
//           updatedChats.find(c => c.id === activeChat)?.messages || [],
//         context: updatedChats.find(c => c.id === activeChat)?.pdfData,
//       });

//       const aiMessage = {
//         id: uuidv4(),
//         content: response.answer,
//         sender: 'ai',
//         timestamp: new Date().toISOString(),
//       };

//       setChats(chats =>
//         chats.map(chat =>
//           chat.id === activeChat
//             ? {
//                 ...chat,
//                 messages: [...chat.messages, aiMessage],
//                 title:
//                   chat.messages.length === 0
//                     ? message.slice(0, 30) + '...'
//                     : chat.title,
//               }
//             : chat
//         )
//       );
//     } catch (error) {
//       console.error('Error getting AI response:', error);
//       toast({
//         title: 'Error getting response',
//         description: error.message,
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <ChakraProvider>
        
//       <Flex h="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
//         {/* Sidebar */}
//         <ChatHistory
//           chats={chats}
//           activeChat={activeChat}
//           onSelectChat={setActiveChat}
//           onCreateNewChat={createNewChat}
//           onDeleteChat={handleDeleteChat}
//         />

//         {/* Main Chat Area */}
//         <Box flex={1} display="flex" flexDirection="column" h="100vh" position="relative">
//           {/* Always render ChatWindow */}
//           <ChatWindow
//             messages={activeChat ? (chats.find(c => c.id === activeChat)?.messages || []) : []}
//             onSendMessage={activeChat ? handleSendMessage : () => {}}
//             onFileUpload={activeChat ? handleFileUpload : () => {}}
//             isLoading={isLoading}
//             fileInputRef={fileInputRef}
            
//           />

//           {/* Overlay welcome screen when no active chat */}
//           {!activeChat && (
//   <Box
//     position="absolute"
//     inset={0}
//     display="flex"
//     flexDirection="column"
//     alignItems="center"
//     justifyContent="center"
//     textAlign="center"
//     p={4}
//     bg={useColorModeValue('white', 'gray.900')}
//     zIndex={1}
//   >
//     <Box 
//       maxW="md" 
//       p={8} 
//       borderRadius="lg" 
//       boxShadow="sm"
//       bg={useColorModeValue('white', 'gray.800')}
//       borderWidth="1px"
//       borderColor={useColorModeValue('gray.200', 'gray.700')}
//     >
//       <Box 
//         fontSize="2xl" 
//         fontWeight="bold" 
//         mb={4}
//         color={useColorModeValue('gray.800', 'whiteAlpha.900')}
//       >
//         Welcome to PDF Chat
//       </Box>
//       <Box 
//         mb={6} 
//         color={useColorModeValue('gray.600', 'gray.300')}
//       >
//         Start a new chat or select an existing one from the sidebar
//       </Box>
//       <Button
//         onClick={createNewChat}
//         colorScheme="blue"
//         size="md"
//         _hover={{ transform: 'translateY(-1px)' }}
//         transition="all 0.2s"
//       >
//         New Chat
//       </Button>
//     </Box>
//   </Box>
// )}
          
//         </Box>
//       </Flex>
//     </ChakraProvider>
//   );
// }

// export default App;
// //submitted version is on git hub 


//2⭐
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChakraProvider, Box, Flex, useToast, useColorModeValue, Button } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import ChatHistory from './components/ChatHistory';
import ChatWindow from './components/ChatWindow';
import { processPDF, queryLLM } from './services/api';
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        _dark: {
          bg: 'gray.900',
        },
      },
    },
  },
});

function App() {
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem('chatHistory');
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [activeChat, setActiveChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chats));
  }, [chats]);

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
    toast({
      title: 'Chat deleted',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  }, [activeChat, toast]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    if (!file.type.includes('pdf')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsProcessingPdf(true);
      const result = await processPDF(file);

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                pdfData: result,
                title: `PDF: ${file.name}`,
                messages: [
                  ...chat.messages,
                  {
                    id: uuidv4(),
                    content: `📄 Uploaded and processed PDF: ${file.name}`,
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
        description: 'The PDF has been successfully processed and is ready for querying.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to process PDF',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessingPdf(false);
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

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    );

    setIsLoading(true);
    try {
      const currentChat = chats.find(c => c.id === activeChat);
      
      // Check if user is asking about PDF upload
      // if (message.toLowerCase().replace(/\s+/g, '').includes('upload pdf'))
       if (/upload\s*[-\s]*pdf/i.test(message))
        {
        const systemMessage = {
          id: uuidv4(),
          content: "To upload a PDF, click the paperclip icon (📎) in the chat input area. " +
                   "Select your PDF file, and I'll process it for you. Once uploaded, " +
                   "you can ask questions about its content.",
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.id === activeChat
              ? { ...chat, messages: [...chat.messages, systemMessage] }
              : chat
          )
        );
        return;
      }

      // Process normal message
      const response = await queryLLM({
        message,
        chatHistory: currentChat?.messages || [],
        context: currentChat?.pdfData,
      });

      const aiMessage = {
        id: uuidv4(),
        content: response.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
                title:
                  chat.messages.length === 0
                    ? message.slice(0, 30) + (message.length > 30 ? '...' : '')
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
    <ChakraProvider theme={theme}>
      <Flex h="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
        <ChatHistory
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          onCreateNewChat={createNewChat}
          onDeleteChat={handleDeleteChat}
        />

        <Box flex={1} display="flex" flexDirection="column" h="100vh" position="relative">
          <ChatWindow
            messages={activeChat ? (chats.find(c => c.id === activeChat)?.messages || []) : []}
            onSendMessage={activeChat ? handleSendMessage : createNewChat}
            onFileUpload={activeChat ? handleFileUpload : createNewChat}
            isLoading={isLoading}
            isProcessingPdf={isProcessingPdf}
            fileInputRef={fileInputRef}
          />

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
              bg={useColorModeValue('white', 'gray.900')}
              zIndex={1}
            >
              <Box 
                maxW="md" 
                p={8} 
                borderRadius="lg" 
                boxShadow="sm"
                bg={useColorModeValue('white', 'gray.800')}
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <Box 
                  fontSize="2xl" 
                  fontWeight="bold" 
                  mb={4}
                  color={useColorModeValue('gray.800', 'whiteAlpha.900')}
                >
                  Welcome to PDF Chat
                </Box>
                <Box 
                  mb={6} 
                  color={useColorModeValue('gray.600', 'gray.300')}
                >
                  Start a new chat or select an existing one from the sidebar
                </Box>
                <Button
                  onClick={createNewChat}
                  colorScheme="blue"
                  size="md"
                  _hover={{ transform: 'translateY(-1px)' }}
                  transition="all 0.2s"
                >
                  New Chat
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default App;