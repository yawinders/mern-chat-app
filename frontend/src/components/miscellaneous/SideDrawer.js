import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Avatar, Badge, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { ChatState } from 'Context/ChatProvider'
import React, { useEffect, useState } from 'react'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from 'components/ChatLoading'
import UserListItem from 'components/UserAvatar/UserListItem'
import { getSender } from 'config/ChatLogics'

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const [loadingChat, setLoadingChat] = useState();
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/")
    }
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })

            return;
        }
        try {
            setLoading(true)

            const config = {
                headers: {

                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
            setLoading(false)
        }
    }
    const accessChat = async (userId) => {
        // console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);
            // console.log(data);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    useEffect(() => {



    }, [user])

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search user to chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <i style={{ color: "black" }} className="fa-solid fa-magnifying-glass"></i>
                        <Text
                            display={{ display: "none", md: "flex" }} px="4" >
                            Search User
                        </Text>
                    </Button>

                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work Sans"> Hey Buddy</Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>

                            <BellIcon />

                        </MenuButton>
                        <MenuList paddingLeft={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>

                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>

                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>

                    <DrawerBody>
                        <Box display="flex" p={2}>
                            <Input
                                placeholder='Search By name or email'
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>

                        </Box>
                        {loading ? (<ChatLoading />) : (
                            searchResult?.map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)} />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer