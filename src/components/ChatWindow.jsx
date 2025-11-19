//1⭐
// import { useState, useRef, useEffect } from 'react';
// import { 
//   Box, 
//   Flex, 
//   Input, 
//   Button, 
//   Text, 
//   Avatar, 
//   VStack, 
//   HStack, 
//   IconButton,
//   useColorModeValue,
//   InputGroup,
//   InputRightElement,
//   Tooltip,
//   Spinner
// } from '@chakra-ui/react';
// import { AttachmentIcon } from '@chakra-ui/icons';
// import { FiSend } from 'react-icons/fi'; // Add this import for the send icon

// const Message = ({ message, isUser }) => {
//   const bgColor = isUser ? 'blue.500' : 'gray.100';
//   const textColor = isUser ? 'white' : 'gray.800';
//   const alignSelf = isUser ? 'flex-end' : 'flex-start';
//   const borderRadius = isUser ? '18px 18px 0 18px' : '18px 18px 18px 0';

//   return (
//     <Box 
//       maxW="80%" 
//       alignSelf={alignSelf}
//       mb={4}
//     >
//       <Box
//         bg={bgColor}
//         color={textColor}
//         px={4}
//         py={2}
//         borderRadius={borderRadius}
//         boxShadow="sm"
//       >
//         <Text whiteSpace="pre-wrap">{message.content}</Text>
//       </Box>
//       <Text 
//         fontSize="xs" 
//         color="gray.500" 
//         mt={1} 
//         textAlign={isUser ? 'right' : 'left'}
//       >
//         {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//       </Text>
//     </Box>
//   );
// };

// const ChatWindow = ({ messages, onSendMessage, onFileUpload, isLoading, fileInputRef }) => {
//   const [message, setMessage] = useState('');
//   const messagesEndRef = useRef(null);
//   const inputBg = useColorModeValue('white', 'gray.700');
//   const borderColor = useColorModeValue('gray.200', 'gray.600');

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       onSendMessage(message);
//       setMessage('');
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       onFileUpload(file);
//     }
//     // Reset the input value to allow selecting the same file again
//     e.target.value = null;
//   };

//   return (
//     <Flex direction="column" h="100%" bg={useColorModeValue('white', 'gray.900')}>
//       {/* Messages Container */}
//       <Box 
//         flex={1} 
//         p={4} 
//         overflowY="auto"
//         bg={useColorModeValue('gray.50', 'gray.800')}
//       >
//         <VStack spacing={4} align="stretch">
//           {messages.length === 0 ? (
//             <Flex 
//               h="100%" 
//               alignItems="center" 
//               justifyContent="center"
//               textAlign="center"
//               color={useColorModeValue('gray.500', 'gray.400')}
//             >
//               <Box>
//                 <Text fontSize="xl" fontWeight="medium" mb={2}>
//                   Start a conversation
//                 </Text>
//                 <Text>Upload a PDF or type a message to begin</Text>
//               </Box>
//             </Flex>
//           ) : (
//             messages.map((msg) => (
//               <Message 
//                 key={msg.id} 
//                 message={msg} 
//                 isUser={msg.sender === 'user'} 
//               />
//             ))
//           )}
//           {isLoading && (
//             <Flex justify="flex-start" mb={4}>
//               <Box
//                 bg={useColorModeValue('gray.100', 'gray.700')}
//                 px={4}
//                 py={2}
//                 borderRadius="18px 18px 18px 0"
//               >
//                 <Spinner size="sm" mr={2} />
//                 <Text as="span">Thinking...</Text>
//               </Box>
//             </Flex>
//           )}
//           <div ref={messagesEndRef} />
//         </VStack>
//       </Box>

