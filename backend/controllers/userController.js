import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MailtrapClient } from "mailtrap";
import dotenv from 'dotenv';
dotenv.config();


const invalidCredentialsError = () => {
    throw new Error("Invalid email/password")
};

// POST
const validateEmail = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email: email}).select("email").lean();
    if (user) {
        return res.json({
            isValidEmail: true
        });
    } else {
        return res.json({
            isValidEmail: false
        });
    }
});

// POST
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
                maxAge: 30*24*60*60*1000 // 30d
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

// POST
const recoveryLink = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email: email});
    if (user) {
        const {password, _id} = user;
        const secret = process.env.JWT_SECERT + password;
        const payload = {_id}
        const token = jwt.sign(payload, secret, {expiresIn: "3m"});
        let domain;
        if (process.env.NODE_ENV !== "development") {
            domain = "https://e-shop-us.com"
        } else {
            domain = "http://localhost:3000"
        }
        const link = `${domain}/reset-password/${_id}/${token}`
        /// send email here

        const client = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });
        const sender = { name: "e-shop-us.com", email: "reset-password@e-shop-us.com" };
        client
            .send({
                from: sender,
                to: [{ email: email }],
                subject: "Reset Password Link",
                text: link,
            })
            .then(console.log)
            .catch(console.error);
        res.send("email sent!")
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// GET
const getResetPassword = asyncHandler(async (req, res) => {
    const {id, token} = req.params;
    const user = await User.findById(id);
    if (user) {
        const {password} = user;
        const secret = process.env.JWT_SECERT + password;
        try {
            const decode = jwt.verify(token, secret);
            res.send(decode)
        } catch (e) {
            throw new Error(e);
        }
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// POST
const resetPassword = asyncHandler(async (req, res) => {
    const {id, newPassword} = req.body;
    const user = await User.findById(id);
    if (user) {
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        const updatedUser = await user.save();
        if (updatedUser) {
            res.status(201);
            return res.json({
                message: "Password updated!"
            });
        }
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// GET
const getUserData = asyncHandler(async (req, res) => {
    const {_id} = req.user._id;
    const user = await User.findById(_id);
    if (user) {
        res.status(200);
        return res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            shippingAddresses: user.shippingAddresses,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
// POST
const verifyPassword = asyncHandler(async (req, res) => {
    const password = req.body.password;
    const id = req.user._id;
    const user = await User.findById(id);
    if (user) {
        const bcryptMatchPassword = await bcrypt.compare(password, user.password);
        if (bcryptMatchPassword) {
            res.status(200);
            return res.json({
                passwordVerified: true,
            });
        } else {
            res.status(200);
            return res.json({
                passwordVerified: false,
            });
        }
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
// PUT
const updateUserData = asyncHandler(async (req, res) => {
    const id = req.user._id;
    const user = await User.findById(id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.newPassword) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.newPassword, salt);
        }
        const updatedUser = await user.save();
        res.status(200);
        return res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            shippingAddresses: updatedUser.shippingAddresses,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
// POST
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    const userExists = await User.findOne({email: email});
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    } else {
        const salt = await bcrypt.genSalt(10);
        const protectedPassword = await bcrypt.hash(password, salt);
        console.log(protectedPassword);
        const user = await User.create({
            name: name,
            email: email,
            password: protectedPassword,
        });
        if (user) {
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
            res.status(201);
            return res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
});
// POST
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200);
    res.json({message: "logout success"});
});

// PUT
const updateUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        const shippingAddress = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode,
            state: req.body.state,
            country: req.body.country
        }
        if (user.shippingAddresses.length === 0) {
            user.shippingAddresses = [shippingAddress]
            const updatedUser = await user.save();
            res.status(201);
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                shippingAddresses: updatedUser.shippingAddresses
            });
        } else {
            user.shippingAddresses = [...user.shippingAddresses, shippingAddress];
            const updatedUser = await user.save();
            res.status(201);
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                shippingAddresses: updatedUser.shippingAddresses,
            });
        }
    } else {
        res.status(404);
        throw new Error("This user does not exist.");
    }
});




// ADMIN ONLY ACCESS
// ***********************
// GET
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.status(201);
    res.json(users);
});
// GET
const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    if (user) {
        res.status(201);
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
// PUT
const updateUsers = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        // user.isAdmin = Boolean(req.body.isAdmin);
        if (req.body.isAdmin) {
            user.isAdmin = req.body.isAdmin === "true";
        }
        await user.save();
        const updatedUser =  await User.findById(id).select("-password");
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
// DELETE
const deleteUsers = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("This user cannot be deleted");
        } else {
            await User.deleteOne({_id: user._id});
            res.status(201);
            res.json({message: "User deleted"});
        }
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
// ************************


export {
    validateEmail,
    authUser,
    registerUser,
    logoutUser,
    getUserData,
    verifyPassword,
    updateUserData,
    updateUserAddress,
    getUsers,
    getUserById,
    updateUsers,
    deleteUsers,
    recoveryLink,
    getResetPassword,
    resetPassword,
};