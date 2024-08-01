import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  Box,
  Stack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import axios from 'axios';
import { useChatState } from '../../context/ChatProvider';

function AiChatModel({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const {user} = useChatState()

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    
    setMessages((prev) => [...prev, { text: input, isUser: true }]);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };


      const response = await axios.post(
        "/api/chatgpt",
        { prompt: input },
        config
      );
      const answer = response.data.answer;

      setMessages((prev) => [...prev, { text: answer, isUser: false }]);
    } catch (error) {
      console.error('Error fetching ChatGPT response:', error);
    }

    setInput('');
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chat with AI</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              w="100%"
              h={{ base: "450px", md: "350px" }}
              bg="gray.100"
              borderRadius="lg"
              p={4}
              overflowY="auto"
            >
              <Stack spacing={3}>
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={index}
                    message={msg.text}
                    isUser={msg.isUser}
                  />
                ))}
              </Stack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              mr={3}
            />
            <Button colorScheme="blue" onClick={handleSendMessage}>
              Send
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AiChatModel;
