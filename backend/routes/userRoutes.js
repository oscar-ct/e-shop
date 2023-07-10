import express from "express";
import {
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
} from "../controllers/userController.js";
import {protect, admin} from "../middleware/authMiddleware.js";


// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

router.post('/',registerUser);
router.post('/logout', logoutUser);
router.post('/login', authUser);

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