import React, {useState} from 'react';
import ProfileOrderItemProduct from "./ProfileOrderItemProduct";
import {Link, useNavigate} from "react-router-dom";
import Message from "./Message";
import {useCancelOrderItemMutation, useCancelOrderMutation} from "../slices/ordersApiSlice";
import {FaRegCopy} from "react-icons/fa";


const ProfileOrderItem = ({refetch, order}) => {
    const navigate = useNavigate();
    // const [productId, setProductId] = useState("");

    const [cancelOrder,
        // {error: errorCancelOrder}
    ] = useCancelOrderMutation();
    const [cancelOrderItem,
        // {error: errorCancelOrderItem}
    ] = useCancelOrderItemMutation();
    const [copyMessage, setCopyMessage] = useState("copy to clipboard");

    const cancelOrderItemHandler = async (productId) => {

        if (order.orderItems.length > 1 && order.orderItems.length !== order.canceledItems.length+1 && !order.isCanceled) {
            const confirm = window.confirm("Are you sure you want to cancel this one item? This cannot be undone");
            if (confirm) {
                const data = {
                    orderId: order._id,
                    productId: productId,
                }
                await cancelOrderItem(data);
                refetch();
            }
        } else if (order.orderItems.length > 1 && order.orderItems.length === order.canceledItems.length+1 && !order.isCanceled) {
            const confirm = window.confirm("Are you sure you want to cancel this entire order? This cannot be undone");
            if (confirm) {
                const data = {
                    orderId: order._id,
                    productId: productId,
                }
                await cancelOrderItem(data);
                await cancelOrder(order._id);
                refetch();
            }
        } else if (order.orderItems.length === 1 && !order.isCanceled) {
            const confirm = window.confirm("Are you sure you want to cancel this order? This cannot be undone");
            if (confirm) {
                const data = {
                    orderId: order._id,
                    productId: productId,
                }
                await cancelOrderItem(data);
                await cancelOrder(order._id);
                refetch();
            }
        }
    }


    const copyToClipboard = async () => {
        setCopyMessage("copied!")
        await navigator.clipboard.writeText(order.trackingNumber);
        setTimeout(function () {
            setCopyMessage("copy to clipboard")
        }, 1500)
    }


    return (
        <>
        <div className={"px-3 sm:px-8 lg:px-14 xl:px-24 py-5"}>
            <div className={"rounded-xl bg-base-100 shadow-xl w-full flex flex-col"}>
                <div className={"p-6 rounded-tr-xl rounded-tl-xl flex flex-row bg-neutral-100"}>
                    <div className={"w-full flex justify-between"}>
                        <div className={"flex"}>
                            <div className={"flex flex-col lg:pr-3"}>
                                <span className={"text-xs font-bold"}>
                                    ORDER PLACED
                                </span>
                                <span className={"text-sm"}>
                                    {order.createdAt.substring(0, 10)}
                                </span>
                            </div>
                            <div className={"flex flex-col pl-3 lg:pr-3"}>
                                <span className={"text-xs font-bold"}>
                                    TOTAL
                                </span>
                                <span className={"text-sm"}>
                                    ${order.totalPrice}
                                </span>
                            </div>
                            <div className={"flex flex-col pl-3 lg:pr-3"}>
                                <span className={"text-xs font-bold"}>
                                    SHIP TO
                                </span>
                                <div className="tooltip tooltip-bottom" data-tip={`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`}>
                                    <span className={"cursor-default text-primary text-sm"}>
                                        {order.user.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={"flex flex-col pl-3 lg:pr-3"}>
                            <span className={"hidden md:flex text-xs font-bold text-end"}>
                                ORDER # {order._id}
                            </span>
                            <Link to={`/order/${order._id}`} className={"text-end link link-primary text-sm"}>
                                View order details
                            </Link>
                        </div>
                    </div>
                </div>
        {
            !order.isPaid && (!order.isCanceled || order.orderItems.length !== order.canceledItems.length) && (
                <div className={"pt-3 px-10"}>
                    <div className={"w-full"}>
                        <Message variant={"warning"}>
                            Awaiting payment, please
                            <Link
                                to={`/order/${order._id}`}
                                className={"pl-1 link link-primary"}
                            >
                                pay now.
                            </Link>
                        </Message>
                    </div>
                </div>
            )
        }

        {
            order.orderItems.map(function (product, index) {
                return (
                    <div className={"flex flex-col lg:flex-row"} key={product.productId}>
                        <div className={"w-full lg:w-8/12 flex flex-col"}>
                        {
                            order.isPaid && order.isShipped && order.isDelivered && !order.isCanceled ? (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-2xl text-green-500 font-bold"}>
                                        Delivered
                                    </span>
                                </div>
                            ) : (order.isPaid || !order.isPaid) && (order.canceledItems.some(e => e.productId === product.productId) || order.isCanceled) ? (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-red-500 text-2xl font-bold"}>
                                        Canceled
                                    </span>
                                </div>
                            ) : order.isPaid && !order.isShipped && !order.canceledItems.some(e => e.productId === product.productId) && !order.isCanceled ? (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-2xl font-bold"}>
                                    Processing
                                    </span>
                                </div>
                            ) : order.isPaid && order.isShipped && !order.isCanceled ? (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-2xl font-bold"}>
                                        On the way
                                    </span>
                                </div>
                            ) : (
                                <div className={"py-5 px-5"}>
                                    <span className={"text-2xl font-bold"}>
                                        Awaiting Payment
                                    </span>
                                </div>
                            )
                        }
                            <ProfileOrderItemProduct product={product} index={index} orderSize={order.orderItems.length}/>
                        </div>

                        <div className={`px-4 w-full lg:w-4/12 flex items-start py-5 ${index+1 !== order.orderItems.length && "border-b-[1px] border-gray-300"}`}>

                            <div className={"w-full flex flex-col md:flex-row lg:flex-col"}>


                                <div className={"py-2 px-1 w-full"}>
                                    <div className={`w-full ${order.trackingNumber && order.isShipped && "tooltip tooltip-top"}`} data-tip={copyMessage}>
                                        <button onClick={copyToClipboard} disabled={(!order.isShipped || order.canceledItems.some(e => e.productId === product.productId))} className={"btn h-fit normal-case text-xs btn-sm w-full"}>
                                            <FaRegCopy/>
                                            Tracking Number
                                        </button>
                                    </div>
                                </div>

                                {/*Todo*/}
                                {/*<div className={"py-2 w-full"}>*/}
                                {/*    <button disabled={!order.isDelivered} className={"btn normal-case text-xs btn-sm w-full"}>*/}
                                {/*        Return or replace*/}
                                {/*    </button>*/}
                                {/*</div>*/}

                                <div className={"py-2 px-1 w-full"}>
                                    <button onClick={() => navigate(`/product/${product.productId}?review=true`)} disabled={!order.isDelivered} className={"btn normal-case text-xs btn-sm w-full"}>
                                        Write a product review
                                    </button>
                                </div>

                                {
                                    !order.isShipped && !order.isDelivered && !order.isCanceled && !order.canceledItems.some(e => e.productId === product.productId) && (
                                        <div className={"py-2 px-1 w-full"}>
                                            <button onClick={() => cancelOrderItemHandler(product.productId)} className={"btn normal-case text-xs btn-sm w-full"}>
                                                Cancel Item
                                            </button>
                                        </div>
                                    )
                                }

                            </div>

                        </div>

                    </div>

                )
            })
        }

            </div>
        </div>

        </>
    );
};

export default ProfileOrderItem;