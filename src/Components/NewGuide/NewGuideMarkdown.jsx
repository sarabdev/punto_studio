import {
  Box,
  Button,
  Heading,
  Icon,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import { SlLike } from "react-icons/sl";
import { SlDislike } from "react-icons/sl";
export default function DisplayLessonMarkdown({ markdown, lesson_name }) {
  const libgColor = useColorModeValue("gray.50", "lessonlibg");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const bgColor = useColorModeValue("gray.300", "gray.900");
  const licolor = useColorModeValue("black", "white");
  const codeBgColor = useColorModeValue("#f5f5f5", "black");
  const codeTextColor = useColorModeValue("#333", "#c7c7c7");
  // Convert escaped newlines and other sequences to real ones
  const formattedContent = markdown.replace(/\\n/g, "\n").replace(/\\"/g, '"');
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
          whiteSpace: "wrap",
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
        "li a": {
          color: "blue",
          textDecoration: "underline",
        },
        pre: {
          backgroundColor: codeBgColor,
          color: codeTextColor,
          padding: "24px",
          marginTop: "10px",
          overflow: "auto",
          fontFamily: '"Source Code Pro", monospace',
          fontSize: "0.9em",
          borderRadius: "10px",
          whiteSpace: "break-spaces",
        },
      }}
      bg={bgColor}
      borderRadius="md"
      w="full"
      shadow="md"
      display="flex"
      flexDir="column"
      h="100%"
      rounded="20px"
    >
      <Box py={4} px={8} borderBottomWidth="1px">
        <Heading
          style={{
            fontSize: "32px",
            textDecoration: "none",
          }}
        >
          {lesson_name}
        </Heading>
      </Box>
      <Box
        padding="30px"
        flex="1"
        overflow="auto"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <ReactMarkdown>{unescapeContent(markdown)}</ReactMarkdown>
      </Box>
      <Box
        py={4}
        px={8}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" gap="20px">
          <Icon as={SlLike} />
          <Icon as={SlDislike} />
        </Box>
        <Box>Download</Box>
      </Box>
    </Box>
  );
}

function unescapeContent(content) {
  return content
    .replace(/\\n/g, "\n") // Unescape newlines
    .replace(/\\"/g, '"')
    .replace(/^```|```$/g, "")
    .trim();
  // Add other replacements here if necessary
}
