import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Heading,
  Flex,
  Spacer,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoIosChatboxes } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import axios from "axios";

function ChatBox({ lessonMarkdown }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [draftMessage, setDraftMessage] = useState("");
  const chatBoxDisplay = useBreakpointValue({ base: "none", lg: "flex" });
  const { isOpen, onToggle } = useDisclosure();
  const libgColor = useColorModeValue("gray.50", "lessonlibg");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const bgColor = useColorModeValue("gray.300", "gray.900");
  const licolor = useColorModeValue("black", "white");
  const token = localStorage.getItem("token");

  const initialText = `Whenever you receive a question, you should first refer to the provided markdown text to find the answer. If the answer is contained within the markdown, You will use that information to give a response, possibly improving the phrasing.
   If the markdown does not contain the answer, you will formulate a response independently.But dont add any thing like from this text from this context so the other think you have provided text.
   The text you will refer to is as follows also Please check if following content is in Italian then you should reply in italian. if user content is in english you should reply in english. Always remember that!: ${lessonMarkdown}`;

  useEffect(() => {
    setMessages([
      { role: "user", content: initialText },
      { role: "assistant", content: "Ciao! Come posso assisterti oggi?" },
      //{ role: "assistant", content: "Hello! How can I assist you today?" },

    ]);
  }, []);
  // Ref for the messages container

  // Scroll to end whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (draftMessage.trim() === "") {
      return;
    }

    const newUserMessage = {
      role: "user",
      content: draftMessage.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setDraftMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/chat/message`,
        {
          conversation: messages, // Send existing conversation
          newMessage: draftMessage.trim(), // Send the new message as a plain string
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the messages state with the new conversation from the backend
      const botResponse = { role: "assistant", content: response.data.message };
      setMessages([...response.data.conversation, botResponse]);
      setDraftMessage(""); // Reset draftMessage
    } catch (error) {
      console.error("Error while sending message:", error);
      // Optionally, handle error to show to the user
    }
  };

  // Aligns message bubble based on the role
  const getAlignment = (role) => {
    return role === "user" ? "flex-end" : "flex-start";
  };

  // Helper to create message bubbles with alignment
  const MessageBubble = ({ message }) => {
    return (
      <HStack
        alignSelf={getAlignment(message.role)}
        bg={message.role === "user" ? "blue.200" : libgColor}
        borderRadius="md"
        color={message.role === "user" ? "black" : licolor}
        p={2}
        px={3}
        maxW="90%"
      >
        <Text>{message.content}</Text>
      </HStack>
    );
  };
  return (
    <>
      {/* Chat Icon for small screens */}
      <IconButton
        icon={isOpen ? <IoClose /> : <IoIosChatboxes />}
        size="lg"
        position="fixed"
        bottom="4"
        right="4"
        zIndex="overlay"
        colorScheme="blue"
        display={chatBoxDisplay === "none" ? "flex" : "none"}
        onClick={onToggle}
      />

      {/* Chat Box */}
      <Flex
        direction="column"
        bg={bgColor}
        shadow="md"
        rounded="20px"
        top={chatBoxDisplay === "none" ? "15px" : "0px"}
        minWidth={chatBoxDisplay === "none" ? "100vw" : "400px"}
        left={0}
        maxW={chatBoxDisplay === "none" ? "100vw" : "400px"}
        h={chatBoxDisplay === "none" ? "90vh" : ""}
        position={chatBoxDisplay === "none" ? "fixed" : "initial"}
        zIndex="modal"
        display={chatBoxDisplay === "flex" || isOpen ? "flex" : "none"}
        border={chatBoxDisplay === "none" ? "1px solid white" : "none"}
      >
        {/* Chat Header */}
        <HStack color={licolor} px={4} py={8} borderBottomWidth="1px">
          <IoIosChatboxes size="24px" />
          <Heading fontSize="24px">Chatta con noi</Heading>
        </HStack>

        {/* Messages Container */}
        <VStack
          px={4}
          py={2}
          spacing={4}
          overflowY="auto"
          flex={1}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
        >
          {messages.map(
            (message, index) =>
              // Filter out the first message
              index !== 0 && <MessageBubble key={index} message={message} />
          )}
          {/* Invisible div to manage scroll */}
          <div ref={messagesEndRef} />
        </VStack>

        {/* Input Container */}
        <HStack px={4} py={2} borderTopWidth="1px" spacing={4}>
          <Input
            placeholder="Type a message..."
            value={draftMessage}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
            onChange={(e) => setDraftMessage(e.target.value)}
            flex={1}
          />
          <Button colorScheme="blue" onClick={sendMessage}>
          Invia
          </Button>
        </HStack>
      </Flex>
    </>
  );
}

export default ChatBox;
