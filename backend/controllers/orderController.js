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
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            },
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
    const orders = await Order.find({ "user.id": req.user._id});
    if (orders) {
        res.status(201);
        return res.json(orders);
    } else {
        throw new Error("No order was found");
    }

});


const getUserOrderById = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (userId) {
        const order = await Order.findById(req.params.id)
        if (order && userId.toString() === order.user.id.toString()) {
            res.status(200);
            return res.json(order);
        } else if (order && userId.toString() !== order.user.id.toString()) {
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
    const orders = await Order.find({}).sort({createdAt: -1});
    res.status(201);
    res.json(orders);
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