//       {/* Input Area */}
//       <Box 
//         p={4} 
//         borderTop="1px" 
//         borderColor={borderColor}
//         bg={useColorModeValue('white', 'gray.900')}
//       >
//         <form onSubmit={handleSubmit}>
//           <InputGroup>
//             <Input
//               ref={fileInputRef}
//               type="file"
//               accept=".pdf"
//               onChange={handleFileChange}
//               display="none"
//             />
//             <Input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               bg={inputBg}
//               borderColor={borderColor}
//               _hover={{ borderColor: 'gray.300' }}
//               _focus={{
//                 borderColor: 'blue.500',
//                 boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
//               }}
//               pr="80px"
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSubmit(e);
//                 }
//               }}
//             />
//             <InputRightElement width="auto" mr={1}>
//               <HStack spacing={1}>
//                 <Tooltip label="Upload PDF" placement="top">
//                   <IconButton
//                     aria-label="Upload PDF"
//                     icon={<AttachmentIcon />}
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => fileInputRef.current?.click()}
//                   />
//                 </Tooltip>
//                 <Button
//   type="submit"
//   colorScheme="blue"
//   size="sm"
//   rightIcon={<FiSend />}
//   isLoading={isLoading}
//   isDisabled={!message.trim()}
// >
//   Send
// </Button>
//               </HStack>
//             </InputRightElement>
//           </InputGroup>
//         </form>
//       </Box>
//     </Flex>
//   );
// };

// export default ChatWindow;
//2⭐
// import { useState, useRef, useEffect } from 'react';
// import {
//   Box,
//   Flex,
//   Input,
//   Button,
//   Text,
//   VStack,
//   HStack,
//   IconButton,
//   useColorModeValue,
//   useColorMode,
//   InputGroup,
//   InputRightElement,
//   Tooltip,
//   Spinner,
//   Avatar,
//   Heading,
//   Fade,
//   keyframes,
// } from '@chakra-ui/react';
// import { AttachmentIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
// import { FiSend } from 'react-icons/fi';

// const typing = keyframes`
//   0% { content: '.'; }
//   33% { content: '..'; }
//   66% { content: '...'; }
// `;

// const Message = ({ message, isUser }) => {
//   const bgColor = isUser ? 'blue.500' : useColorModeValue('gray.100', 'gray.700');
//   const textColor = isUser ? 'white' : useColorModeValue('gray.800', 'whiteAlpha.900');
//   const alignSelf = isUser ? 'flex-end' : 'flex-start';
//   const borderRadius = isUser ? '18px 18px 0 18px' : '18px 18px 18px 0';

//   return (
//     <Flex maxW="80%" alignSelf={alignSelf} mb={3} direction="column">
//       {/* Sender label */}
//       <Text fontSize="xs" color="gray.500" mb={1} textAlign={isUser ? 'right' : 'left'}>
//         {isUser ? 'You' : 'AI'}
//       </Text>

//       <Box
//         bg={bgColor}
//         color={textColor}
//         px={4}
//         py={2}
//         borderRadius={borderRadius}
//         boxShadow="md"
//       >
//         <Text whiteSpace="pre-wrap">{message.content}</Text>
//       </Box>

//       <Text fontSize="xs" color="gray.500" mt={1} textAlign={isUser ? 'right' : 'left'}>
//         {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//       </Text>
//     </Flex>
//   );
// };

// const ChatWindow = ({ messages, onSendMessage, onFileUpload, isLoading, fileInputRef }) => {
//   const [message, setMessage] = useState('');
//   const messagesEndRef = useRef(null);
//   const { colorMode, toggleColorMode } = useColorMode();

//   const bgPattern = useColorModeValue(
//     'linear-gradient(135deg, #f7fafc 25%, #edf2f7 100%)',
//     'linear-gradient(135deg, #1a202c 25%, #2d3748 100%)'
//   );
//   const inputBg = useColorModeValue('white', 'gray.800');
//   const borderColor = useColorModeValue('gray.200', 'gray.700');

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isLoading]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       onSendMessage(message);
//       setMessage('');
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) onFileUpload(file);
//     e.target.value = null;
//   };

//   return (
//     <Flex direction="column" h="100%" bg={bgPattern} position="relative">
//       {/* Header with Light/Dark Toggle */}
//       <Flex
//         p={4}
//         borderBottom="1px"
//         borderColor={borderColor}
//         align="center"
//         justify="space-between"
//         bg={useColorModeValue('white', 'gray.900')}
//         boxShadow="sm"
//         position="sticky"
//         top={0}
//         zIndex={10}
//       >
//         <HStack spacing={3}>
//           <Avatar size="sm" name="TASK-BOT" />
//           <Heading fontSize="md" fontWeight="semibold" display="flex" alignItems="center">
//             <AttachmentIcon mr={2} /> TASK-BOT
//           </Heading>
//         </HStack>

