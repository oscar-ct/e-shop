import {useEffect} from 'react';
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {
    useCancelOrderMutation,
    useGetOrderByIdQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
} from "../slices/ordersApiSlice";
import {setLoading} from "../slices/loadingSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {ReactComponent as PayPal} from "../icons/paypal-icon.svg";
import OrderItem from "../components/OrderItem";
import Meta from "../components/Meta";
import ConfirmModal from "../components/ConfirmModal";
import NotFoundPage from "./NotFoundPage";
import {FaCreditCard} from "react-icons/fa";


const OrderPage = () => {

    const dispatch = useDispatch();
    const { id: orderId } = useParams();

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
    const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();
    const {data: order, refetch, isLoading, error} = useGetOrderByIdQuery(orderId);
    const [cancelOrder,
        // {error: errorCancelOrder}
    ] = useCancelOrderMutation();
    const [payOrder,
        // {isLoading: loadingPay}
    ] = usePayOrderMutation();

    const totalNumberOfItems = order?.orderItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);
    const totalNumberOfCanceledItems = order && order?.canceledItems.length > 0 ? order.canceledItems.reduce(function (acc, item) {
        return (acc + item.productQuantity);
    }, 0) : 0;
    const canceledItemsThatRequireRefund = order?.canceledItems.filter(function (item) {
        return item.canceledAt > order.paidAt;
    });
    const totalNumberOfCanceledItemsThatRequireRefund = order && canceledItemsThatRequireRefund.length > 0 ? canceledItemsThatRequireRefund.reduce(function (acc, item) {
        return (acc + item.productQuantity);
    }, 0) : 0;
    const totalDollarAmountOfCanceledItemsThatRequireRefund = order && canceledItemsThatRequireRefund.length > 0 ? canceledItemsThatRequireRefund.reduce(function (acc, item) {
        return (acc + item.productPrice * item.productQuantity);
    }, 0) : 0;
    const totalDollarAmountOfShippingRefund = order && canceledItemsThatRequireRefund.length > 0 && (order.freeShipping || totalDollarAmountOfCanceledItemsThatRequireRefund > 100) ? 0 : 10;
    const orderItemsPaidAndNotCanceled = order?.orderItems.filter((item) => !item.isCanceled && item.isPaid);
    const totalDollarAmountOfOrderItemsPaidAndNotCanceled = orderItemsPaidAndNotCanceled?.reduce((acc, item) => {
        return (acc + item.price * item.quantity);
    }, 0);
    const totalDollarAmountOfFees =
        order && order?.canceledItems.length > 0 && !order.freeShipping && (totalDollarAmountOfCanceledItemsThatRequireRefund + totalDollarAmountOfOrderItemsPaidAndNotCanceled < 100) ? 0 : 10;
    const TAX_PERCENTAGE = 0.0825;

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
        // toast.error(error);
    }
    const onApprove = (data, actions) => {
        dispatch(setLoading(true));
        return actions.order.capture().then(async function (details) {
            try {
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
        }).then((orderId) => {
            return orderId
        });
    }
    const submitCancel = async () => {
        await cancelOrder(order._id);
        refetch();
    }

    // const booleanOrderHasCanceledItems = () => {
    //     let bool = false;
    //     order?.orderItems.forEach(function (item) {
    //         if (order.canceledItems.some(e => e.productId === item.productId)) {
    //             bool = true;
    //         }
    //     });
    //
    //     return bool;
    // }

    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <NotFoundPage/>
                    // <div className={"pt-10 px-2"}>
                    //     <BackButton/>
                    //     <Message variant={"error"}>
                    //         {error?.data?.message || error.error}
                    //     </Message>
                    // </div>
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
                                ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) && order.isPaid && !order.isShipped && !order.isDelivered && !order.isReimbursed ? (
                                    <h1 className={"text-4xl font-bold"}>
                                        Your order has been canceled and your refund process has begun.
                                    </h1>
                                ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) && order.isPaid && !order.isShipped && !order.isDelivered && order.isReimbursed ? (
                                    <h1 className={"text-4xl font-bold"}>
                                        Your order has been canceled and your refund has been issued.
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
                        <div className={"md:pb-10 lg:pt-5 flex-col flex lg:flex-row w-full"}>
                            <div className={"lg:w-7/12 bg-white border h-min p-4 sm:p-7"}>
                                <div className={"pb-7"}>
                                    <h1 className={"text-2xl font-semibold text-center"}>
                                        Order # {order._id}
                                    </h1>
                                </div>
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Ship To:
                                        </h3>
                                    </div>
                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                        <div className={"flex flex-col text-sm"}>
                                            <span>{order.user.name}</span>
                                            <span>{order.shippingAddress.address}</span>
                                            <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</span>
                                            <span>{order.shippingAddress.country}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={"flex border-b-[1px] border-gray-300 py-5"}>
                                    <div className={"w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Payment Method:
                                        </h3>
                                    </div>
                                    <div className={"w-7/12 lg:w-8/12"}>
                                        <div className={"flex items-center text-sm"}>
                                            <div>
                                                {
                                                    order.paymentMethod === "PayPal / Credit Card" ? (
                                                        <PayPal width={"22"} height={"26"}/>
                                                    ) : (
                                                        <FaCreditCard className={"text-2xl"}/>
                                                    )
                                                }
                                            </div>
                                            <span className={"pl-2"}>
                                                {order.paymentMethod}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-start"}>
                                        <h3 className={"font-semibold pr-2"}>
                                            Order Position:
                                        </h3>
                                    </div>

                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                        {/*ORDER STATUS*/}
                                        <div className={"flex flex-col text-sm pb-3"}>
                                        {
                                            order.isPaid && !order.isShipped && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                                <Message variant={"info"}>
                                                   <span className={"text-start"}>Processing order</span>
                                                </Message>
                                            ) : order.isPaid && order.isShipped && order.isDelivered && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                                <Message variant={"success"}>
                                                    <div className={"flex"}>
                                                        <span className={"text-start truncate"}>Delivered on</span>
                                                        <span className={"font-bold pl-1"}>{order.deliveredAt.substring(0, 10)}</span>
                                                    </div>
                                                </Message>
                                            ) : order.isPaid && order.isShipped && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                                <Message variant={"info"}>
                                                    <div className={"flex flex-col"}>
                                                        <span className={"text-start"}>Shipped</span>
                                                    </div>
                                                </Message>
                                            ) : order.isCanceled || order.orderItems.length === order.canceledItems?.length ? (
                                                    <Message variant={"error"}>
                                                        <div className={"flex"}>
                                                            <span className={"text-start"}>Canceled on</span>
                                                            <span className={"font-bold pl-1"}>{order.canceledAt.substring(0, 10)}</span>
                                                        </div>
                                                    </Message>
                                            ) : (
                                                <Message variant={"warning"}>
                                                    <span className={"text-start"}>Order is awaiting payment, please pay now.</span>
                                                </Message>
                                            )
                                        }
                                        </div>
                                        {/*ORDER STATUS*/}

                                        {/*PAYMENT STATUS*/}
                                        <div className={"flex items-center text-sm pb-3"}>
                                            {
                                                order.isPaid ? (
                                                    <Message variant={"success"}>
                                                        <div className={"flex flex-wrap items-center"}>
                                                            <span className={"pr-1"}>Paid</span>
                                                            <span className={"pr-1 font-bold"}>${order.paidAmount.toFixed(2)}</span>
                                                            <span className={"pr-1"}>on </span>
                                                            <span className={"font-bold"}>{order.paidAt.substring(0, 10)}</span>
                                                        </div>
                                                    </Message>
                                                ) : (
                                                    <Message variant={"error"}>
                                                        <span className={"text-start"}>Not Paid</span>
                                                    </Message>
                                                )
                                            }
                                        </div>
                                        {/*PAYMENT STATUS*/}


                                        {/*REFUND STATUS*/}
                                        {
                                            // (order.isCanceled || (order.orderItems.length === order.canceledItems?.length || booleanOrderHasCanceledItems())) && order.isPaid &&
                                            order.isPaid && (totalNumberOfCanceledItemsThatRequireRefund > 0) && (order.isCanceled || order.canceledItems.length > 0) &&
                                            (
                                                <div className={"flex items-center text-sm"}>
                                                    {
                                                        order.isReimbursed ? (
                                                            <Message variant={"success"}>
                                                                <div className={"flex flex-wrap items-center"}>
                                                                    <span className={"pr-1"}>Refunded</span>
                                                                    <span className={"font-bold pr-1"}>${order.reimbursedAmount.toFixed(2)}</span>
                                                                    <span className={"pr-1"}>on </span>
                                                                    <span className={"font-bold"}>{order.reimbursedAt.substring(0, 10)}</span>
                                                                </div>
                                                            </Message>
                                                        ) : (
                                                            <Message variant={"info"}>
                                                                <span className={"text-start"}>Processing refund</span>
                                                            </Message>
                                                        )
                                                    }
                                                </div>

                                            )
                                        }
                                        {/*REFUND STATUS*/}
                                    </div>
                                </div>
                                {
                                    order.isShipped && (
                                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                            <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                                <h3 className={"font-semibold pr-2"}>
                                                    Tracking Number:
                                                </h3>
                                            </div>
                                            <div className={"w-9/12 sm:w-7/12 lg:w-8/12 flex items-center"}>
                                                <span className={"text-sm"}>{order.trackingNumber}</span>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className={"py-3"}>
                                    <h3 className={"font-semibold"}>
                                        Order Item(s):
                                    </h3>
                                    <div>
                                    {
                                        order.orderItems.map(function (item) {
                                            return (
                                                <OrderItem canceledItems={order.canceledItems} item={item} isCanceled={order.isCanceled} paidAt={order.paidAt} key={item.productId}/>
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            </div>
                            <div className={"px-3 pb-5 lg:pl-10 lg:w-5/12"}>
                            {
                                !order.isShipped && !order.isDelivered && !order.isCanceled && order.canceledItems.length !== order.orderItems.length ? (
                                    <div className={"w-full pt-5 lg:pt-0 pb-5"}>
                                        <button onClick={() => window.confirm_modal.showModal()}
                                                className={"btn text-xs btn-neutral btn-sm w-full rounded-xl"}
                                        >
                                            Cancel Order
                                        </button>
                                    </div>
                                ) : (order.isCanceled || totalNumberOfCanceledItemsThatRequireRefund > 0) && order.isPaid && !order.isReimbursed ? (
                                        <h5 className={"text-center py-5"}>
                                            Refunds can take up 5-7 business to process.
                                        </h5>
                                ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) || order.isDelivered  ? (
                                        ""
                                ) : (
                                    <h5 className={"text-center py-5"}>
                                        This order has shipped and can no longer be canceled.
                                    </h5>
                                )
                            }
                                <div className={"flex flex-col"}>
                                    {
                                        totalNumberOfItems - totalNumberOfCanceledItems !== 0 && (
                                            <div className="bg-white border">
                                                <div className="pt-8 px-8">
                                                    <div className={"flex flex-col"}>
                                                        <h3 className={"text-xl font-bold"}>
                                                            Order Summary
                                                        </h3>
                                                        <div className={"border-b-[1px] border-gray-300 mt-5 mb-3"}/>
                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                            <span>Items ({totalNumberOfItems - totalNumberOfCanceledItems}):</span>
                                                            <span className="pl-2">${(order.itemsPrice).toFixed(2)}</span>
                                                        </div>
                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                            <span>Shipping & handling:</span>
                                                            <span className="pl-2">${(order.shippingPrice).toFixed(2)}</span>
                                                        </div>
                                                        <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                            <span>Total before tax:</span>
                                                            <span className="pl-2">${(order.itemsPrice + order.shippingPrice).toFixed(2)}</span>
                                                        </div>
                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                            <span>Estimated tax to be collected:</span>
                                                            <span className="pl-2">${(order.taxPrice).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"flex justify-between font-bold rounded-bl-xl rounded-br-xl text-lg px-8 pt-6 pb-8"}>
                                                    <span className="text-red-600">Order Total:</span>
                                                    <span className="text-red-600">${(order.taxPrice + order.shippingPrice + order.itemsPrice).toFixed(2)}</span>
                                                </div>
                                                {
                                                    !order.isPaid && (!order.isCanceled || order.orderItems.length !== order.canceledItems.length) && (
                                                        <div className={"flex font-bold rounded-bl-xl rounded-br-xl text-xl px-8 pb-5"}>
                                                            {
                                                                !isPending && (
                                                                    <div className={"w-full"}>
                                                                        <div className={"border-t-[1px] border-gray-300 pb-8"}/>
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
                                        )
                                    }
                                    {
                                        order.isPaid && (totalNumberOfCanceledItemsThatRequireRefund > 0) && (order.isCanceled || order.canceledItems.length > 0) && (

                                            <div className={`${totalNumberOfCanceledItemsThatRequireRefund === orderItemsPaidAndNotCanceled.length && "mt-5"} bg-white border`}>
                                                <div className="pt-8 px-8">
                                                    <div className={"flex flex-col"}>
                                                        <h3 className={"text-xl font-bold"}>
                                                            Refund Summary
                                                        </h3>
                                                        <div className={"border-b-[1px] border-gray-300 mt-5 mb-3"}/>
                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                            <span>Items ({totalNumberOfCanceledItemsThatRequireRefund}):</span>
                                                            <span className="pl-2">${totalDollarAmountOfCanceledItemsThatRequireRefund.toFixed(2)}</span>
                                                        </div>
                                                        {
                                                            order.isCanceled && (
                                                                <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                                    <span>Shipping & handling:</span>
                                                                    <span className="pl-2">${totalDollarAmountOfShippingRefund.toFixed(2)}</span>
                                                                </div>
                                                            )
                                                        }
                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                            <span>Tax collected:</span>
                                                            <span className="pl-2">${(TAX_PERCENTAGE * totalDollarAmountOfCanceledItemsThatRequireRefund).toFixed(2)}</span>
                                                        </div>
                                                        {
                                                            !order.isCanceled && (
                                                                <>
                                                                    <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                                                    <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                                        <span>Refund subtotal:</span>
                                                                        <span className="pl-2">$
                                                                            {
                                                                                (totalDollarAmountOfCanceledItemsThatRequireRefund + (TAX_PERCENTAGE * totalDollarAmountOfCanceledItemsThatRequireRefund)).toFixed(2)
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                                        <span>Shipping Fee:</span>
                                                                        <span className="pl-2">- ${totalDollarAmountOfFees.toFixed(2)}</span>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                        <div className={"flex justify-between font-bold rounded-bl-xl rounded-br-xl text-lg pt-6 pb-8"}>
                                                            <span className="text-green-500">Total Estimated Refund:</span>
                                                            <span className="text-green-500">$
                                                            {
                                                                order.isCanceled ?
                                                                    (totalDollarAmountOfShippingRefund + totalDollarAmountOfCanceledItemsThatRequireRefund + (totalDollarAmountOfCanceledItemsThatRequireRefund * TAX_PERCENTAGE)).toFixed(2)
                                                                    :
                                                                    (totalDollarAmountOfCanceledItemsThatRequireRefund + (totalDollarAmountOfCanceledItemsThatRequireRefund * TAX_PERCENTAGE) - totalDollarAmountOfFees).toFixed(2)
                                                            }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <ConfirmModal title={"Are you sure you want to cancel this entire order? This cannot be undone."} initiateFunction={submitCancel}/>
                    </>
                )
            }
        </>
    );
};

export default OrderPage;