import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Center,
  Spinner,
  Box,
  Heading,
  VStack,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import DisplayLessonMarkdown from "../NewGuide/NewGuideMarkdown";
import ChatBox from "../ChatBox/ChatBox";

export default function StudyGuide() {
  const { lessonId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  async function fetchLesson() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/lesson/get-lesson/${lessonId}/getLesson`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setLesson(response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching lesson:",
        error.response?.data || error.message
      );
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <Center h="full">
        <Spinner />
      </Center>
    );
  }

  if (!lesson) {
    return (
      <Center h="full">
        <Box>
          <Heading size="lg">Lezione non trovata</Heading>
        </Box>
      </Center>
    );
  }

  return (
    <VStack w="full" h="full" p={6}>
      <Box
        display="flex "
        flexDir={{ base: "column", lg: "row" }}
        w="full"
        gap="20px"
        h="full"
      >
        <Box w="full" h="100%">
          <DisplayLessonMarkdown
            lesson_name={lesson.lesson_name}
            markdown={lesson.content}
          />
        </Box>
        <ChatBox lessonMarkdown={lesson.content} />
      </Box>
    </VStack>
  );
}
