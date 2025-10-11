import { Box, VStack, Button, Text, HStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';

const ChatHistory = ({ chats, activeChat, onSelectChat, onCreateNewChat }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      w="280px"
      h="100vh"
      borderRight="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      bg={bgColor}
      overflowY="auto"
      display="flex"
      flexDirection="column"
    >
      <Box p={4} borderBottom="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          width="100%"
          onClick={onCreateNewChat}
        >
          New Chat
        </Button>
      </Box>

      <VStack spacing={1} p={2} flex={1} overflowY="auto">
        {chats.map((chat) => (
          <Box
            key={chat.id}
            w="100%"
            p={3}
            borderRadius="md"
            cursor="pointer"
            bg={activeChat === chat.id ? activeBgColor : 'transparent'}
            _hover={{ bg: activeChat === chat.id ? activeBgColor : hoverBgColor }}
            onClick={() => onSelectChat(chat.id)}
          >
            <Text 
              fontWeight="medium" 
              isTruncated
              color={activeChat === chat.id ? 'blue.500' : 'inherit'}
            >
              {chat.title}
            </Text>
            <Text fontSize="xs" color="gray.500" mt={1}>
              {format(new Date(chat.createdAt), 'MMM d, yyyy h:mm a')}
            </Text>
          </Box>
        ))}
        
        {chats.length === 0 && (
          <Box textAlign="center" p={4} color="gray.500">
            <Text>No chats yet</Text>
            <Text fontSize="sm" mt={2}>Start a new chat to begin</Text>
          </Box>
        )}
      </VStack>

      <Box p={4} borderTop="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          PDF Chat App
        </Text>
      </Box>
    </Box>
  );
};

export default ChatHistory;
