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
  Code,
} from '@chakra-ui/react';
import { AttachmentIcon, SunIcon, MoonIcon, CopyIcon } from '@chakra-ui/icons';
import { FiSend } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const typing = keyframes`
  0% { opacity: 0.4; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-2px); }
  100% { opacity: 0.4; transform: translateY(0); }
`;

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const { colorMode } = useColorMode();
  const theme = colorMode === 'dark' ? oneDark : oneLight;
  const hasLang = !!match;

  if (!inline && hasLang) {
    return (
      <Box position="relative" my={4} borderRadius="md" overflow="hidden">
        <Box
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          px={4}
          py={1}
          fontSize="xs"
          fontWeight="bold"
          color={colorMode === 'dark' ? 'gray.300' : 'gray.600'}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text textTransform="uppercase">{match[1]}</Text>
          <Tooltip label="Copy code">
            <IconButton
              size="xs"
              icon={<CopyIcon />}
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
              aria-label="Copy code"
            />
          </Tooltip>
        </Box>
        <SyntaxHighlighter
          style={theme}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: '0 0 4px 4px' }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </Box>
    );
  }

  return (
    <Code
      colorScheme={colorMode === "dark" ? "orange" : "red"}
      borderRadius="sm"
      px={1}
      {...props}
    >
      {children}
    </Code>
  );
};

