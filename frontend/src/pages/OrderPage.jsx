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
// import {FaCreditCard} from "react-icons/fa";
import OrderItem from "../components/OrderItem";
import BackButton from "../components/BackButton";
import Meta from "../components/Meta";
import ConfirmModal from "../components/ConfirmModal";
import {toast} from "react-hot-toast";


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

    const totalDollarAmountOfShippingRefund = order && canceledItemsThatRequireRefund.length > 0 && (order.freeShipping || totalDollarAmountOfCanceledItemsThatRequireRefund > 100) ? 0 : 10

    const totalDollarAmountOfFees = order && order?.canceledItems.length > 0 && (order.freeShipping || (totalDollarAmountOfCanceledItemsThatRequireRefund + order.itemsPrice > 100 && order.itemsPrice > 100)) ? 0 : 10;



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
        // console.log(error);
        toast.error(error);
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
                            <div className={"lg:w-7/12 card bg-white shadow-xl h-min p-4 sm:p-7"}>
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
                                        <span>
                                            {order.user.name}
                                        </span>
                                            <span>
                                            {order.shippingAddress.address}
                                        </span>
                                            <span>
                                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                        </span>
                                            <span>
                                            {order.shippingAddress.country}
                                        </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold pr-2"}>
                                            Order Status:
                                        </h3>
                                    </div>
                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                        <div className={"flex flex-col text-sm"}>
                                            {
                                                order.isPaid && !order.isShipped && !order.isCanceled && order.orderItems.length !== order.canceledItems?.length ? (
                                                    <Message variant={"info"}>
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
                                                                Shipped
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
                                            <div className={"w-3/12 sm:w-5/12 lg:w-4/12"}>
                                                <h3 className={"font-semibold pr-2"}>
                                                    Tracking Number:
                                                </h3>
                                            </div>
                                            <div className={"w-9/12 sm:w-7/12 lg:w-8/12 flex items-center"}>
                                                <span className={"text-sm"}>
                                                    {order.trackingNumber}
                                                </span>
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
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold pr-2"}>
                                            Payment Status:
                                        </h3>
                                    </div>
                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                        <div className={"flex items-center text-sm"}>
                                            {
                                                order.isPaid ? (
                                                    <Message variant={"success"}>
                                                        <div className={"flex flex-wrap items-center"}>
                                                            <span className={"pr-1"}>
                                                                Paid
                                                            </span>
                                                            <span className={"pr-1 font-bold"}>
                                                                ${order.paidAmount.toFixed(2)}
                                                            </span>
                                                            <span className={"pr-1"}>
                                                                on {order.paidAt.substring(0, 10)}
                                                            </span>
                                                            <span className={"flex items-center"}>with
                                                                <span className={"px-1 font-bold"}>{order.paymentMethod}</span>
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
                                    // (order.isCanceled || (order.orderItems.length === order.canceledItems?.length || booleanOrderHasCanceledItems())) && order.isPaid &&
                                    order.isPaid && (totalNumberOfCanceledItemsThatRequireRefund > 0) && (order.isCanceled || order.canceledItems.length > 0) &&
                                    (
                                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                            <div className={"w-3/12 sm:w-5/12 lg:w-4/12"}>
                                                <h3 className={"font-semibold pr-2"}>
                                                    Refund Status:
                                                </h3>
                                            </div>
                                            <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                                <div className={"flex items-center text-sm"}>
                                                    {
                                                        order.isReimbursed ? (
                                                            <Message variant={"success"}>
                                                                <div className={"flex flex-wrap items-center"}>
                                                                    <span className={"pr-1"}>
                                                                        Refunded
                                                                    </span>
                                                                    <span className={"font-bold pr-1"}>
                                                                        ${order.reimbursedAmount.toFixed(2)}
                                                                    </span>
                                                                    <span className={"pr-1"}>
                                                                        on {order.reimbursedAt.substring(0, 10)}
                                                                    </span>
                                                                    <span className={"font-semibold flex items-center"}>
                                                                        <span className={"pr-1"}>with {order.paymentMethod}</span>
                                                                        <PayPal className={"pt-[2px]"} width={"16"} height={"24"}/>
                                                                    </span>
                                                                </div>
                                                            </Message>
                                                        ) : (
                                                            <Message variant={"info"}>
                                                                <span className={"text-start"}>
                                                                   Refund In Progress
                                                                </span>
                                                            </Message>
                                                        )
                                                    }
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
                                                    <OrderItem canceledItems={order.canceledItems} item={item} isCanceled={order.isCanceled} paidAt={order.paidAt} key={item.productId}/>
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
                                        <button onClick={() => window.confirm_modal.showModal()}
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
                                ) : (order.isCanceled || order.canceledItems?.length > 0) && order.isPaid && !order.isReimbursed ? (
                                        <h5 className={"text-center pb-5"}>
                                            Refunds can take up 5-7 business to process.
                                        </h5>
                                ) : (order.isCanceled || order.canceledItems?.length > 0) && (!order.isPaid || order.isReimbursed)  ? (
                                        ""
                                ) : (
                                    <h5 className={"text-center pb-5"}>
                                        This order cannot be canceled.
                                    </h5>
                                )
                            }


                                <div className={"flex flex-col"}>
                                    {
                                        totalNumberOfItems - totalNumberOfCanceledItems !== 0 && (
                                            <div className="card bg-white shadow-xl">
                                                <div className="pt-8 px-8">
                                                    <div className={"flex flex-col"}>
                                                        <h3 className={"text-xl font-bold"}>
                                                            Order Summary
                                                        </h3>
                                                        <div className={"border-b-[1px] border-gray-300 mt-5 mb-3"}/>
                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                    <span className="">
                                                        Items ({totalNumberOfItems - totalNumberOfCanceledItems}):
                                                    </span>
                                                            <span className="pl-2">
                                                        ${(order.itemsPrice).toFixed(2)}
                                                    </span>
                                                        </div>
                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                    <span className="">
                                                        Shipping & handling:
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
                                                    className={"flex justify-between font-bold rounded-bl-xl rounded-br-xl text-lg px-8 pt-6 pb-8"}>
                                             <span className="text-red-600">
                                                Order Total:
                                            </span>
                                                    <span className="text-red-600">
                                            ${(order.taxPrice + order.shippingPrice + order.itemsPrice).toFixed(2)}
                                            </span>
                                                </div>
                                                {
                                                    !order.isPaid && (!order.isCanceled || order.orderItems.length !== order.canceledItems.length) && (
                                                        <div className={"flex font-bold rounded-bl-xl rounded-br-xl text-xl px-12 pb-5"}>
                                                            {
                                                                !isPending && (
                                                                    <div className={"w-full"}>
                                                                        <div>
                                                                            <p className={"text-xs font-normal px-3 pb-5 italic"}>
                                                                                *Please note payment data you enter using PayPal Services does not get seen or saved by e-shop-us.com
                                                                            </p>
                                                                        </div>
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
                                            <div className="pt-5">
                                                <div className={"card bg-white shadow-xl"}>
                                                    <div className="pt-8 px-8">
                                                        <div className={"flex flex-col"}>
                                                            <h3 className={"text-xl font-bold"}>
                                                                Refund Summary
                                                            </h3>
                                                            <div className={"border-b-[1px] border-gray-300 mt-5 mb-3"}/>
                                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                                <span className="">
                                                                    Items ({totalNumberOfCanceledItemsThatRequireRefund}):
                                                                </span>
                                                                <span className="pl-2">
                                                                    ${totalDollarAmountOfCanceledItemsThatRequireRefund.toFixed(2)}
                                                                </span>
                                                            </div>
                                                            {
                                                                order.isCanceled && (
                                                                    <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                                        <span className="">
                                                                            Shipping & handling:
                                                                        </span>
                                                                        <span className="pl-2">
                                                                            ${totalDollarAmountOfShippingRefund.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            }
                                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                                <span className="">
                                                                    Tax collected:
                                                                </span>
                                                                <span className="pl-2">
                                                                    ${(0.0825 * totalDollarAmountOfCanceledItemsThatRequireRefund).toFixed(2)}
                                                                </span>
                                                            </div>
                                                            {
                                                                !order.isCanceled && (
                                                                    <>
                                                                        <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                                            <span className="">
                                                                                Refund subtotal:
                                                                            </span>
                                                                            <span className="pl-2">$
                                                                                {
                                                                                    order.isCanceled ? (totalDollarAmountOfShippingRefund + totalDollarAmountOfCanceledItemsThatRequireRefund + (0.0825 * totalDollarAmountOfCanceledItemsThatRequireRefund)).toFixed(2) : (totalDollarAmountOfCanceledItemsThatRequireRefund + (0.0825 * totalDollarAmountOfCanceledItemsThatRequireRefund)).toFixed(2)
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                                            <span className="">
                                                                                Shipping Fee:
                                                                            </span>
                                                                            <span className="pl-2">
                                                                                - ${totalDollarAmountOfFees.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                )
                                                            }

                                                            <div
                                                                className={"flex justify-between font-bold rounded-bl-xl rounded-br-xl text-lg pt-6 pb-8"}>
                                                                     <span className="text-green-500">
                                                                        Total Estimated Refund:
                                                                    </span>
                                                                    <span className="text-green-500">$
                                                                    {
                                                                        order.isCanceled ?
                                                                            (totalDollarAmountOfShippingRefund + totalDollarAmountOfCanceledItemsThatRequireRefund + (totalDollarAmountOfCanceledItemsThatRequireRefund * 0.0825)).toFixed(2)
                                                                            :
                                                                            (totalDollarAmountOfCanceledItemsThatRequireRefund + (totalDollarAmountOfCanceledItemsThatRequireRefund * 0.0825) - totalDollarAmountOfFees).toFixed(2)
                                                                    }
                                                                    </span>
                                                            </div>
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