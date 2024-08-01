import React, { useEffect, useState, useRef } from "react";
import "./style.css";
import {
  Box,
  Text,
  IconButton,
  useToast,
  Spinner,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileModel from "../misslenious/ProfileModel";
import UpdateGroupChatModel from "../misslenious/UpdateGroupChatModel";
import axios from "axios";
import ScrollableChat from "../misslenious/ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import * as animationData from "../Animations/typing.json";
import * as animationWait from "../Animations/wait.json";

const ENDPOINT = "https://chat-app-backend-eg60.onrender.com/";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, SelectedChat, setSelectedChat, notification, setNotification } = useChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const socketRef = useRef();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

   const defaultOptions2 = {
     loop: true,
     autoplay: true,
     animationData: animationWait,
     rendererSettings: {
       preserveAspectRatio: "xMidYMid slice",
     },
   };

  const toast = useToast();

  useEffect(() => {
    socketRef.current = io(ENDPOINT);
    socket = socketRef.current;
    socket.emit("setUp", user.userdata);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = SelectedChat;
  }, [SelectedChat]);

  useEffect(() => {
    socket.on("Message Received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.some(n => n._id === newMessageReceived._id)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  }, [notification, messages, SelectedChat]);

  const fetchMessages = async () => {
    if (!SelectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${SelectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", SelectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
        description: error.response.data.message,
      });
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", SelectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message/",
          {
            content: newMessage,
            chatId: SelectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);

        // Emit message to other users
        socket.emit("new message", data);
      } catch (error) {
        toast({
          title: "Error Occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
          description: error.response.data.message,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", SelectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 5000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", SelectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {SelectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!SelectedChat.isGroupChat ? (
              <>
                {getSender(user, SelectedChat?.users)}
                <ProfileModel user={getSenderFull(user, SelectedChat?.users)} />
              </>
            ) : (
              <>
                {SelectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                thickness="10px"
                speed="0.10s"
                emptyColor="gray.200"
                color="blue.500"
                size="lg"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={40}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Type a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            <Lottie
              options={defaultOptions2}
              height={140}
              width={170}
              style={{ marginBottom: 15, marginLeft: 0 }}
            />
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
