import { Box, VStack, Button, Text, HStack, IconButton, useColorModeValue, Tooltip, Avatar, Flex } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ChatIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { FiLogOut } from 'react-icons/fi';

const ChatHistory = ({ chats, activeChat, onSelectChat, onCreateNewChat, onDeleteChat, onLogout }) => {
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const chatItemHover = useColorModeValue('gray.50', 'gray.800');
  const activeChatBg = useColorModeValue('blue.50', 'blue.900');
  const activeChatColor = useColorModeValue('blue.600', 'blue.200');

  return (
    <Box
      w="300px"
      h="100vh"
      borderRight="1px"
      borderColor={borderColor}
      bg={bg}
      display="flex"
      flexDirection="column"
      zIndex={20}
      boxShadow="sm"
    >
      {/* Header / Brand */}
      <Flex p={5} borderBottom="1px" borderColor={borderColor} align="center">
        <Avatar size="sm" bg="blue.500" icon={<ChatIcon color="white" />} mr={3} />
        <Text fontWeight="bold" fontSize="lg" letterSpacing="tight">
          History
        </Text>
      </Flex>

      {/* New Chat Button */}
      <Box p={4} pb={2}>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="md"
          width="100%"
          onClick={onCreateNewChat}
          boxShadow="md"
          _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          New Chat
        </Button>
      </Box>

      {/* Chat List */}
      <VStack spacing={1} p={3} flex={1} overflowY="auto" overflowX="hidden">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <HStack
              key={chat.id}
              w="100%"
              p={3}
              borderRadius="lg"
              cursor="pointer"
              bg={activeChat === chat.id ? activeChatBg : 'transparent'}
              _hover={{ bg: activeChat === chat.id ? activeChatBg : chatItemHover }}
              justify="space-between"
              align="center"
              onClick={() => onSelectChat(chat.id)}
              position="relative"
              role="group"
              transition="background 0.2s"
            >
              <Box flex="1" minW={0}>
                <Text
                  fontWeight={activeChat === chat.id ? "bold" : "medium"}
                  fontSize="sm"
                  color={activeChat === chat.id ? activeChatColor : 'inherit'}
                  isTruncated
                  mb={1}
                >
                  {chat.title}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {format(new Date(chat.createdAt), 'MMM d, h:mm a')}
                </Text>
              </Box>

              <IconButton
                aria-label="Delete chat"
                icon={<DeleteIcon />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
              />
            </HStack>
          ))
        ) : (
          <Flex direction="column" align="center" justify="center" h="200px" color="gray.500" opacity={0.6}>
            <ChatIcon boxSize={8} mb={2} />
            <Text fontSize="sm">No conversation history.</Text>
          </Flex>
        )}
      </VStack>

      {/* Footer */}
      <Box p={4} borderTop="1px" borderColor={borderColor}>
        <Button
          leftIcon={<FiLogOut />}
          variant="ghost"
          width="full"
          size="sm"
          colorScheme="red"
          onClick={onLogout}
        >
          Logout
        </Button>
        <Text fontSize="xs" color="gray.400" textAlign="center" mt={2}>
          &copy; 2024 PDFPal
        </Text>
      </Box>
    </Box>
  );
};

export default ChatHistory;