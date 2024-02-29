// *****  Mongoose Order model connected to DB  ******
import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";
import {calculatePrices} from "../utils/calculatePrices.js";

const SHIPPING_PRICE = 10;
const TAX_PERCENTAGE = 0.0825;

const confirmPrices =  asyncHandler(async (req, res) => {
    const {orderItems, validCode} = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No items found");
    } else {
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        });
        const orderItemsFromDB = orderItems.map((itemFromBody) => {
            delete itemFromBody.images
            // delete itemFromBody._id
            delete itemFromBody.price
            const matchingItemFromDB = itemsFromDB.find(
                (item) => item._id.toString() === itemFromBody._id
            );
            return {
                ...itemFromBody,
                price: matchingItemFromDB.price,
            };
        });
        const { totalPrice } =
            calculatePrices(orderItemsFromDB, validCode);
        res.status(201);
        return res.json(totalPrice);
    }
});

const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, validCode } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No items found");
    } else {
        // loop over items from frontend, create array of matching items with data (accurate prices) from database
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map((x) => x._id) },
        });
        // create array of order items linked to user
        const orderItemsFromDB = orderItems.map((itemFromBody) => {
            const matchingItemFromDB = itemsFromDB.find(
                (item) => item._id.toString() === itemFromBody._id
            );
            return {
                ...itemFromBody,
                productId: itemFromBody._id,
                price: matchingItemFromDB.price,
                _id: null,
            };
        });
        // use calc prices
        const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
            calculatePrices(orderItemsFromDB, validCode);
        // create new order with data from frontend, verified with data from db
        const newOrder = new Order({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            },
            orderItems: orderItemsFromDB,
            freeShipping: !!validCode,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: itemsPrice,
            taxPrice: taxPrice,
            shippingPrice: shippingPrice,
            totalPrice: totalPrice,
        });
        // save new order to db
        const createdOrder = await newOrder.save();
        // respond with JSON of new order
        res.status(201);
        return res.json(createdOrder);
    }
});

