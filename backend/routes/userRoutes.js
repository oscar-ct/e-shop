import express from "express";
import {
    authUser,
    registerUser,
    logoutUser,
    getUserData,
    updateUserData,
    getUsers,
    getUserById,
    updateUsers,
    deleteUsers,
} from "../controllers/userController.js";
import {protect, admin} from "../middleware/authMiddleware.js";


// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

router.post('/',registerUser);
router.post('/logout', logoutUser);
router.get('/login', authUser);

// Using custom middleware PROTECT
router.get('/profile', protect, getUserData);
router.put('/profile', protect, updateUserData);



// ADMIN ACCESS ONLY
// Using custom middleware PROTECT and ADMIN
router.get('/',protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUsers);
router.delete('/:id', protect, admin, deleteUsers);


export default router;