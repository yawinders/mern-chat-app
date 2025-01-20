import ChatPage from 'pages/ChatPage'
import HomePage from 'pages/HomePage'
import React from 'react'
import { RouterProvider } from 'react-router'
import { createBrowserRouter } from 'react-router-dom'

const Routes = () => {
    const route = createBrowserRouter([
        {
            path: '/',
            element: <HomePage />
        },
        {
            path: 'chats',
            element: <ChatPage />
        }
    ])
    return (
        <RouterProvider router={route} />
    )
}

export default Routes