const Message = ({ message, isUser }) => {
  const { colorMode } = useColorMode();
  const bgColor = isUser ? 'blue.500' : useColorModeValue('white', 'gray.700');
  const textColor = isUser ? 'white' : useColorModeValue('gray.800', 'whiteAlpha.900');
  const alignSelf = isUser ? 'flex-end' : 'flex-start';
  const borderRadius = isUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px';
  const shadow = useColorModeValue('md', 'dark-lg');

  return (
    <HStack
      align="end"
      alignSelf={alignSelf}
      spacing={2}
      maxW="85%"
      flexDirection={isUser ? 'row-reverse' : 'row'}
    >
      {!isUser && (
        <Avatar
          size="xs"
          name="AI Assistant"
          bg="purple.500"
          icon={<AttachmentIcon transform="rotate(270deg)" />}
        />
      )}

      <Box
        bg={bgColor}
        color={textColor}
        px={5}
        py={3}
        borderRadius={borderRadius}
        boxShadow={shadow}
        borderWidth={!isUser ? '1px' : '0'}
        borderColor={useColorModeValue('gray.100', 'gray.600')}
        position="relative"
        sx={{
          '& p': { marginBottom: '0.8em' },
          '& p:last-child': { marginBottom: 0 },
          '& ul, & ol': { marginLeft: '1.2em', marginBottom: '0.8em' },
          '& li': { marginBottom: '0.2em' },
          '& a': { color: isUser ? 'white' : 'blue.500', textDecoration: 'underline' }
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            img: ({ node, ...props }) => (
              <Box as="img" maxW="100%" borderRadius="md" my={2} {...props} />
            )
          }}
        >
          {message.content}
        </ReactMarkdown>

        <Text
          fontSize="10px"
          color={isUser ? 'whiteAlpha.700' : 'gray.400'}
          position="absolute"
          bottom="-18px"
          right={isUser ? 0 : 'auto'}
          left={isUser ? 'auto' : 0}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Box>
    </HStack>
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

  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, #f0f4f8)',
    'linear(to-br, gray.900, #171923)'
  );

  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(23, 25, 35, 0.8)');
  const inputBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(Array.from(files)); // Convert to Array to preserve value
    }
    e.target.value = null; // Reset input
  };

  return (
    <Flex direction="column" h="100%" bgGradient={bgGradient} position="relative">
      {/* Dynamic Header */}
      <Flex
        px={6}
        py={3}
        borderBottom="1px"
        borderColor={borderColor}
        align="center"
        justify="space-between"
        bg={headerBg}
        backdropFilter="blur(10px)"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack spacing={3}>
          <Box p={2} bg="blue.500" borderRadius="md" color="white">
            <AttachmentIcon boxSize={4} />
          </Box>
          <VStack align="start" spacing={0}>
            <Heading size="sm" fontWeight="bold">PDFPal</Heading>
            <Text fontSize="xs" color="gray.500">
              {isProcessingPdf ? 'Indexing Files...' : 'Ready to help'}
            </Text>
          </VStack>
        </HStack>

        <Tooltip label={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            borderRadius="full"
            size="sm"
          />
        </Tooltip>
      </Flex>

      {/* Messages Area */}
      <Box flex={1} px={6} py={4} overflowY="auto">
        <VStack spacing={6} align="stretch">
          {messages.length === 0 && !isProcessingPdf ? (
            <Flex
              h="100%"
              direction="column"
              align="center"
              justify="center"
              textAlign="center"
              color="gray.500"
              opacity={0.8}
            >
              <Box
                p={6}
                bg={useColorModeValue('white', 'whiteAlpha.100')}
                borderRadius="full"
                mb={6}
                boxShadow="lg"
              >
                <AttachmentIcon w={10} h={10} color="blue.400" />
              </Box>
              <Heading size="lg" mb={3}>Welcome to PDFPal</Heading>
              <Text maxW="md" fontSize="lg">
                Upload PDFs or Images to get started. I can summarize documents and read text from images!
              </Text>
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

          {/* Typing Indicator */}
          {(isLoading || isProcessingPdf) && (
            <HStack align="end" spacing={2}>
              <Avatar
                size="xs"
                name="AI Assistant"
                bg="purple.500"
                icon={<AttachmentIcon transform="rotate(270deg)" />}
              />
              <Box
                bg={useColorModeValue('white', 'gray.700')}
                px={4}
                py={3}
                borderRadius="20px 20px 20px 5px"
                boxShadow="sm"
              >
                <HStack spacing={1}>
                  <Box
                    w="6px"
                    h="6px"
                    bg="blue.500"
                    borderRadius="full"
                    animation={`${typing} 1.4s infinite ease-in-out both`}
                  />
                  <Box
                    w="6px"
                    h="6px"
                    bg="blue.500"
                    borderRadius="full"
                    animation={`${typing} 1.4s infinite ease-in-out both 0.2s`}
                  />
                  <Box
                    w="6px"
                    h="6px"
                    bg="blue.500"
                    borderRadius="full"
                    animation={`${typing} 1.4s infinite ease-in-out both 0.4s`}
                  />
                </HStack>
                {(isProcessingPdf) && <Text fontSize="xs" color="gray.500" mt={2}>Processing files...</Text>}
              </Box>
            </HStack>
          )}

          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input Area */}
      <Box p={4} bg={headerBg} backdropFilter="blur(10px)">
        <Box
          p={1}
          bg={inputBg}
          borderRadius="full"
          boxShadow="lg"
          border="1px solid"
          borderColor={borderColor}
          transition="all 0.2s"
          _focusWithin={{ ring: 2, ringColor: 'blue.400', borderColor: 'transparent' }}
        >
          <form onSubmit={handleSubmit}>
            <InputGroup size="lg">
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf, .png, .jpg, .jpeg"
                onChange={handleFileChange}
                display="none"
                disabled={isLoading || isProcessingPdf}
              />

              <Tooltip label="Upload Files (PDF/Images)" placement="top">
                <IconButton
                  aria-label="Upload Files"
                  icon={<AttachmentIcon />}
                  variant="ghost"
                  isRound
                  color="gray.500"
                  onClick={() => fileInputRef.current?.click()}
                  isDisabled={isLoading || isProcessingPdf}
                  ml={1}
                />
              </Tooltip>

              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isProcessingPdf ? "Processing files..." : "Ask questions about your documents..."}
                variant="unstyled"
                px={4}
                height="48px"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isLoading || isProcessingPdf}
              />

              <InputRightElement height="48px" mr={1}>
                <IconButton
                  type="submit"
                  colorScheme="blue"
                  icon={<FiSend />}
                  variant="solid"
                  isRound
                  size="md"
                  isLoading={isLoading}
                  isDisabled={!message.trim() || isProcessingPdf}
                  aria-label="Send message"
                />
              </InputRightElement>
            </InputGroup>
          </form>
        </Box>
        <Text textAlign="center" fontSize="xs" color="gray.400" mt={2}>
          AI can make mistakes. Please verify important information.
        </Text>
      </Box>
    </Flex>
  );
};

export default ChatWindow;