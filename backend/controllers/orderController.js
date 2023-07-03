// *****  Mongoose Order model connected to DB  ******
import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";


const createOrder = asyncHandler(async (req, res) => {
    return res.send("create order");
});
const getUserOrders = asyncHandler(async (req, res) => {
    return res.send("get user orders");
});
const updateOrderToPaid = asyncHandler(async (req, res) => {
    return res.send("update order to paid");
});


// ADMIN ACCESS ONLY
const getOrderById = asyncHandler(async (req, res) => {
    return res.send("get order by id");
});
const updateOrderShipmentStatus = asyncHandler(async (req, res) => {
    return res.send("update shipment status");
});
const updateOrderDeliveryStatus = asyncHandler(async (req, res) => {
    return res.send("update delivery status");
});
const getAllOrders = asyncHandler(async (req, res) => {
    return res.send("get all orders");
});


export {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderShipmentStatus,
    updateOrderDeliveryStatus,
    getAllOrders
};



