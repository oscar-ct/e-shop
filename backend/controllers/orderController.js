// *****  Mongoose Order model connected to DB  ******
import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";


const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items found");
    } else {
        const newOrder = new Order({
            user: req.user._id,
            orderItems: orderItems.map(function (item){
                return {
                    ...item,
                    product: item._id,
                    _id: undefined,
                }
            }),
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: itemsPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
        });

        const createdOrder = await newOrder.save();
        res.status(201);
        return res.json(createdOrder);
    }
});


const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200);
    return res.json(orders);
});


const getUserOrderById = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (userId) {
        const order = await Order.findById(req.params.id);
        if (order && userId.toString() === order.user.toString()) {
            res.status(200);
            return res.json(order);
        } else if (order && userId.toString() !== order.user.toString()) {
            res.status(404);
            throw new Error("You do not have access to this order!");
        } else if (!order) {
            res.status(404);
            throw new Error("This order does not exist.");
        } else {
            res.status(404);
            throw new Error("Something went wrong locating this order, try again later.");
        }
    }
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
    getUserOrderById,
    getOrderById,
    updateOrderToPaid,
    updateOrderShipmentStatus,
    updateOrderDeliveryStatus,
    getAllOrders
};



