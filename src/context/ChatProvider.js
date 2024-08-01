import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const ChatContext = React.createContext();

const ChatProvider = ({ children , navigate }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState();
  const [SelectedChat , setSelectedChat] = useState();
  const [chats , setChats]= useState([])
  const [notification, setNotification] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    } else {
      setUser(userInfo);
    }
  }, [navigate]);
  return (
    <ChatContext.Provider
      value={{ user, setUser, SelectedChat,  notification, setNotification,setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const useChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
