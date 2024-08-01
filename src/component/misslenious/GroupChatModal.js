import { useDisclosure , ModalBody ,ModalCloseButton ,ModalHeader , ModalContent , ModalOverlay , Modal , Button , ModalFooter, useToast, FormControl, Input, Spinner, Box} from '@chakra-ui/react';
import React, { useState } from "react";
import { useChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserlistItem from '../userAvatar/UserlistItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem';

function GroupChatModal({children}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser, setSelectedUser] = useState([]);
    const [search , setSearch] = useState("");
    const [searchResult , setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast()
    const { user, chats, setChats } = useChatState();

    const handleSearch =async (query) =>{
        setSearch(query);
        if(!query){
            return
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/details?search=${query}`, config);
            // console.log("ye itmes hai ", data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:"Error Occured",
                duration: 4000,
                status: "error",
                isClosable: true,
                position: "bottom-left",
                description: error.response.data.message,
            })
            setLoading(false);
            return;
        }
    }

    const handleSubmit = async() => {
        if(!groupChatName || !selectedUser){
            toast({
                title:"Please Fill All Fields",
                duration: 4000,
                status: "error",
                isClosable: true,
                position: "bottom-left",
            })
            return;
        }

        try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };

            const { data } = await axios.post("/api/chat/group" ,{
                 name : groupChatName 
                , users : JSON.stringify(selectedUser.map(u => u._id))
            } , config);
            console.log("group bana", data);
            setChats([data , ...chats]);
            onClose();
            toast({
                title:"Group Created Successfully",
                duration: 4000,
                status: "success",
                isClosable: true,
                position: "bottom",
            })
        } catch (error) {
            console.log("ye dikkt hui", error);
            toast({
                title:"Error Occured While Creating the Group",
                duration: 4000,
                status: "error",
                isClosable: true,
                position: "bottom",
                description: error.response.data,
            })
            return;
        }
    }

    const handleGroup = (userToAdd) =>{
        if(selectedUser.includes(userToAdd)){
            toast({
                title:"User Already Selected",
                duration: 4000,
                status: "warning",
                isClosable: true,
                position: "bottom-left",
            })
            return;
        }
        setSelectedUser([...selectedUser, userToAdd]);
    }

    const handleDelete = (userToDelete) =>{
        setSelectedUser(selectedUser.filter((u)=>u._id!==userToDelete._id));
    }

 return (
   <>
     <span onClick={onOpen}>{children}</span>

     <Modal isOpen={isOpen} onClose={onClose}>
       <ModalOverlay />
       <ModalContent>
         <ModalHeader
           fontSize="35px"
           fontFamily="Work sans"
           display="flex"
           justifyContent="center"
         >
           Create Group Chat
         </ModalHeader>
         <ModalCloseButton />
         <ModalBody display="flex" flexDir="column" alignItems="center">
           <FormControl>
             <Input
               placeholder="Group Name"
               mb={3}
               onChange={(e) => setGroupChatName(e.target.value)}
             />
           </FormControl>
           <FormControl>
             <Input
               placeholder="Add Users : Ex. Jhon , Deepraj"
               mb={1}
               onChange={(e) => handleSearch(e.target.value)}
             />
           </FormControl>
           <Box display="flex" flexWrap="wrap" width="100%">
             {selectedUser.map((u) => (
               <UserBadgeItem
                 key={u._id}
                 user={u}
                 handleFunction={() => handleDelete(u)}
               ></UserBadgeItem>
             ))}
           </Box>
           {loading ? (
             <Spinner />
           ) : (
             searchResult
               ?.slice(0, 5)
               .map((user) => (
                 <UserlistItem
                   key={user._id}
                   user={user}
                   handleFunction={() => handleGroup(user)}
                 ></UserlistItem>
               ))
           )}
         </ModalBody>

         <ModalFooter>
           <Button colorScheme="blue" onClick={handleSubmit}>
             Create Group
           </Button>
         </ModalFooter>
       </ModalContent>
     </Modal>
   </>
 );
}

export default GroupChatModal;