import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import Login from 'components/Authentication/Login'
import Signup from 'components/Authentication/Signup'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (userInfo) {
            navigate("/chats")
        }
    }, [])

    return (
        <Container maxW='xl' centerContent>
            <Box
                display='flex'
                justifyContent='center'
                p={3}
                bg='white'
                width='100%'
                m="40px 0 15px 0"
                borderRadius='lg'
                borderWidth='1px'
            >
                <Text fontSize='4xl' fontFamily='Work sans'>Hey Buddy</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList>
                        <Tab width="50%">Login</Tab>
                        <Tab width="50%">Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage