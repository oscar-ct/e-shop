import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;
    if (token) {
        try {
            const decodedUserId = jwt.verify(token, process.env.JWT_SECERT);
            req.user = await User.findById(decodedUserId.userId).select("-password");
            next();
        } catch (e) {
            res.status(401);
            throw new Error("Not authorized, token invalid" + e);
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const admin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        throw new Error("Not authorized as admin");
    }
});

export {protect, admin};