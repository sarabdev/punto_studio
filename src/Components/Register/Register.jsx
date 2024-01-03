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
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { IoIosArrowBack } from "react-icons/io";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const signupSchema = yup.object().shape({
  FullName: yup
    .string()
    .required("È richiesto il nome completo.")
    .matches(/^[aA-zZ\s]+$/, "Solo lettere dell'alfabeto sono consentite per il nome completo."),
  Email: yup.string().email("L'indirizzo email non è valido.").required("È necessario inserire l'indirizzo email."),
  Password: yup
    .string()
    .min(6, "La password deve essere lunga almeno 6 caratteri.")
    .required("È necessaria la password."),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("Password"), null], "Le password devono corrispondere.")
    .required("È richiesta la conferma della password."),
});
const Register = () => {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const [registerType, setRegisterType] = useState("tutor");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(signupSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log(data);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/register`,
        {
          name: data.FullName,
          email: data.Email,
          password: data.Password,
        }
      );

      if (response?.data) {
        toast({
          position: "top-right",
          title: "Account creato.",
          description: "Abbiamo creato un account per te.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      navigate("/login");
    } catch (e) {
      toast({
        position: "top-right",
        title: "Account non creato.",
        description: e?.response?.data?.message || "Si è verificato un errore.",
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
            position="relative"
            borderTopRadius={{ base: "16px", md: "none" }}
            rounded={{ base: "", md: "lg" }}
            px={{ base: "15px", md: "120px" }}
            py={{ base: "40px", md: "60px" }}
          >
            <Link to="/login">
              <Box
                position="absolute"
                top="25px"
                left="24px"
                color="#D2D2D2"
                fontWeight="500"
                display="flex"
                gap="5px"
                alignItems="center"
                cursor="pointer"
                _hover={{
                  color: "link",
                }}
              >
                <IoIosArrowBack size="20px" />
                <Box>Accedi</Box>
              </Box>
            </Link>
            <Stack
              align="center"
              mb={{ base: "15px", md: "30px" }}
              mt={{ base: "20px", md: "10px" }}
            >
              <Heading
                fontSize={{ base: "18px", md: "24px" }}
                fontWeight="600"
                color="white"
              >
               Crea un account
              </Heading>
              <Box color="#D2D2D2" fontSize={{ base: "18px", md: "18px" }}>
              Dettagli personali
              </Box>
            </Stack>

            <VStack spacing="15px" w="100%">
              <FormControl id="full-name">
                <Input
                  bg="gray.800"
                  borderColor={errors.FullName ? "#E1526C" : "#616161"}
                  rounded="md"
                  _hover={{
                    borderColor: "#616161",
                  }}
                  color="white"
                  type="text"
                  placeholder="Full name"
                  autoComplete="username"
                  {...register("FullName")}
                  _placeholder={{
                    color: "#D2D2D2",
                    fontSize: { base: "12px", md: "14px" },
                  }}
                />
                <Box color="#E1526C" fontSize="14px" mt="5px">
                  {errors.FullName && <p>{errors.FullName.message}</p>}
                </Box>
              </FormControl>
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
                  placeholder="Indirizzo email"
                  autoComplete="email"
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

              <FormControl id="password" flex="1">
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
                    autoComplete="new-password"
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
              <FormControl id="confirm_password">
                <InputGroup size="md">
                  <Input
                    bg="gray.800"
                    borderColor={
                      errors.confirm_password ? "#E1526C" : "#616161"
                    }
                    color="white"
                    rounded="md"
                    _hover={{
                      borderColor: "#616161",
                    }}
                    type={show ? "text" : "password"}
                    placeholder="Ridigita la password"
                    autoComplete="new-password"
                    {...register("confirm_password")}
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
                  {errors.confirm_password && (
                    <p>{errors.confirm_password.message}</p>
                  )}
                </Box>
              </FormControl>
            </VStack>
            <VStack
              w="100%"
              mt={{ base: "15px", md: "30px" }}
              direction="column"
              gap="15px"
            >
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
               Continua
              </Button>
              <Box color="#D2D2D2" fontWeight="400" fontSize="14px">
              Creando un account, accetti i nostri
                <Link to="/" style={{ marginLeft: "5px" }}>
                Informativa sulla privacy
                </Link>
              </Box>
            </VStack>
          </VStack>
        </Stack>
      </Center>
    </Box>
  );
};

export default Register;
