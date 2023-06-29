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


// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

router.post('/',registerUser);
router.post('/logout', logoutUser);
router.get('/login',authUser);
router.get('/profile',getUserData);
router.put('/profile', updateUserData);



// ADMIN ACCESS ONLY
router.get('/',getUsers);
router.get('/:id',getUserById);
router.put('/:id',updateUsers);
router.delete('/:id', deleteUsers);


export default router;