import React, { useState } from "react";
import {
  Button,
  ModalHeader,
  useDisclosure,
  ModalContent,
  ModalOverlay,
  Modal,
  ModalFooter,
  ModalBody,
  IconButton,
  ModalCloseButton,
  useToast,
  Box,
  Input,
  FormControl,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import axios from "axios";
import UserlistItem from "../userAvatar/UserlistItem";

function UpdateGroupChatModel({ fetchAgain, setFetchAgain, fetchMessages }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, SelectedChat, setSelectedChat } = useChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/grouprename",
        {
          chatId: SelectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      toast({
        title: "Group Renamed Successfully",
        duration: 4000,
        status: "success",
        isClosable: true,
        position: "bottom-left",
      });

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      let errorMessage = "An error occurred";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: "Error Occurred",
        duration: 4000,
        status: "error",
        isClosable: true,
        position: "bottom-left",
        description: errorMessage,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/details?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1, triggeredByLeaveButton = false) => {
    if (!triggeredByLeaveButton && user1._id === user.userdata._id) {
      return;
    }

    if (
      SelectedChat.groupAdmin._id !== user.userdata._id &&
      user1._id !== user.userdata._id
    ) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );
      // console.log("ye last me", data);
      user1._id === user.userdata._id
        ? setSelectedChat()
        : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (SelectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already Exists",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (SelectedChat.groupAdmin._id !== user.userdata._id) {
      toast({
        title: "Only Admins Can Add New Members",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setSearchResult([]);
      setLoading(false);
      setSearch("");
    } catch (error) {
      toast({
        title: "Error Occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        description: error.response.data.message,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={onOpen} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {SelectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {SelectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={SelectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult.map((u) => (
                <UserlistItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleRemove(user.userdata, true)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModel;
