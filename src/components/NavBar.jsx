import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import Blockie from "./Blockie";

const Links = ["Dashboard", "Projects", "Team"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function NavBar({
  loggedIn,
  setLoggedIn,
  user,
  setUser,
  getUserTokenBalance,
  setHasQueried,
  setResults,
  setQueryAddress,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogIn = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const res = await provider.send("eth_requestAccounts", []);

    res && setLoggedIn.on();
    setUser(res[0]);
    setQueryAddress(res[0]);
  };

  const handleLogOut = async () => {
    setLoggedIn.off();
    setHasQueried(false);
    setUser();
    setResults();
  };
  useEffect(() => {
    handleLogOut();
  }, []);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Image
              src="https://i.imgur.com/Bd90yaN.png"
              boxSize="50px"
              objectFit="cover"
            />
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            ></HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {!loggedIn ? (
              <Button
                onClick={handleLogIn}
                variant={"solid"}
                colorScheme={"red"}
                size={"sm"}
                mr={4}
              >
                Connect Wallet
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Blockie address={user} size={"sm"} />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={getUserTokenBalance}>My Tokens</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
