import express from "express";
import {
    validateEmail,
    authUser,
    registerUser,
    logoutUser,
    getUserData,
    updateUserData,
    verifyPassword,
    getUsers,
    getUserById,
    updateUsers,
    deleteUsers,
    updateUserAddress,
    recoveryLink,
    getResetPassword,
    resetPassword,
} from "../controllers/userController.js";
import {protect, admin} from "../middleware/authMiddleware.js";


// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

router.post('/',registerUser);
router.post('/logout', logoutUser);
router.post('/login', authUser);
router.post('/recovery-link', recoveryLink);
router.get('/reset-password/:id/:token', getResetPassword);
router.post('/reset-password', resetPassword);
router.post('/auth-email', validateEmail);

// Using custom middleware PROTECT
router.get('/profile', protect, getUserData);
router.put('/profile', protect, updateUserData);
router.post('/profile', protect, verifyPassword);
router.put('/profile/address', protect, updateUserAddress);



// ADMIN ACCESS ONLY
// Using custom middleware PROTECT and ADMIN
router.get('/',protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUsers);
router.delete('/:id', protect, admin, deleteUsers);


export default router;