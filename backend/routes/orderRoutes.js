import express from "express";
import {
    validateOrder,
    confirmPrices,
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

router.post("/auth-order", validateOrder);
router.post("/verifyamount", confirmPrices);

// Using custom middleware PROTECT
router.get('/myorders', protect, getUserOrders);
router.put('/:id/cancelitem', protect, cancelOrderItem);

router.post('/', createOrder);
router.put('/:id/payment', updateOrderToPaid);
router.put('/:id/cancelorder', cancelOrder);
router.get('/:id', getOrderById);  // User & Admin Access

// ADMIN ACCESS ONLY
// Using custom middleware PROTECT and ADMIN
router.get('/',protect, admin, getAllOrders);
router.put('/:id/update', protect, admin, updateOrderStatus);


export default router;