// *****  Mongoose Order model connected to DB  ******
import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";


const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("Items not found");
    } else {
        const newOrder = new Order({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            },
            orderItems: orderItems.map(function (item){
                return {
                    ...item,
                    productId: item._id,
                    _id: null,
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
    const orders = await Order.find({ "user.id": req.user._id});
    if (orders) {
        res.status(201);
        return res.json(orders);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }

});



const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
     if (order) {
         order.isPaid = true;
         order.paidAt = Date.now();
         order.paymentResult = {
             id: req.body.id,
             status: req.body.status,
             update_time: req.body.update_time,
             email_address: req.body.payer.email_address,
         };
         const updatedOrder = await order.save();
         res.status(200);
         res.json(updatedOrder);
     } else {
         res.status(404);
         throw new Error("Something went wrong locating this order, try again later.");
     }
});


const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        if (!order.isShipped) {
            order.isCanceled = true;
            order.canceledAt = Date.now();
            const updatedOrder = await order.save();
            res.status(200);
            res.json(updatedOrder);
        } else {
            res.status(400);
            throw new Error("This order cannot be canceled.");
        }
    } else {
        res.status(404);
        throw new Error("Something went wrong locating this order, try again later.");
    }
});


const cancelOrderItem = asyncHandler(async (req, res) => {
    const {productId} = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
        const {isShipped, isCanceled} = order;
        if (!isShipped && !isCanceled) {
            order.canceledItems.push(productId);
            const updatedOrder = await order.save();
            res.status(200);
            res.json(updatedOrder);
        } else {
            res.status(400);
            throw new Error("This item cannot be canceled.");
        }
    } else {
        res.status(404);
        throw new Error("Something went wrong locating this order, try again later.");
    }
});



// ADMIN && USER ACCESS
const getOrderById = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (userId) {
        const order = await Order.findById(req.params.id)
        if (order) {
            if (userId.toString() === order.user.id.toString()) {
                res.status(200);
                return res.json(order);
            } else if (req.user.isAdmin) {
                res.status(200);
                return res.json(order);
            } else if (order && userId.toString() !== order.user.id.toString()) {
                res.status(404);
                throw new Error("You do not have access to this order!");
            }
        } else {
            res.status(404);
            throw new Error("Order not found");
        }
    }
});


// ADMIN ACCESS ONLY

const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    const {trackingNumber, isShipped, isDelivered} = req.body;
    if (order) {
        order.trackingNumber = trackingNumber;
        order.isShipped = Boolean(isShipped);
        const delivered = Boolean(isDelivered);
        if (delivered) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        } else {
            order.isDelivered = false;
        }
        const updatedOrder = await order.save();
        return res.status(201).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }

});
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({createdAt: -1});
    res.status(201);
    res.json(orders);
});



export {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getAllOrders,
    cancelOrder,
    cancelOrderItem,
};



