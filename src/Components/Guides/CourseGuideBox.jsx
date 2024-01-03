import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { IoMdPaper } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import DisplayLessonMarkdown from "../NewGuide/NewGuideMarkdown";
import DisplayCourseLessonMarkdown from "./CourseLessonMarkdown";
import { Link } from "react-router-dom";
import axios from "axios";

export default function CourseGuideBox({ course, fetchCourse }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = localStorage.getItem("token");
  const toast = useToast();

  const handleDelete = async () => {
    console.log("Deleting course with ID:", course.id);
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/course/${course.id}/deleteCourse`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        toast({
          title: "Corso eliminato.",
          description: `Il corso "${course.name}" È stato eliminato con successo.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        fetchCourse();
      })
      .catch((err) => {
        toast({
          title: "Errore.",
          description: `Il corso "${course.name}" Non è stato possibile eliminare. ${err.message}`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      });
    onClose();
  };
  return (
    <>
      <Flex
        bg={useColorModeValue("white", "black")}
        color={useColorModeValue("black", "white")}
        flexDir="column"
        rounded="20px"
        w="450px"
        flexGrow="1"
        gap={6}
        p={6}
        as={Link}
        to={`/roadmap/${course.id}`}
        _hover={{
          border: useColorModeValue("1px solid black", "1px solid white"),
          p: "23px",
        }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={4} alignItems="center">
            <Icon fontSize={"22px"} as={IoMdPaper} />
            {course.name}
          </Flex>
          <Box
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <Menu closeOnSelect={true}>
              <MenuButton bg={useColorModeValue("white", "black")} p={1}>
                <Icon
                  fontSize={"22px"}
                  as={BsThreeDotsVertical}
                  mt={2}
                  cursor="pointer"
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Rinomina Guida</MenuItem>
                <MenuItem color="red" onClick={onOpen}>
                Elimina
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
        <Box
          maxH="250px"
          overflow="hidden"
          border={useColorModeValue("1px solid black", "1px solid white")}
          rounded="10px"
        >
          <DisplayCourseLessonMarkdown
            markdown={course?.lessons[0]?.content}
            lesson_name={course?.lessons[0]?.lesson_name}
          />
        </Box>
        <Box>{timeSince(course.createdAt)}</Box>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Elimina Corso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          Sei sicuro/a di voler eliminare il corso "{course.name}"? Questa azione non può essere annullata.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
            Annulla
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
            Elimina
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function timeSince(dateString) {
  const now = new Date();
  const courseDate = new Date(dateString);
  const secondsPast = (now.getTime() - courseDate.getTime()) / 1000;

  if (secondsPast < 60) {
    // Less than a minute
    return `${Math.round(secondsPast)} seconds ago`;
  }
  if (secondsPast < 3600) {
    // Less than an hour
    return `${Math.round(secondsPast / 60)} minutes ago`;
  }
  if (secondsPast <= 86400) {
    // Less than a day
    return `${Math.round(secondsPast / 3600)} hours ago`;
  }
  if (secondsPast < 2592000) {
    // Less than a month
    return `${Math.round(secondsPast / 86400)} days ago`;
  }
  if (secondsPast < 31536000) {
    // Less than a year
    return `${Math.round(secondsPast / 2592000)} months ago`;
  }
  return `${Math.round(secondsPast / 31536000)} years ago`; // Over a year
}
