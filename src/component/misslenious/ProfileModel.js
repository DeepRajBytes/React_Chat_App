import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import UpdateUser from "./UpdateUser";


function ProfileModel({ user, children }) {

  const loggedInUser = JSON.parse(localStorage.getItem("userInfo"));
  const isOwner = user._id === loggedInUser.userdata._id;

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="23px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Hi, {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              userInfo
              src={user.picture}
              alt={user.name}
              mb={4}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter 
          
          display="flex" justifyContent="center">
            {isOwner && (
              <UpdateUser>
                <Button colorScheme="red" mr={3}>
                  Edit Profile
                </Button>
              </UpdateUser>
            )}
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            {}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModel;
