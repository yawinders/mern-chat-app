import expressAsyncHandler from "express-async-handler";
import { Message } from "../models/MessageModel.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
import { response } from "express";



export const sendMessage = expressAsyncHandler(async (req, res) => {

    const { chatId, content } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400)
    }
    var newMessage = {
        sender: req.user._id,
        content,
        chat: chatId
    }

    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")

        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,

        })

        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export const allMessages = expressAsyncHandler(async (req, res) => {



    try {
        const message = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }

})