//         {/* Toggle Button */}
//         <Tooltip label={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}>
//           <IconButton
//             aria-label="Toggle color mode"
//             icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
//             onClick={toggleColorMode}
//             variant="ghost"
//             size="sm"
//           />
//         </Tooltip>
//       </Flex>

//       {/* Messages */}
//       <Box flex={1} p={4} overflowY="auto">
//         <VStack spacing={4} align="stretch">
//           {messages.length === 0 ? (
//             <Flex h="100%" align="center" justify="center" textAlign="center" color="gray.500">
//               <Box>
//                 <Text fontSize="xl" fontWeight="medium" mb={2}>
//                   Start a conversation
//                 </Text>
//                 <Text>Upload a PDF or type a message to begin</Text>
//               </Box>
//             </Flex>
//           ) : (
//             messages.map((msg) => <Message key={msg.id} message={msg} isUser={msg.sender === 'user'} />)
//           )}
// {/* loading spinner */}
//           {isLoading && (
//   <Flex justify="flex-start" mb={4}>
//     <Box
//       bg={useColorModeValue('gray.100', 'gray.700')}
//       px={4}
//       py={3}
//       borderRadius="18px 18px 18px 0"
//       boxShadow="sm"
//       position="relative"
//       overflow="hidden"
//     >
//       <HStack spacing={2} align="center">
//         <Spinner 
//           size="sm" 
//           color="blue.500" 
//           thickness="2px"
//           speed="0.65s"
//           emptyColor="gray.200"
//         />
//         <HStack spacing={1} px={2}>
//           <Box 
//             w="6px" 
//             h="6px" 
//             bg="gray.500" 
//             borderRadius="full"
//             animation={`${typing} 1.5s infinite steps(1, end)`}
//           />
//           <Box 
//             w="6px" 
//             h="6px" 
//             bg="gray.500" 
//             borderRadius="full"
//             animation={`${typing} 1.5s infinite steps(1, end) 0.5s`}
//           />
//           <Box 
//             w="6px" 
//             h="6px" 
//             bg="gray.500" 
//             borderRadius="full"
//             animation={`${typing} 1.5s infinite steps(1, end) 1s`}
//           />
//         </HStack>
//       </HStack>
//     </Box>
//   </Flex>
// )}

//           <div ref={messagesEndRef} />
//         </VStack>
//       </Box>

//       {/* Input */}
//       <Box p={4} borderTop="1px" borderColor={borderColor} bg={useColorModeValue('white', 'gray.900')}>
//         <form onSubmit={handleSubmit}>
//           <InputGroup size="md">
//             <Input
//               ref={fileInputRef}
//               type="file"
//               accept=".pdf"
//               onChange={handleFileChange}
//               display="none"
//             />
//             <Input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               bg={inputBg}
//               borderRadius="full"
//               borderColor={borderColor}
//               _focus={{
//                 borderColor: 'blue.500',
//                 boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
//               }}
//               pr="90px"
//             />
//             <InputRightElement width="auto" mr={1}>
//               <HStack spacing={1}>
//                 <Tooltip label="Upload PDF" placement="top">
//                   <IconButton
//                     aria-label="Upload PDF"
//                     icon={<AttachmentIcon />}
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => fileInputRef.current?.click()}
//                   />
//                 </Tooltip>
//                 <Button
//                   type="submit"
//                   colorScheme="blue"
//                   size="sm"
//                   borderRadius="full"
//                   rightIcon={<FiSend />}
//                   isLoading={isLoading}
//                   isDisabled={!message.trim()}
//                 >
//                   Send
//                 </Button>
//               </HStack>
//             </InputRightElement>
//           </InputGroup>
//         </form>
//       </Box>
//     </Flex>
//   );
// };

