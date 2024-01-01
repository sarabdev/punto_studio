import {
  Box,
  Button,
  Code,
  Heading,
  Icon,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
export default function DisplayCourseLessonMarkdown({ markdown, lesson_name }) {
  const libgColor = useColorModeValue("gray.50", "lessonlibg");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const bgColor = useColorModeValue("gray.300", "gray.900");
  const licolor = useColorModeValue("black", "white");

  return (
    <Box
      sx={{
        h1: {
          fontSize: "1.5em",
          color: licolor,
          padding: "12px 0px",
        },
        h2: {
          fontSize: "1.25em",
          color: licolor,
          padding: "10px 0px",
          textDecoration: "underline",
        },
        h3: {
          fontSize: "1.125em",
          color: licolor,
          padding: "8px 0px",
          textDecoration: "underline",
        },
        h4: {
          fontSize: "1em",
          color: "white",
          padding: "6px 0px",
        },
        p: {
          fontSize: "1em",
          color: licolor,
          marginTop: "10px",
          marginBottom: "10px",

          whiteSpace: "break-spaces",
          // backgroundColor: libgColor,
        },

        ol: {
          margin: "10px 0px",
          paddingLeft: "25px",
          color: licolor,
          backgroundColor: libgColor,
          paddingTop: "10px",
          paddingBottom: "10px",
          borderRadius: "10px",
        },
        ul: {
          margin: "10px 0px",
          paddingLeft: "25px",
          color: licolor,
          backgroundColor: libgColor,
          paddingTop: "10px",
          paddingBottom: "10px",
          borderRadius: "10px",
        },
        li: {
          fontSize: "1em",
          color: licolor,
          backgroundColor: libgColor,
          padding: "6px 0px",
        },
        "li p": {
          fontSize: "1em",
          color: licolor,
          backgroundColor: libgColor,
        },
      }}
      bg={bgColor}
      borderRadius="md"
      w="full"
      shadow="md"
      display="flex"
      flexDir="column"
      rounded="10px"
    >
      <Box py={1} px="10px" borderBottomWidth="1px">
        <Heading
          style={{
            fontSize: "20px",
            textDecoration: "none",
          }}
        >
          {lesson_name}
        </Heading>
      </Box>
      <Box padding="10px" flex="1">
        <ReactMarkdown>
          {markdown && unescapeContent(markdown ?? "")}
        </ReactMarkdown>
      </Box>
    </Box>
  );
}

function unescapeContent(content) {
  if (typeof content !== "string") {
    console.error("Content is undefined or not a string");
    return "";
  }

  return content
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/^```|```$/g, "")
    .trim();
}
