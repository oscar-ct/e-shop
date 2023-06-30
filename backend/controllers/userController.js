import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const invalidCredentialsError = () => {
    throw new Error("Invalid email/password")
};

// GET
const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if (user) {
        const bcryptMatchPassword = await bcrypt.compare(password, user.password);
        if (bcryptMatchPassword) {

            // Create jwt token
            const token = jwt.sign({userId: user.id}, process.env.JWT_SECERT, {expiresIn: "30d"});

            // Set jwt as HTTP-only cookie
            res.cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development", // boolean
                sameSite: "strict",
                // milliseconds
                maxAge: 30*24*60*60*100 // 30d
            });

           return res.json({
               _id: user.id,
               name: user.name,
               email: user.email,
               isAdmin: user.isAdmin,
           });
        } else {
            res.status(401);
            invalidCredentialsError();
        }
    } else {
        res.status(401);
        invalidCredentialsError();
    }
});
// GET
const getUserData = asyncHandler(async (req, res) => {
    res.send("getUserData")
});
// PUT
const updateUserData = asyncHandler(async (req, res) => {
    res.send("updateUserData")
});
// POST
const registerUser = asyncHandler(async (req, res) => {
    res.send("registerUser")
});
// POST
const logoutUser = asyncHandler(async (req, res) => {
    res.send("logoutUser")
});



// ADMIN ONLY ACCESS
// ***********************
// GET
const getUsers = asyncHandler(async (req, res) => {
    res.send("getUsers")
});
// GET
const getUserById = asyncHandler(async (req, res) => {
    res.send("getUserById")
});
// PUT
const updateUsers = asyncHandler(async (req, res) => {
    res.send("updateUsers")
});
// DELETE
const deleteUsers = asyncHandler(async (req, res) => {
    res.send("deleteUsers")
});
// ************************



export {
    authUser,
    registerUser,
    logoutUser,
    getUserData,
    updateUserData,
    getUsers,
    getUserById,
    updateUsers,
    deleteUsers,
};