// export default ChatWindow;
//⭐3.
// import { useState, useRef, useEffect } from 'react';
// import {
//   Box,
//   Flex,
//   Input,
//   Button,
//   Text,
//   VStack,
//   HStack,
//   IconButton,
//   useColorModeValue,
//   useColorMode,
//   InputGroup,
//   InputRightElement,
//   Tooltip,
//   Spinner,
//   Avatar,
//   Heading,
//   keyframes,
// } from '@chakra-ui/react';
// import { AttachmentIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
// import { FiSend } from 'react-icons/fi';

// const typing = keyframes`
//   0% { opacity: 0.4; transform: translateY(0); }
//   50% { opacity: 1; transform: translateY(-2px); }
//   100% { opacity: 0.4; transform: translateY(0); }
// `;

// const Message = ({ message, isUser }) => {
//   const bgColor = isUser ? 'blue.500' : useColorModeValue('gray.100', 'gray.700');
//   const textColor = isUser ? 'white' : useColorModeValue('gray.800', 'whiteAlpha.900');
//   const alignSelf = isUser ? 'flex-end' : 'flex-start';
//   const borderRadius = isUser ? '18px 18px 0 18px' : '18px 18px 18px 0';

//   return (
//     <Flex maxW="80%" alignSelf={alignSelf} mb={3} direction="column">
//       <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} mb={1} textAlign={isUser ? 'right' : 'left'}>
//         {isUser ? 'You' : 'AI'}
//       </Text>
//       <Box
//         bg={bgColor}
//         color={textColor}
//         px={4}
//         py={2}
//         borderRadius={borderRadius}
//         boxShadow="md"
//       >
//         <Text whiteSpace="pre-wrap">{message.content}</Text>
//       </Box>
//       <Text 
//         fontSize="xs" 
//         color={useColorModeValue('gray.500', 'gray.400')} 
//         mt={1} 
//         textAlign={isUser ? 'right' : 'left'}
//       >
//         {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//       </Text>
//     </Flex>
//   );
// };

// const ChatWindow = ({ messages, onSendMessage, onFileUpload, isLoading, fileInputRef }) => {
//   const [message, setMessage] = useState('');
//   const messagesEndRef = useRef(null);
//   const { colorMode, toggleColorMode } = useColorMode();

//   const bgColor = useColorModeValue('white', 'gray.900');
//   const inputBg = useColorModeValue('white', 'gray.800');
//   const borderColor = useColorModeValue('gray.200', 'gray.700');
//   const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
//   const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isLoading]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       onSendMessage(message);
//       setMessage('');
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) onFileUpload(file);
//     e.target.value = null;
//   };

//   return (
//     <Flex direction="column" h="100%" bg={bgColor} position="relative">
//       {/* Header */}
//       <Flex
//         p={4}
//         borderBottom="1px"
//         borderColor={borderColor}
//         align="center"
//         justify="space-between"
//         bg={bgColor}
//         boxShadow="sm"
//         position="sticky"
//         top={0}
//         zIndex={10}
//       >
//         <HStack spacing={3}>
//           <Avatar size="sm" name="PDFPal" />
//           <Heading 
//             fontSize="md" 
//             fontWeight="semibold" 
//             display="flex" 
//             alignItems="center"
//             color={textColor}
//           >
//             <AttachmentIcon mr={2} />PDFPal
//           </Heading>
//         </HStack>

//         <Tooltip label={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}>
//           <IconButton
//             aria-label="Toggle color mode"
//             icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
//             onClick={toggleColorMode}
//             variant="ghost"
//             size="sm"
//           />
//         </Tooltip>
//       </Flex>

//       {/* Messages */}
//       <Box flex={1} p={4} overflowY="auto" bg={bgColor}>
//         <VStack spacing={4} align="stretch">
//           {messages.length === 0 ? (
//             <Flex 
//               h="100%" 
//               align="center" 
//               justify="center" 
//               textAlign="center" 
//               color={secondaryTextColor}
//             >
//               <Box>
//                 <Text 
//                   fontSize="xl" 
//                   fontWeight="medium" 
//                   mb={2}
//                   color={textColor}
//                 >
//                   Start a conversation
//                 </Text>
//                 <Text color={secondaryTextColor}>
//                   Upload a PDF or type a message to begin
//                 </Text>
//               </Box>
//             </Flex>
//           ) : (
//             messages.map((msg) => (
//               <Message 
//                 key={msg.id} 
//                 message={msg} 
//                 isUser={msg.sender === 'user'} 
//               />
//             ))
//           )}

