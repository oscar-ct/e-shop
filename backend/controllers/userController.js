import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";

// GET
const authUser = asyncHandler(async (req, res) => {
    res.send("authUser")
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