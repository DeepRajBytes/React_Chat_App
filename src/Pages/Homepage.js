import React , {useEffect}from "react";
import {Login , Signup } from '../component/index'
import { useNavigate } from "react-router-dom";

import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

function Homepage() {
   const navigate = useNavigate();

   useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo")); 
      if (userInfo) {
        navigate("/chat");
      }
   },[])
   

  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          bg={"white"}
          w="100%"
          m="30px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Text fontSize={"4xl"} fontFamily="Work sans" color="black">
            Talk - A - Tive
          </Text>
        </Box>
        <Box
          bg="white"
          w="100%"
          p={4}
          borderRadius="lg"
          color="black"
          fontFamily="Work sans"
          borderWidth="1px"
        >
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Signup</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login></Login>
              </TabPanel>
              <TabPanel>
               <Signup></Signup>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
}

export default Homepage;
