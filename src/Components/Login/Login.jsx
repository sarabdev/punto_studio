import { useState } from "react";
import {
  FormControl,
  Input,
  Stack,
  Button,
  Heading,
  VStack,
  Center,
  InputGroup,
  InputRightElement,
  Box,
  useToast,
} from "@chakra-ui/react";
import * as yup from "yup";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";

const signinSchema = yup.object().shape({
  Email: yup.string().email("Email is invalid").required("Email is required"),
  Password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(signinSchema) });
  const watchEmail = watch("Email", "");
  const watchPassword = watch("Password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/login`,
        {
          email: data.Email,
          password: data.Password,
        }
      );

      if (response?.data) {
        localStorage.setItem("token", response?.data?.jwt);
        navigate("/");
        toast({
          position: "top-right",
          title: "Login Sunccessfully.",
          description: `Welcome back  ${data.Email}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        position: "top-right",
        title: "Login Unsunccessful.",
        description: e?.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Box position="relative" bg="gray.700" h="100vh" w="100vw">
      <Box
        display={{ base: "none", md: "block" }}
        position="absolute"
        top="2%"
        left="5%"
        fontSize="36px"
        color="#2998FF"
        fontWeight="600"
      >
        Punto Studio
      </Box>

      <Center h="100vh" alignItems={["end", "end", "center"]}>
        <Stack minW={{ base: "100%", md: "640px" }} spacing={12}>
          <Center
            display={{ base: "flex", md: "none" }}
            fontSize="24px"
            color="#2998FF"
            fontWeight="600"
          >
            Punto Studio
          </Center>

          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            bg="gray.800"
            borderTopRadius={{ base: "16px", md: "none" }}
            rounded={{ base: "", md: "lg" }}
            px={{ base: "15px", md: "140px" }}
            py={{ base: "40px", md: "60px" }}
          >
            <Stack align="center" mb="30px">
              <Heading
                fontSize={{ base: "18px", md: "24px" }}
                fontWeight="600"
                color="white"
              >
                Log in
              </Heading>
            </Stack>

            <VStack spacing={4} w="100%">
              <FormControl id="email">
                <Input
                  bg="gray.800"
                  borderColor={errors.Email ? "#E1526C" : "#616161"}
                  rounded="md"
                  _hover={{
                    borderColor: "#616161",
                  }}
                  color="white"
                  type="email"
                  placeholder="Email address"
                  {...register("Email")}
                  _placeholder={{
                    color: "#D2D2D2",
                    fontSize: { base: "12px", md: "14px" },
                  }}
                />
                <Box color="#E1526C" fontSize="14px" mt="5px">
                  {errors.Email && <p>{errors.Email.message}</p>}
                </Box>
              </FormControl>
              <FormControl id="password">
                <InputGroup size="md">
                  <Input
                    bg="gray.800"
                    borderColor={errors.Password ? "#E1526C" : "#616161"}
                    color="white"
                    rounded="md"
                    _hover={{
                      borderColor: "#616161",
                    }}
                    type={show ? "text" : "password"}
                    placeholder="Password"
                    {...register("Password")}
                    _placeholder={{
                      color: "#D2D2D2",
                      fontSize: { base: "12px", md: "14px" },
                    }}
                  />
                  <InputRightElement>
                    <Box size="sm" rounded="md" onClick={handleClick}>
                      {!show ? (
                        <AiOutlineEyeInvisible size={20} color="#616161" />
                      ) : (
                        <AiOutlineEye size={20} color="#616161" />
                      )}
                    </Box>
                  </InputRightElement>
                </InputGroup>
                <Box color="#E1526C" fontSize="14px" mt="5px">
                  {errors.Password && <p>{errors.Password.message}</p>}
                </Box>
              </FormControl>
            </VStack>
            {/* <Stack direction="row" justify="end" w="100%">
              <Link color="#D2D2D2" fontSize={{ base: "12px", md: "14px" }}>
                Forgot password?
              </Link>
            </Stack> */}
            <VStack w="100%" mt="30px" direction="column" gap="15px">
              <Button
                bg="btn"
                color="link"
                _hover={{
                  bg: "link",
                  color: "btn",
                }}
                rounded="40px"
                w="100%"
                py="12px"
                fontSize="14px"
                fontWeight="600"
                type="submit"
                isLoading={isLoading}
              >
                Log in
              </Button>
              <Link to="/register" style={{ width: "100%" }}>
                <Button
                  variant="outline"
                  color="link"
                  _hover={{
                    bg: "btn",
                    color: "link",
                    border: "none",
                  }}
                  rounded="40px"
                  w="100%"
                  py="12px"
                  fontSize="14px"
                  fontWeight="600"
                >
                  Create an account
                </Button>
              </Link>
            </VStack>
          </VStack>
        </Stack>
      </Center>
    </Box>
  );
};

export default Login;
