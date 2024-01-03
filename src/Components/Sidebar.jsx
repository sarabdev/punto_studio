import {
  Avatar,
  Box,
  Flex,
  Icon,
  Text,
  Stack,
  Image,
  Button,
  Heading,
  BoxProps,
  Drawer,
  DrawerContent,
  IconButton,
  useDisclosure,
  DrawerOverlay,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  Switch,
  Input,
} from "@chakra-ui/react";
import logo from "../assests/logo.jpg";
import { LuFiles } from "react-icons/lu";
import { FaBell, FaPlus } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { BsFolder2, BsCalendarCheck } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { HiOutlineShare } from "react-icons/hi";
import { WiTime3 } from "react-icons/wi";
import { useState } from "react";
import { CiFolderOn } from "react-icons/ci";
import { Link, Outlet } from "react-router-dom";

export default function Index() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [showSidebar, setShowSidebar] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      as="section"
      bg={useColorModeValue("gray.50", "gray.700")}
      minH="100vh"
    >
      <SidebarContent
        display={{ base: "none", lg: "unset" }}
        isOpen={showSidebar}
      />

      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent isOpen={showSidebar} w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box transition=".3s ease" ml={{ base: 0, lg: showSidebar ? 80 : "" }}>
        <Flex
          as="header"
          align="center"
          justifyContent={{ base: "space-between", lg: "space-between" }}
          w="full"
          px="4"
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow="sm"
          h="20"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", lg: "none" }}
            onClick={() => {
              setShowSidebar(true);
              onOpen();
            }}
            icon={<FiMenu />}
            size="md"
          />
          <Flex alignItems="center" gap="4">
            <IconButton
              aria-label="Menu"
              display={{ base: "none", lg: "inline-flex" }}
              onClick={() => setShowSidebar(!showSidebar)}
              icon={<FiMenu />}
              size="md"
            />
            <Flex align="center">
              <Image src={logo} h="36px" w="36px" />
              <Text
                fontSize="xl"
                ml="2"
                color={useColorModeValue("brand.500", "white")}
                fontWeight="semibold"
              >
                Punta Studio
              </Text>
            </Flex>
          </Flex>

          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              size={"sm"}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              _hover={{ textDecoration: "none" }}
            >
              <Avatar
                size={"md"}
                name="Ahmad"
                src="https://avatars2.githubusercontent.com/u/37842853?v=4"
              />
            </MenuButton>
            <MenuList fontSize={17} zIndex={5555}>
              <MenuItem>Il Mio Profilo</MenuItem>
              <MenuItem>Cambia Password</MenuItem>
              <MenuItem justifyContent="space-between">
              Modalità Scura
                <Switch
                  colorScheme="blue"
                  isChecked={colorMode === "dark"}
                  onChange={toggleColorMode}
                />
              </MenuItem>
              <MenuItem
                as={Link}
                to="/login"
                onClick={() => {
                  localStorage.removeItem("token");
                }}
              >
                Esci
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Box
          as="main"
          overflowY="auto"
          style={{ height: "calc(100vh - 80px)" }}
          bg={useColorModeValue("auto", "gray.700")}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

const SidebarContent = ({ isOpen, ...props }) => (
  <Box
    as="nav"
    pos="fixed"
    top="0"
    left="0"
    zIndex="sticky"
    h="full"
    pb="10"
    overflowX="hidden"
    overflowY="auto"
    bg={useColorModeValue("white", "gray.800")}
    borderColor={useColorModeValue("inherit", "gray.700")}
    borderRightWidth="1px"
    w="80"
    transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
    transition="transform 0.3s ease"
    {...props}
  >
    <Box px="4" mt="4">
      <Menu placement="auto-start">
        <MenuButton
          as={Button}
          w="full"
          size={"sm"}
          rounded={"full"}
          variant={"link"}
          cursor={"pointer"}
          _hover={{ textDecoration: "none" }}
        >
          <Box w="full">
            <Button
              as="div"
              leftIcon={<FaPlus />}
              bg={useColorModeValue("gray.100", "btn")}
              w="full"
              rounded="25px"
              color={useColorModeValue("", "link")}
              py="6"
            >
             Nuovo
            </Button>
          </Box>
        </MenuButton>
        <MenuList fontSize={17} zIndex={5555}>
          <MenuItem as={Link} to="/new-guide">
            <CiFolderOn size={20} style={{ marginRight: "10px" }} /> Nuova Guida
          </MenuItem>
          <MenuItem>
            <FaPlus size={20} style={{ marginRight: "10px" }} /> Nuova Cartella
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>

    <Box px="6" mb="4" mt="4" color="gray.500">
    I Tuoi File
    </Box>
    <Flex
      direction="column"
      as="nav"
      fontSize="md"
      gap="2"
      aria-label="Main Navigation"
    >
      <Link to="/">
        <NavItem icon={LuFiles}>Mie Guide</NavItem>
      </Link>
      <NavItem icon={HiOutlineShare}>File Condivisi</NavItem>
      <NavItem icon={WiTime3}>Recenti</NavItem>
    </Flex>
  </Box>
);

const NavItem = (props) => {
  const color = useColorModeValue("gray.600", "gray.300");

  const { icon, children } = props;
  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      color={useColorModeValue("inherit", "white")}
      _hover={{
        bg: useColorModeValue("gray.100", "btn"),
        color: useColorModeValue("gray.900", "link"),
      }}
    >
      {icon && (
        <Icon
          mx="2"
          boxSize="4"
          _groupHover={{
            color: color,
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};
