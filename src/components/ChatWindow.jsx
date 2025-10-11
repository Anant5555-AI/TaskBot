import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Input, 
  Button, 
  Text, 
  Avatar, 
  VStack, 
  HStack, 
  IconButton,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Tooltip,
  Spinner
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi'; // Add this import for the send icon

const Message = ({ message, isUser }) => {
  const bgColor = isUser ? 'blue.500' : 'gray.100';
  const textColor = isUser ? 'white' : 'gray.800';
  const alignSelf = isUser ? 'flex-end' : 'flex-start';
  const borderRadius = isUser ? '18px 18px 0 18px' : '18px 18px 18px 0';

  return (
    <Box 
      maxW="80%" 
      alignSelf={alignSelf}
      mb={4}
    >
      <Box
        bg={bgColor}
        color={textColor}
        px={4}
        py={2}
        borderRadius={borderRadius}
        boxShadow="sm"
      >
        <Text whiteSpace="pre-wrap">{message.content}</Text>
      </Box>
      <Text 
        fontSize="xs" 
        color="gray.500" 
        mt={1} 
        textAlign={isUser ? 'right' : 'left'}
      >
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Box>
  );
};

const ChatWindow = ({ messages, onSendMessage, onFileUpload, isLoading, fileInputRef }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    // Reset the input value to allow selecting the same file again
    e.target.value = null;
  };

  return (
    <Flex direction="column" h="100%" bg={useColorModeValue('white', 'gray.900')}>
      {/* Messages Container */}
      <Box 
        flex={1} 
        p={4} 
        overflowY="auto"
        bg={useColorModeValue('gray.50', 'gray.800')}
      >
        <VStack spacing={4} align="stretch">
          {messages.length === 0 ? (
            <Flex 
              h="100%" 
              alignItems="center" 
              justifyContent="center"
              textAlign="center"
              color={useColorModeValue('gray.500', 'gray.400')}
            >
              <Box>
                <Text fontSize="xl" fontWeight="medium" mb={2}>
                  Start a conversation
                </Text>
                <Text>Upload a PDF or type a message to begin</Text>
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
          {isLoading && (
            <Flex justify="flex-start" mb={4}>
              <Box
                bg={useColorModeValue('gray.100', 'gray.700')}
                px={4}
                py={2}
                borderRadius="18px 18px 18px 0"
              >
                <Spinner size="sm" mr={2} />
                <Text as="span">Thinking...</Text>
              </Box>
            </Flex>
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box 
        p={4} 
        borderTop="1px" 
        borderColor={borderColor}
        bg={useColorModeValue('white', 'gray.900')}
      >
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              display="none"
            />
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              bg={inputBg}
              borderColor={borderColor}
              _hover={{ borderColor: 'gray.300' }}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
              pr="80px"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <InputRightElement width="auto" mr={1}>
              <HStack spacing={1}>
                <Tooltip label="Upload PDF" placement="top">
                  <IconButton
                    aria-label="Upload PDF"
                    icon={<AttachmentIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                  />
                </Tooltip>
                <Button
  type="submit"
  colorScheme="blue"
  size="sm"
  rightIcon={<FiSend />}
  isLoading={isLoading}
  isDisabled={!message.trim()}
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
