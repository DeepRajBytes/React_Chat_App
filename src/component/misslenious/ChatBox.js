import React from "react";
import { Box } from "@chakra-ui/react";
import SingleChat from "../pagwComponent/SingleChat";
import { useChatState } from "../../context/ChatProvider";

function ChatBox({ fetchAgain, setFetchAgain }) {
  const { SelectedChat } = useChatState();
  return (
    <Box
      display={{ base: SelectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox;
