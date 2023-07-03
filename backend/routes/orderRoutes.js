import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderShipmentStatus,
    updateOrderDeliveryStatus,
    getAllOrders
} from "../controllers/orderController.js";
import {protect, admin} from "../middleware/authMiddleware.js";


// *****  Router connects to index.js, cleans up code  *****
const router = express.Router();

// Using custom middleware PROTECT
router.get('/myorders', protect, getUserOrders);
router.post('/', protect, createOrder);
router.put('/:id/payment', protect, updateOrderToPaid);



// ADMIN ACCESS ONLY
// Using custom middleware PROTECT and ADMIN
router.get('/',protect, admin, getAllOrders);
router.get('/:id', protect, admin, getOrderById);
router.put('/:id/shipment', protect, admin, updateOrderShipmentStatus);
router.put('/:id/delivery', protect, admin, updateOrderDeliveryStatus);


export default router;