//           {/* Loading Spinner */}
//           {isLoading && (
//             <Flex justify="flex-start" mb={4}>
//               <Box
//                 bg={useColorModeValue('gray.100', 'gray.700')}
//                 px={4}
//                 py={3}
//                 borderRadius="18px 18px 18px 0"
//                 boxShadow="sm"
//                 position="relative"
//                 overflow="hidden"
//               >
//                 <HStack spacing={2} align="center">
//                   <Spinner 
//                     size="sm" 
//                     color="blue.500" 
//                     thickness="2px"
//                     speed="0.65s"
//                     emptyColor={useColorModeValue('gray.200', 'gray.600')}
//                   />
//                   <HStack spacing={1} px={2}>
//                     {[0, 0.5, 1].map((delay) => (
//                       <Box 
//                         key={delay}
//                         w="6px" 
//                         h="6px" 
//                         bg={useColorModeValue('gray.500', 'gray.300')}
//                         borderRadius="full"
//                         animation={`${typing} 1.5s infinite steps(1, end) ${delay}s`}
//                       />
//                     ))}
//                   </HStack>
//                 </HStack>
//               </Box>
//             </Flex>
//           )}

//           <div ref={messagesEndRef} />
//         </VStack>
//       </Box>

//       {/* Input Area */}
//       <Box 
//         p={4} 
//         borderTop="1px" 
//         borderColor={borderColor} 
//         bg={bgColor}
//       >
//         <form onSubmit={handleSubmit}>
//           <InputGroup size="md">
//             <Input
//               ref={fileInputRef}
//               type="file"
//               accept=".pdf"
//               onChange={handleFileChange}
//               display="none"
//             />
//             <Input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//               bg={inputBg}
//               borderRadius="full"
//               borderColor={borderColor}
//               _focus={{
//                 borderColor: 'blue.500',
//                 boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
//               }}
//               pr="90px"
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSubmit(e);
//                 }
//               }}
//             />
//             <InputRightElement width="auto" mr={1}>
//               <HStack spacing={1}>
//                 <Tooltip label="Upload PDF" placement="top">
//                   <IconButton
//                     aria-label="Upload PDF"
//                     icon={<AttachmentIcon />}
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => fileInputRef.current?.click()}
//                     color={useColorModeValue('gray.600', 'gray.300')}
//                     _hover={{
//                       bg: useColorModeValue('gray.100', 'gray.700')
//                     }}
//                   />
//                 </Tooltip>
//                 <Button
//                   type="submit"
//                   colorScheme="blue"
//                   size="sm"
//                   borderRadius="full"
//                   rightIcon={<FiSend />}
//                   isLoading={isLoading}
//                   isDisabled={!message.trim()}
//                 >
//                   Send
//                 </Button>
//               </HStack>
//             </InputRightElement>
//           </InputGroup>
//         </form>
//       </Box>
//     </Flex>
//   );
// };

// export default ChatWindow;
//4⭐
import { keyframes } from '@emotion/react';
import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Tooltip,
  Spinner,
  Avatar,
  Heading,
  useColorMode,
} from '@chakra-ui/react';
import { AttachmentIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi';

const typing = keyframes`
  0% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-2px); }
  100% { opacity: 0.4; transform: translateY(0); }
`;

const Message = ({ message, isUser }) => {
  const bgColor = isUser ? 'blue.500' : useColorModeValue('gray.100', 'gray.700');
  const textColor = isUser ? 'white' : useColorModeValue('gray.800', 'whiteAlpha.900');
  const alignSelf = isUser ? 'flex-end' : 'flex-start';
  const borderRadius = isUser ? '18px 18px 0 18px' : '18px 18px 18px 0';

  return (
    <Flex maxW="80%" alignSelf={alignSelf} mb={3} direction="column">
      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} mb={1} textAlign={isUser ? 'right' : 'left'}>
        {isUser ? 'You' : 'AI'}
      </Text>
      <Box
        bg={bgColor}
        color={textColor}
        px={4}
        py={2}
        borderRadius={borderRadius}
        boxShadow="md"
      >
        <Text whiteSpace="pre-wrap">{message.content}</Text>
      </Box>
      <Text 
        fontSize="xs" 
        color={useColorModeValue('gray.500', 'gray.400')} 
        mt={1} 
        textAlign={isUser ? 'right' : 'left'}
      >
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Flex>
  );
};

