import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Avatar,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useChatState } from "../../context/ChatProvider";

function UpdateUser({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser } = useChatState();
  const toast = useToast();

  const [name, setName] = useState(user.userdata.name);
  const [email, setEmail] = useState(user.userdata.email);
  const [profilePic, setProfilePic] = useState(user.userdata.picture);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result);
      handleUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (file) => {
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "DeepChatApp");
    data.append("cloud_name", "dx0naouqe");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dx0naouqe/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const responseData = await response.json();
      setProfilePic(responseData.secure_url);
      setLoading(false);
    } catch (error) {
      console.error("Upload Error:", error);
      setLoading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image to Cloudinary",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      

      const { data } = await axios.put(
        `/api/user/update`,
        {
        name: name,
        email: email,
        picture: profilePic,
      },
        config
      );

      if(data){
         localStorage.removeItem("userInfo");
         localStorage.removeItem("token");
         localStorage.setItem("userInfo", JSON.stringify(data));
         localStorage.setItem("token", JSON.stringify(data.token));
      }
      const UpdatedToken = localStorage.getItem("token");

      if (JSON.stringify(data.token) === UpdatedToken){
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
      } 
        
    setLoading(false);
      toast({
        title: "Profile Updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
      toast({
        title: "Error Updating Profile",
        description: "An error occurred while updating profile.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          mx="auto"
          my="auto"
        >
          <ModalHeader
            fontSize="25px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Update User Profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            width="100%"
          >
            <Avatar
              size="xl"
              name={name}
              src={profilePic}
              cursor="pointer"
              onClick={() => document.getElementById("fileInput").click()}
            />
            <Input
              type="file"
              id="fileInput"
              display="none"
              onChange={handleFileChange}
            />
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              mt={4}
            />
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              mt={4}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={handleUpdate}
              isDisabled={loading || !profilePic}
              isLoading={loading}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateUser;
