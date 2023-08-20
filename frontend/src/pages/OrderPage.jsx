import {useEffect} from 'react';
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {
    useCancelOrderItemMutation,
    useCancelOrderMutation,
    useGetOrderByIdQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
} from "../slices/ordersApiSlice";
import {setLoading} from "../slices/loadingSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {ReactComponent as PayPal} from "../icons/paypal-icon.svg";
// import {FaCreditCard} from "react-icons/fa";
import OrderItem from "../components/OrderItem";
import BackButton from "../components/BackButton";
import Meta from "../components/Meta";


const OrderPage = () => {

    const dispatch = useDispatch();
    const { id: orderId } = useParams();
    const [payOrder,
        // {isLoading: loadingPay}
    ] = usePayOrderMutation();
    const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();
    const {data: order, refetch, isLoading, error} = useGetOrderByIdQuery(orderId);
    const [cancelOrder,
        // {error: errorCancelOrder}
    ] = useCancelOrderMutation();
    const [cancelOrderItem] = useCancelOrderItemMutation();

    const totalNumberOfItems = order?.orderItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    useEffect(function () {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD"
                    }
                });
                paypalDispatch({type: "setLoadingStatus", value: "pending"});
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);
    
    // const onApproveTest = async  () => {
    //     dispatch(setLoading(true));
    //     await payOrder({orderId, details: { payer: {} }});
    //     refetch();
    //     dispatch(setLoading(false));
    // }
    const onError = (error) => {
        console.log(error);
    }
    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch(setLoading(true));
                await payOrder({orderId, details});
                refetch();
                dispatch(setLoading(false));
            } catch (e) {
                console.log(e)
                dispatch(setLoading(false));
            }
        });
    }
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: (order.totalPrice).toFixed(2),
                    }
                }
            ]
        }).then(function (orderId) {
            return orderId;
        });
    }
    
    const cancelOrderHandler = async () => {
        const confirm = window.confirm("Are you sure you want to cancel this entire order? This cannot be undone");
        if (confirm) {
            await Promise.all(order.orderItems.map(async function (item) {
                const canceledItem = {
                    orderId: order._id,
                    productId: item.productId,
                }
                await cancelOrderItem(canceledItem);
            }))

            await cancelOrder(order._id);
            refetch();
        }
    }

    const booleanOrderHasCanceledItems = () => {
        let bool = false;
        order?.orderItems.forEach(function (item) {
            if (order.canceledItems.some(e => e.productId === item.productId)) {
                bool = true;
            }
        });

        return bool;
    }

    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <div className={"pt-10 px-2"}>
                        <BackButton/>
                        <Message variant={"error"} children={error?.data?.message || error.error}/>
                    </div>
                ) : (
                    <>
                        <Meta title={`Order # ${order._id}`}/>
                        <div className={"p-5 lg:pt-10 lg:pb-5"}>
                            {
                                order.isPaid && !order.isShipped && !order.isDelivered && !order.isCanceled && order.canceledItems.length !== order.orderItems.length ? (
                                    <h1 className={"text-4xl font-bold"}>
                                        Payment successful! Order is now being processed.
                                    </h1>
                                ) : order.isPaid && order.isShipped && !order.isDelivered ? (
                                    <h1 className={"text-4xl font-bold"}>
                                        Your order is on the way.
                                    </h1>
                                ) : order.isPaid && order.isShipped && order.isDelivered ? (
                                    <h1 className={"text-4xl font-bold "}>
                                        Your order has been delivered, thank you!
                                    </h1>
                                ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) && order.isPaid && !order.isShipped && !order.isDelivered ? (
                                    <h1 className={"text-4xl font-bold"}>
                                        Your order has been canceled and your refund process has begun.
                                    </h1>
                                ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) && !order.isShipped && !order.isDelivered ? (
                                    <h1 className={"text-4xl font-bold"}>
                                        Your order has been canceled.
                                    </h1>
                                ) : (
                                    <h1 className={"text-4xl font-bold"}>
                                        Please pay order below to begin shipment process.
                                    </h1>
                                )
                            }

                        </div>
                        <div className={"mb-10 lg:pt-5 flex-col flex lg:flex-row w-full"}>
                            <div className={"lg:w-7/12 card bg-white shadow-xl h-min p-4 sm:p-7"}>
                                <div className={"pb-7"}>
                                    <h1 className={"text-2xl font-semibold text-center"}>
                                        Order # {order._id}
                                    </h1>
                                </div>
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Ship To:
                                        </h3>
                                    </div>
                                    <div className={"w-7/12 lg:w-8/12"}>
                                        <div className={"flex flex-col text-sm"}>
                                        <span>
                                            {order.user.name}
                                        </span>
                                            <span>
                                            {order.shippingAddress.address}
                                        </span>
                                            <span>
                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                        </span>
                                            <span>
                                            {order.shippingAddress.country}
                                        </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Order Status:
                                        </h3>
                                    </div>
                                    <div className={"w-7/12 lg:w-8/12"}>
                                        <div className={"flex flex-col text-sm"}>
                                            {
                                                order.isPaid && !order.isShipped && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                                    <Message>
                                                       <span className={"text-start"}>
                                                            Order is being processed
                                                       </span>
                                                    </Message>
                                                ) : order.isPaid && order.isShipped && order.isDelivered && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                                    <Message variant={"success"}>
                                                        <div className={"flex flex-col"}>
                                                            <span className={"text-start truncate"}>
                                                                Delivered on {order.deliveredAt.substring(0, 10)}
                                                            </span>
                                                        </div>
                                                    </Message>
                                                ) : order.isPaid && order.isShipped && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                                    <Message variant={"info"}>
                                                        <div className={"flex flex-col"}>
                                                            <span className={"text-start"}>
                                                                Shipped with USPS
                                                            </span>
                                                        </div>
                                                    </Message>
                                                ) : order.isCanceled || order.orderItems.length === order.canceledItems?.length ? (
                                                        <Message variant={"error"}>
                                                            <span className={"text-start"}>
                                                                Order Canceled
                                                            </span>
                                                        </Message>
                                                ) : (
                                                    <Message variant={"warning"}>
                                                        <span className={"text-start"}>
                                                        Order is awaiting payment, please pay now.
                                                        </span>
                                                    </Message>
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>

                                {
                                    order.isShipped && (
                                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                            <div className={"w-5/12 lg:w-4/12"}>
                                                <h3 className={"font-semibold"}>
                                                    Tracking Number:
                                                </h3>
                                            </div>
                                            <div className={"w-7/12 lg:w-8/12"}>
                                                <div className={"flex items-center text-sm"}>
                                                    <span>
                                                        {order.trackingNumber}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                {/*<div className={"flex border-b-[1px] border-gray-300 py-3"}>*/}
                                {/*    <div className={"w-5/12 lg:w-4/12"}>*/}
                                {/*        <h3 className={"font-semibold"}>*/}
                                {/*            Payment Method:*/}
                                {/*        </h3>*/}
                                {/*    </div>*/}
                                {/*    <div className={"w-7/12 lg:w-8/12"}>*/}
                                {/*        <div className={"flex items-center text-sm"}>*/}
                                {/*            <div>*/}
                                {/*                {*/}
                                {/*                    order.paymentMethod === "PayPal" ? (*/}
                                {/*                        <PayPal className={"w-6"}/>*/}
                                {/*                    ) : (*/}
                                {/*                        <FaCreditCard className={"text-2xl"}/>*/}
                                {/*                    )*/}
                                {/*                }*/}

                                {/*            </div>*/}
                                {/*            <span className={"pl-2"}>*/}
                                {/*            {order.paymentMethod === "PayPal" ? "PayPal" : "Credit Card"}*/}
                                {/*        </span>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Payment Status:
                                        </h3>
                                    </div>
                                    <div className={"w-7/12 lg:w-8/12"}>
                                        <div className={"flex items-center text-sm"}>
                                            {
                                                order.isPaid ? (
                                                    <Message variant={"success"}>
                                                        <div className={"flex items-center"}>
                                                            <span className={"flex flex-wrap text-start pr-1"}>
                                                                <span className={"pr-1"}>
                                                                Paid on {order.paidAt.substring(0, 10)} with</span><span className={"pr-1 font-semibold"}>{order.paymentMethod}</span>
                                                                  <PayPal className={"pt-[2px]"} width={"16"} height={"24"}/>
                                                            </span>
                                                        </div>
                                                    </Message>
                                                ) : (
                                                    <Message variant={"error"}>
                                                        <span className={"text-start"}>
                                                            Not Paid
                                                        </span>
                                                    </Message>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>



                                {
                                    (order.isCanceled || (order.orderItems.length === order.canceledItems?.length || booleanOrderHasCanceledItems())) && order.isPaid && (
                                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                            <div className={"w-5/12 lg:w-4/12"}>
                                                <h3 className={"font-semibold"}>
                                                    Refund Status:
                                                </h3>
                                            </div>
                                            <div className={"w-7/12 lg:w-8/12"}>
                                                <div className={"flex items-center text-sm"}>
                                                    <Message>
                                                        <span className={"text-start"}>
                                                           Refund In Progress
                                                        </span>
                                                    </Message>
                                                </div>
                                            </div>
                                        </div>
                                    )

                                }



                                <div className={"py-3"}>
                                    <h3 className={"font-semibold"}>
                                        Order Items:
                                    </h3>
                                    <div>
                                        {
                                            order.orderItems.map(function (item) {
                                                return (
                                                    <OrderItem canceledItems={order.canceledItems} item={item} isCanceled={order.isCanceled} key={item.productId}/>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className={"p-3 lg:pl-10 lg:w-5/12"}>

                            {
                                !order.isShipped && !order.isDelivered && !order.isCanceled && order.canceledItems.length !== order.orderItems.length ? (
                                    <div className={"w-full pt-5 lg:pt-0 pb-5"}>
                                        <button onClick={() => cancelOrderHandler(order._id)}
                                                className={"btn text-xs btn-neutral btn-sm w-full rounded-xl"}>
                                            Cancel Order
                                        </button>
                                        {/*{*/}
                                        {/*    order.isPaid && (*/}
                                        {/*        <h5 className={"text-center pt-5"}>*/}
                                        {/*            Refunds can take up 5-7 business to process.*/}
                                        {/*        </h5>*/}
                                        {/*    )*/}
                                        {/*}*/}

                                    </div>
                                ) : (order.isCanceled || order.canceledItems?.length > 0) && order.isPaid ? (
                                        <h5 className={"text-center pb-5"}>
                                            Refunds can take up 5-7 business to process.
                                        </h5>
                                ) : (order.isCanceled || order.canceledItems?.length > 0) && !order.isPaid ? (
                                        ""
                                ) : (
                                    <h5 className={"text-center pb-5"}>
                                        This order cannot be canceled.
                                    </h5>
                                )
                            }


                                <div>
                                    <div className="card bg-white shadow-xl">
                                        <div className="pt-8 px-8">
                                            <div className={"flex flex-col"}>
                                                <h3 className={"text-xl font-bold"}>
                                                    Order Summary
                                                </h3>
                                                <div className={"border-b-[1px] border-gray-300 mt-5 mb-3"}/>
                                                <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                    <span className="">
                                                        Items ({totalNumberOfItems}):
                                                    </span>
                                                    <span className="pl-2">
                                                        ${(order.itemsPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                    <span className="">
                                                        Shipping & Handling:
                                                    </span>
                                                    <span className="pl-2">
                                                        ${(order.shippingPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                                <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                                <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                    <span className="">
                                                        Total before tax:
                                                    </span>
                                                    <span className="pl-2">
                                                        ${(order.itemsPrice + order.shippingPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                    <span className="">
                                                        Estimated tax to be collected:
                                                    </span>
                                                    <span className="pl-2">
                                                        ${(order.taxPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                                {/*<span className={"my-3 border-b-2 border-grey-500"}>*/}
                                                {/*</span>*/}
                                            </div>
                                        </div>
                                        <div
                                            className={"flex justify-between font-bold rounded-bl-xl rounded-br-xl text-xl px-8 py-6"}>
                                             <span className="text-red-600">
                                                Order Total:
                                            </span>
                                            <span className="text-red-600">
                                            ${(order.taxPrice + order.shippingPrice + order.itemsPrice).toFixed(2)}
                                            </span>
                                        </div>
                                        {
                                           !order.isPaid && (!order.isCanceled || order.orderItems.length !== order.canceledItems.length) && (
                                                <div className={"flex font-bold rounded-bl-xl rounded-br-xl text-xl px-12 py-5"}>
                                                    {
                                                        !isPending && (
                                                            <div className={"w-full"}>
                                                                <PayPalButtons
                                                                    createOrder={createOrder}
                                                                    onApprove={onApprove}
                                                                    onError={onError}
                                                                >
                                                                </PayPalButtons>
                                                                {/*<button*/}
                                                                {/*    onClick={onApproveTest}*/}
                                                                {/*    className={"btn btn-xs"}*/}
                                                                {/*>*/}
                                                                {/*    Pay*/}
                                                                {/*</button>*/}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                )
            }
        </>
    );
};

export default OrderPage;