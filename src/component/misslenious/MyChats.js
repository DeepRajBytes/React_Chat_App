import React, { useState, useEffect } from "react";
import { useChatState } from "../../context/ChatProvider";
import {
  Box,
  useToast,
  Button,
  Stack,
  Text,
  Badge,
  Flex,
  Spacer,
  Avatar,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import axios from "axios";
import { getSender } from "../../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie";
import * as aiChatAnimation from "../Animations/AI2.json";
import AiChatModel from "./AiChatModel";



function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const {
    user,
    SelectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChatState();
  const toast = useToast();
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: aiChatAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat/", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        duration: 4000,
        status: "error",
        isClosable: true,
        position: "bottom",
        description: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const getNewMessageCount = (chatId) => {
    return notification.filter((n) => n.chat._id === chatId).length;
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setNotification(notification.filter((n) => n.chat._id !== chat._id));
  };

  return (
    <Box
      display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Flex
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                cursor="pointer"
                bg={SelectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={SelectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text>
                  {!chat.isGroupChat ? (
                    <>{getSender(loggedUser, chat.users)} </>
                  ) : (
                    <>{chat.chatName} </>
                  )}
                </Text>
                <Spacer />
                {getNewMessageCount(chat._id) > 0 && (
                  <Badge colorScheme={!chat.isGroupChat ? "red" : "blue"}>
                    {getNewMessageCount(chat._id)}
                  </Badge>
                )}
              </Flex>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      <AiChatModel>
        <Box
          position="absolute"
          bottom={4}
          left={4}
          cursor="pointer"
          w="auto"
          h="auto"
          bg="white"
          borderRadius="full"
          boxShadow="md"
          display="flex"
          alignItems="center"
          pr={3}
          border="2px solid lightblue"
        >
          <Lottie
            options={defaultOptions}
            style={{ width: "40px", height: "40px" }}
          />
          <Text ml={1} color="black" fontWeight="bold" fontSize="sm">
            Chat with AI
          </Text>
        </Box>
      </AiChatModel>
    </Box>
  );
}

export default MyChats;
