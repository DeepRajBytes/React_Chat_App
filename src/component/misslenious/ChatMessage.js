import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

function ChatMessage({ message, isUser }) {
  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"} mb={2}>
      <Box
        maxW="80%"
        bg={isUser ? "blue.500" : "gray.300"}
        color={isUser ? "white" : "black"}
        p={3}
        borderRadius="lg"
      >
        <Text>{message}</Text>
      </Box>
    </Flex>
  );
}

export default ChatMessage;
