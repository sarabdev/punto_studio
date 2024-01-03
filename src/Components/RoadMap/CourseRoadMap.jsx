import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Icon,
  Spinner,
  Text,
  VStack,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GiBookmark } from "react-icons/gi";

export default function CourseRoadMap() {
  const { courseId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const btnBg = useColorModeValue("gray.100", "btn");
  const btnColor = useColorModeValue("", "link");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourse();
  }, []); // Added dependency array

  async function fetchCourse() {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/course/get-course/${courseId}/getCourse`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log(response.data);
        const courseData = response.data;
        setCourse(courseData);
      }
    } catch (error) {
      console.error(
        "Error fetching course: ",
        error.response?.data || error.message
      );
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <Center minH="100%">
        <Spinner />
      </Center>
    );
  }

  if (!course) {
    return (
      <Center minH="100%">
        <Text>Corso non trovato.</Text>
      </Center>
    );
  }

  return (
    <Flex direction="column" align="center" mt={10}>
      <VStack spacing={8} width="100%" maxW="600px">
        <Box bg="black" color="white" w="100%" p={5} borderRadius="lg">
          <Heading size="lg">{course.name}</Heading>
          <Flex justify="space-between" align="center" mt={4}>
            <Flex align="center">
              <Icon as={GiBookmark} mr={2} />
              <Text>Lezioni</Text>
            </Flex>
            <Text>{course.lessons?.length || 0}</Text>
          </Flex>
        </Box>

        <VStack
          spacing={4}
          align="stretch"
          overflowY="auto"
          maxH="40vh" // Adjust height as required
          w="100%"
          sx={{
            // For Webkit browsers like Chrome/Safari
            "&::-webkit-scrollbar": {
              width: "16px", // thickness of the scrollbar
              borderRadius: "8px", // optional: if you want rounded scrollbars
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1", // color of the track
            },
            "&::-webkit-scrollbar-thumb": {
              background: btnBg, // color of the thumb
              borderRadius: "20px", // optional: if you want rounded thumbs
              border: "4px solid #f1f1f1", // creates the effect of margin around the thumb
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555", // color when hovering over the thumb
            },
            // For Firefox
            "&": {
              scrollbarWidth: "thin", // "auto" or "thin"
              scrollbarColor: "#888 #f1f1f1", // thumb and track color
            },
          }}
        >
          {course.lessons?.map((lesson) => (
            <Card
              as={Link}
              to={`/study-guide/${lesson.id}`}
              bg="gray.200"
              color="black"
              p={6}
              boxShadow="base"
              borderRadius="lg"
              key={lesson.id} // Ensure unique key for each element
            >
              <Text fontSize="lg">{lesson.lesson_name}</Text>
            </Card>
          ))}
        </VStack>

        {course.lessons?.length > 0 && (
          <Button
            as={Link}
            to={`/study-guide/${course.lessons[0].id}`}
            bgColor={btnBg}
            color={btnColor}
            w="full"
            mt={4}
            p={6}
            borderRadius="lg"
            _hover={{
              bgColor: btnBg,
            }}
          >
            Inizia
          </Button>
        )}
      </VStack>
    </Flex>
  );
}
