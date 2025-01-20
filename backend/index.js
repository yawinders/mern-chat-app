import express from 'express'

import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import dotenv from 'dotenv';
import path from 'path'

dotenv.config();

const app = express()


app.use(express.json()) //telling our server to acceptjson data from frontend



// app.get("/", (req, res) => {
//     res.send("welcome to chatApp again")
// })

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// deployment code
const __dirname1 = path.resolve();
console.log("process.env.NODE_ENV", typeof process.env.NODE_ENV);


if (process.env.NODE_ENV == 'production') {
    console.log("process.env.NODE_ENV", process.env.NODE_ENV)
    app.use(express.static(path.join(__dirname1, "/frontend/build")))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        console.log("process.env.NODE_ENV", process.env.NODE_ENV)
        res.send("welcome to chatApp againn")
    })
}



export default app;