import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogic";
import { useChatState } from "../../context/ChatProvider";
import { Avatar, Tooltip, Box, Text } from "@chakra-ui/react";

function ScrollableChat({ messages }) {
  const { user, SelectedChat } = useChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user.userdata._id) ||
              isLastMessage(messages, i, user.userdata._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt={SelectedChat.isGroupChat ? "19px" : "10px"}
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  src={m.sender.picture}
                  name={m.sender.name}
                />
              </Tooltip>
            )}
            <Box
              style={{
                backgroundColor: `${
                  m.sender._id === user.userdata._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user.userdata._id
                ),
                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {SelectedChat.isGroupChat &&
                m.sender._id !== user.userdata._id && (
                  <Text fontSize="xs" fontWeight="bold">
                    {m.sender.name}
                  </Text>
                )}
              {m.content}
            </Box>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
