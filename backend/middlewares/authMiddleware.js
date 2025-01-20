import Jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

export const protect = expressAsyncHandler(async (req, res, next) => {
    let token;
    //we need to send the token in header inide authorization
    if (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            //docoding token id
            const decoded = Jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password")  // defining a user variable inside the req object and storing the user
            if (!req.user) {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized Token Failed")
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
})