const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ "user.id": req.user._id}).sort({createdAt: -1});
    if (orders) {
        res.status(201);
        return res.json(orders);
    } else {
        res.status(404);
        throw new Error("Order not found");
    }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const {orderId, details} = req.body;
    const order = await Order.findById(orderId);
     if (order) {
         const { totalPrice, orderItems } = order;
         order.paidAmount = totalPrice;
         order.isPaid = true;
         order.paidAt = Date.now();
         order.paymentResult = {
             id: details.id,
             status: details.status,
             update_time: details.update_time,
             email_address: details.payer.email_address,
         };
         orderItems.forEach((item) => {
             if (!item.isCanceled) {
                 item.isPaid = true;
             }
         });
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
        const {isShipped, canceledItems, orderItems} = order;
        if (!isShipped) {
            order.isCanceled = true;
            order.canceledAt = Date.now();
            if (canceledItems.length > 0) {
                // const existingCanceledItemsIds = canceledItems.map(function (item) {
                //     return item["productId"]
                // });
                // const itemsToBeCanceled = orderItems.filter(function (item) {
                //     if (!existingCanceledItemsIds.includes(item.productId.toString())) {
                //         return item;
                //     }
                // });
                orderItems.forEach(function (item) {
                    if (!item.isCanceled) {
                        const data = {
                            productId: item.productId,
                            productPrice: item.price,
                            productQuantity: item.quantity,
                            canceledAt: Date.now(),
                        }
                        canceledItems.push(data);
                    }
                    item.isCanceled = true;
                });
            } else {
                orderItems.forEach(function (oItem) {
                    oItem.isCanceled = true;
                    const data = {
                        productId: oItem.productId.toString(),
                        productPrice: oItem.price,
                        productQuantity: oItem.quantity,
                        canceledAt: Date.now(),
                    }
                    canceledItems.push(data);
                });
            }
            order.itemsPrice = 0;
            order.shippingPrice = 0;
            order.taxPrice = 0;
            order.totalPrice = 0;
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
        const { isShipped, isCanceled, orderItems, canceledItems } = order;
        const canceledItem = orderItems.find(function (item) {
            return productId === item.productId.toString();
        });
        orderItems.forEach((item) => {
            if (productId === item.productId.toString()) {
                item.isCanceled = true;
            }
        });
        const newItemsPrice = order.itemsPrice - Number(canceledItem.price * canceledItem.quantity);
        const newTaxPrice = TAX_PERCENTAGE * newItemsPrice;

        if (!isShipped && !isCanceled) {
            if (orderItems.length - 1 === canceledItems.length) {
                order.isCanceled = true;
                order.canceledAt = Date.now();
                order.shippingPrice = 0;
            }
            const data = {
                productId: canceledItem.productId.toString(),
                productPrice: canceledItem.price,
                productQuantity: canceledItem.quantity,
                canceledAt: Date.now(),
            }
            canceledItems.push(data);
            if (!order.freeShipping && newItemsPrice < 100 && !order.isPaid) {
                order.shippingPrice = SHIPPING_PRICE;
            }
            order.itemsPrice = newItemsPrice.toFixed(2);
            order.taxPrice = newTaxPrice.toFixed(2);
            order.totalPrice = (newItemsPrice + newTaxPrice + order.shippingPrice).toFixed(2);

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
    // const {trackingNumber, isShipped, isDelivered, isReimbursed} = req.body;
    if (order) {

        order.trackingNumber = req.body.trackingNumber || order.trackingNumber;
        // const delivered = Boolean(req.body.isDelivered);
        // const reimbursed = Boolean(req.body.isReimbursed);
        if (req.body.isShipped) {
            order.isShipped = req.body.isShipped === "true";
        }
        if (req.body.isDelivered) {
            if (req.body.isDelivered === "true") {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            } else {
                order.isDelivered = false;
            }
        }
        if (req.body.isReimbursed) {
            if (req.body.isReimbursed  === "true") {
                order.isReimbursed = true;
                order.reimbursedAt = Date.now();
                // const canceledItemsThatRequireRefund = order.canceledItems.filter(function (item) {
                //     return item.canceledAt > order.paidAt;
                // });
                const { orderItems, freeShipping } = order;

                const canceledItemsThatRequireRefund = orderItems.filter(function (item) {
                    return item.isPaid && item.isCanceled;
                });
                const totalDollarAmountOfCanceledItemsThatRequireRefund = canceledItemsThatRequireRefund.reduce(function (acc, item) {
                    return (acc + item.price * item.quantity);
                }, 0);

                const itemsOrdered = orderItems.filter(function (item) {
                    return item.isPaid && !item.isCanceled;
                });
                const totalDollarAmountOfItemsOrdered = itemsOrdered.reduce(function (acc, item) {
                    return (acc + item.price * item.quantity);
                }, 0);
                let totalRefundAmountWithTax = totalDollarAmountOfCanceledItemsThatRequireRefund + (totalDollarAmountOfCanceledItemsThatRequireRefund * TAX_PERCENTAGE);

                let numberOfItemsPaid = 0;
                let numberOfItemsPaidAndCanceled = 0;

                for (let i = 0; i < orderItems.length; i++) {
                    if (orderItems[i].isPaid) {
                        numberOfItemsPaid++;
                    }
                    if (orderItems[i].isPaid && orderItems[i].isCanceled) {
                        numberOfItemsPaidAndCanceled++;
                    }
                }
                if (numberOfItemsPaid !== numberOfItemsPaidAndCanceled && !freeShipping && totalDollarAmountOfCanceledItemsThatRequireRefund + totalDollarAmountOfItemsOrdered > 100 && totalDollarAmountOfItemsOrdered < 100) {
                    totalRefundAmountWithTax = totalRefundAmountWithTax - SHIPPING_PRICE;
                }
                if (numberOfItemsPaid === numberOfItemsPaidAndCanceled && !freeShipping && totalDollarAmountOfCanceledItemsThatRequireRefund < 100) {
                    totalRefundAmountWithTax = totalRefundAmountWithTax + SHIPPING_PRICE;
                }
                order.reimbursedAmount = totalRefundAmountWithTax.toFixed(2);
            } else {
                order.isReimbursed = false;
            }
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
    confirmPrices,
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getAllOrders,
    cancelOrder,
    cancelOrderItem,
};



