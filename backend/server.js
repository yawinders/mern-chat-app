import { connectDB } from './config/db.js';
import app from './index.js';
import dotenv from 'dotenv';
import http from 'http';

import { Server } from 'socket.io';

dotenv.config();

connectDB();
const PORT = process.env.PORT || 5000;

// Create the HTTP server using `http.createServer` and pass `app` to it
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',  // Frontend URL (adjust as needed for your frontend)
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,  // If you're using cookies or need credentials
    },
    transports: ['websocket'],  // Use WebSocket transport
});

// Socket.IO connection event
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('setup', (userData) => {   //taking user data from the frontend
        socket.join(userData._id);
        socket.emit("connected");
        // console.log(userData._id);
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined Room" + room);

    })

    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"))
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) {
            console.log("chat.users not defined");
            return;
        }
        //we want our message to emitted to all of the other user exccept for us
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket, leave(userData._id)

    })
});



// Start the server with the HTTP instance created
server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
