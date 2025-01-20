import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
const Signup = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => { setShow(!show) }


    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const toast = useToast();

    const postDetails = (pics) => {
        setLoading(true)
        if (pics === undefined) {
            toast({
                title: 'Please Select an Image.',
                // description: "We've created your account for you.",
                status: 'warning',
                duration: 5000,
                isClosable: true,
            })
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData() // is a built-in JavaScript object used to construct a set of key-value pairs to send data using the fetch API
            data.append("file", pics)  // append method adds a key-value pair to the FormData object.
            data.append("upload_preset", "chat-app")
            console.log(data);

            //https://deuein9wj.api.cloudinary.com/v1_1/image/upload
            fetch("https://api.cloudinary.com/v1_1/deuein9wj/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    // console.log(data);

                    setPic(data.url.toString());
                    setLoading(false);
                }).catch((error) => {
                    toast({
                        title: "Image Upload Failed!",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                    setLoading(false);
                })

        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    }
    const submitHandler = async () => {
        setLoading(true)
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Password Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }
        //making api request to store in database
        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                },
            };
            const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
            toast({
                title: "Registraiton Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats')
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
        }
    }
    return (
        <VStack spacing='5px'>
            <FormControl id='first-name'>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? "hide" : "show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        type={show ? "text" : "password"}

                        placeholder="Confirm password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm"
                            onClick={handleClick}
                        >
                            {show ? "Hide" : "Show"}

                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"

                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={Loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default Signup