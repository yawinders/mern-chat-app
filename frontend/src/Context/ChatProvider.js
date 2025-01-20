import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'



const chatContext = createContext()

export const ChatState = () => {
    const result = useContext(chatContext)
    return result
}

export const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const navigate = useNavigate()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [notification, setNotification] = useState([])
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if (!userInfo) {
            navigate("/")
        }
    }, [navigate])


    return (
        <chatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </chatContext.Provider>
    )
}
