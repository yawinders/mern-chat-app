import expressAsyncHandler from "express-async-handler"
import { User } from '../models/userModel.js'
import { generateToken } from "../config/generateToken.js";
import bcrypt from 'bcrypt'
export const registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the feilds")
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User already exists")
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPass,
        pic,

    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Failed to create the user")
    }
})

export const authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })

    if (user) {
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (isPasswordMatch) {
            //  password matches, return the user details and token
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            });
        } else {
            // If the password does not match, throw an error
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } else {

        res.status(401);
        throw new Error("Invalid email or password or user doesnt exist");
    }
})

export const allUsers = async (req, res) => {

    const keyword = req.query.search ? {
        $or: [{ name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users)


}