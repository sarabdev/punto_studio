import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseGuideBox from "./CourseGuideBox";
import { Link } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";

export default function Guides() {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState(null);
  const btnBg = useColorModeValue("gray.100", "btn");
  const btnColor = useColorModeValue("", "link");
  const inputbg = useColorModeValue("white", "white");
  const inputColor = useColorModeValue("white", "black");
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchCourse();
  }, []); // Added dependency array

  async function fetchCourse() {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/course/getUserCourses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        console.log(response.data);
        const coursesData = response.data;
        setCourses(coursesData);
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

  if (!courses?.length) {
    return (
      <Center flexDir="column" minH="100%" gap={2}>
        <Heading>Guides not found.</Heading>
        <Button as={Link} to="/new-guide">
          Create Guide
        </Button>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Box color="black">
        <InputGroup size="md">
          <InputLeftElement>
            <Icon as={IoSearchOutline} />
          </InputLeftElement>
          <Input
            pr="4.5rem"
            type="text"
            placeholder="Search Guide"
            _placeholder={{
              color: "black",
            }}
            bg={inputbg}
          />
        </InputGroup>
      </Box>
      <Box>
        <Heading py={5} size={"md"}>
          All Guides
        </Heading>
        <Flex flexWrap="wrap" w="100%" gap={6}>
          {courses?.map((course) => (
            <CourseGuideBox fetchCourse={fetchCourse} course={course} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
}
