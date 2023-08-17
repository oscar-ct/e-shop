import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getAllOrders,
    cancelOrder,
    cancelOrderItem,
} from "../controllers/orderController.js";
import {protect, admin} from "../middleware/authMiddleware.js";


// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

// Using custom middleware PROTECT
router.get('/myorders', protect, getUserOrders);
router.post('/', protect, createOrder);
router.put('/:id/payment', protect, updateOrderToPaid);
router.put('/:id/cancelitem', protect, cancelOrderItem);
router.put('/:id/cancelorder', protect, cancelOrder);


router.get('/:id', protect, getOrderById);  // User & Admin Access

// ADMIN ACCESS ONLY
// Using custom middleware PROTECT and ADMIN
router.get('/',protect, admin, getAllOrders);
router.put('/:id/update', protect, admin, updateOrderStatus);


export default router;