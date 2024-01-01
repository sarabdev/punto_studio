import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  VStack,
  Text,
  Box,
  Center,
  Button,
  Icon,
  Flex,
  useColorModeValue,
  Spinner,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Progress,
} from "@chakra-ui/react";
import { FaCloudUploadAlt, FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { extractTextFromPDF } from "../CommomFunctions/ExtractTextFromPdf";

function FileDropzone(props) {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const token = localStorage.getItem("token");

  const onDrop = React.useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const removeFile = (file) => {
    setFiles(files.filter((currentFile) => currentFile.path !== file.path));
  };

  const onSubmit = async () => {
    let combinedText = "";
    setIsLoading(true);
    const formData = new FormData();

    for (const file of files) {
      // if (file.type === "application/pdf") {
      //   const text = await extractTextFromPDF(file);
      //   combinedText += text + "\n\n";
      // } else {
      formData.append("files", file);
      // }
    }

    if (formData.has("files")) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/file-processing/extract-text`,
          formData,

          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: (progressEvent) => {
              // Calculate progress for the upload part
              const uploadPercentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              // Assuming the total progress is split evenly between upload and creation:
              setTotalProgress(uploadPercentage / 2);
            },
          }
        );
        combinedText += response.data;
        setTotalProgress(50);
      } catch (error) {
        setTotalProgress(0);
        setIsLoading(false);
        console.error("Error sending docx/image files: ", error);
      }
    }

    if (combinedText) {
      const cancelProgressSimulation = simulateProgress(setTotalProgress);
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/course/create-course`,
          { text: combinedText },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        cancelProgressSimulation();
        setTotalProgress(100);
        if (response.data) {
          const courseId = response.data;
          navigate(`/roadmap/${courseId}`);
        }
      } catch (error) {
        console.error("Error processing a course: ", error);
        setIsLoading(false);
        setTotalProgress(0);
      }
    } else {
      console.log("File is empty");
      setIsLoading(false);
      setTotalProgress(0);
    }

    setIsLoading(false);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const fileList = files.map((file) => (
    <Box key={file.path} bg="link" px="4" rounded="25px" py="3">
      <Flex gap="3" align="center">
        <Text>{file.path}</Text>
        <Box
          cursor="pointer"
          onClick={() => removeFile(file)}
          aria-label={`Remove ${file.path}`}
          _hover={{
            color: "red",
          }}
        >
          <FaTrashAlt />
        </Box>
      </Flex>
    </Box>
  ));

  return (
    <>
      <Center spacing={4} maxW="800px" mx="auto" minH="100%" p={6}>
        <Box p={2} borderWidth="1px" borderRadius="lg" bg={bgColor}>
          <VStack p={6} spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Create a study guide in seconds ⏰
            </Text>
            <Text textAlign="center">
              Create a study guide by uploading documents and related links.
            </Text>

            <Box
              {...getRootProps()}
              p={5}
              border="2px dashed #d0d0d0"
              borderRadius="md"
              cursor="pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              transition="border-color 0.2s"
              _hover={{ borderColor: "#a0a0a0" }}
              w="full"
            >
              <input {...getInputProps()} />
              <Center
                transition="transform 0.2s ease-in-out"
                transform={isHovering ? "translateY(-15%)" : "translateY(0)"}
              >
                <Icon as={FaCloudUploadAlt} w={10} h={10} />
              </Center>
              <Text textAlign="center" mt={3}>
                Drag 'n' drop some files here, or click to select files
              </Text>
            </Box>
            {files.length > 0 && (
              <>
                <Box as="aside" w="full">
                  <Text fontWeight="semibold " mb="4">
                    Files
                  </Text>
                  <Flex flexWrap="wrap" gap="2">
                    {fileList}
                  </Flex>
                </Box>
                <Button
                  w="full"
                  rounded="25px"
                  bg="btn"
                  color="link"
                  onClick={onSubmit}
                  isLoading={isLoading}
                >
                  Submit
                </Button>
              </>
            )}
          </VStack>
          {isLoading && (
            <Box px={8} w="full">
              <Text mb={4}>Total Operation Progress:</Text>
              <Progress  value={totalProgress} size="lg" colorScheme="blue" />
            </Box>
          )}
        </Box>
      </Center>
    </>
  );
}

export default FileDropzone;

function simulateProgress(callback) {
  let progress = 50; // Start from 50%, since we assume file extraction is done
  const interval = setInterval(() => {
    progress += 2; // Increment by a small, arbitrary amount of progress
    if (progress < 100) {
      callback(progress);
    } else {
      clearInterval(interval); // Stop the interval when it reaches or exceeds 100%
    }
  }, 1000); // Adjust the interval to control how fast progress moves

  return () => clearInterval(interval); // Return a cancel function
}