const ChatWindow = ({ 
  messages, 
  onSendMessage, 
  onFileUpload, 
  isLoading, 
  isProcessingPdf,
  fileInputRef 
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue('white', 'gray.900');
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isProcessingPdf]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
    e.target.value = null;
  };

  return (
    <Flex direction="column" h="100%" bg={bgColor} position="relative">
      <Flex
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
        align="center"
        justify="space-between"
        bg={bgColor}
        boxShadow="sm"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack spacing={3}>
          <Avatar size="sm" name="PDFPal" />
          <Heading 
            fontSize="md" 
            fontWeight="semibold" 
            display="flex" 
            alignItems="center"
            color={textColor}
          >
            <AttachmentIcon mr={2} /> PDFPal
          </Heading>
        </HStack>

        <Tooltip label={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
      </Flex>

      <Box flex={1} p={4} overflowY="auto" bg={bgColor}>
        <VStack spacing={4} align="stretch">
          {messages.length === 0 && !isProcessingPdf ? (
            <Flex 
              h="100%" 
              align="center" 
              justify="center" 
              textAlign="center" 
              color={secondaryTextColor}
            >
              <Box>
                <Text 
                  fontSize="xl" 
                  fontWeight="medium" 
                  mb={2}
                  color={textColor}
                >
                  Start a conversation
                </Text>
                <Text color={secondaryTextColor}>
                  Upload a PDF or type a message to begin
                </Text>
              </Box>
            </Flex>
          ) : (
            messages.map((msg) => (
              <Message 
                key={msg.id} 
                message={msg} 
                isUser={msg.sender === 'user'} 
              />
            ))
          )}

          {(isLoading || isProcessingPdf) && (
            <Flex justify="flex-start" mb={4}>
              <Box
                bg={useColorModeValue('gray.100', 'gray.700')}
                px={4}
                py={3}
                borderRadius="18px 18px 18px 0"
                boxShadow="sm"
                position="relative"
                overflow="hidden"
              >
                <HStack spacing={2} align="center">
                  <Spinner 
                    size="sm" 
                    color="blue.500" 
                    thickness="2px"
                    speed="0.65s"
                    emptyColor={useColorModeValue('gray.200', 'gray.600')}
                  />
                  <Text color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm">
                    {isProcessingPdf ? 'Processing PDF...' : 'Thinking...'}
                  </Text>
                </HStack>
              </Box>
            </Flex>
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <Box 
        p={4} 
        borderTop="1px" 
        borderColor={borderColor} 
        bg={bgColor}
      >
        <form onSubmit={handleSubmit}>
          <InputGroup size="md">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              display="none"
              disabled={isLoading || isProcessingPdf}
            />
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isProcessingPdf ? "Processing PDF..." : "Type your message..."}
              bg={inputBg}
              borderRadius="full"
              borderColor={borderColor}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
              pr="90px"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading || isProcessingPdf}
            />
            <InputRightElement width="auto" mr={1}>
              <HStack spacing={1}>
                <Tooltip label={isProcessingPdf ? "Processing PDF..." : "Upload PDF"} placement="top">
                  <IconButton
                    aria-label="Upload PDF"
                    icon={<AttachmentIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    color={useColorModeValue('gray.600', 'gray.300')}
                    _hover={{
                      bg: useColorModeValue('gray.100', 'gray.700')
                    }}
                    isDisabled={isLoading || isProcessingPdf}
                  />
                </Tooltip>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="sm"
                  borderRadius="full"
                  rightIcon={<FiSend />}
                  isLoading={isLoading}
                  isDisabled={!message.trim() || isProcessingPdf}
                >
                  Send
                </Button>
              </HStack>
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
    </Flex>
  );
};

export default ChatWindow;