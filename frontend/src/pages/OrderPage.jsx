import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {
    useCancelOrderMutation,
    useGetOrderByIdQuery,
} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {ReactComponent as StripeLogo} from "../icons/stripe-logo.svg";
import OrderItem from "../components/OrderItem";
import Meta from "../components/Meta";
import ConfirmModal from "../components/ConfirmModal";
import NotFoundPage from "./NotFoundPage";
import {clearCartItems} from "../slices/cartSlice";
import PaypalCheckout from "../components/PaypalCheckout";
import StripeCheckout from "../components/StripeCheckout";
import BackButton from "../components/BackButton";
import {useScroll} from "../hooks/useScroll";


const OrderPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: orderId } = useParams();
    const ref = useRef(null);
    const { scrollY } = useScroll();

    const {data: order, refetch, isLoading, error} = useGetOrderByIdQuery(orderId);
    const [cancelOrder,
        // {error: errorCancelOrder}
    ] = useCancelOrderMutation();

    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!isLoading && order) {
            // console.log("check")
            // console.log(ref?.current?.clientHeight)
            setHeight(25 + ref?.current?.clientHeight)
        }

    }, [isLoading, order]);


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

    useEffect(() => {
        if (searchParams.get("stripe") || searchParams.get("paypal")) {
            dispatch(clearCartItems());
            navigate(`/order/${orderId}`);
        }
    }, [dispatch, searchParams, navigate, orderId]);

    // const onApproveTest = async  () => {
    //     dispatch(setLoading(true));
    //     await payOrder({orderId, details: { payer: {} }});
    //     refetch();
    //     dispatch(setLoading(false));
    // }

    const submitCancel = async () => {
        await cancelOrder(order._id);
        refetch();
    };

    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const setWindowWidth = () => {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", setWindowWidth);
        return () => {
            removeEventListener("resize", setWindowWidth)
        }
    }, []);


    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <NotFoundPage/>
                ) : (
                    <>
                        <Meta title={`Order # ${order._id}`}/>
                        {
                            width < 768 && (
                                <div
                                    style={{
                                        transform: scrollY > height ? "none" : `translateY(${height}px)`,
                                    }}
                                >
                                    <BackButton/>
                                </div>
                            )
                        }
                        {/*TITLE*/}
                        <div className={"p-5 lg:pt-10 lg:pb-5"}>
                            <div ref={ref}>
                            {
                                order.isPaid && !order.isShipped && !order.isDelivered && !order.isCanceled && order.canceledItems.length !== order.orderItems.length ? (
                                    <h1 className={"text-4xl font-bold"}>
                                        Payment successful! Order is now being processed. You can come back to this page to view future order updates.
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
                        </div>
                        {/*TITLE*/}
                        <div className={"lg:pt-5 flex-col flex lg:flex-row w-full md:px-3 lg:pr-0 2xl:container mx-auto"}>
                            {/*{*/}
                            {/*    scrollY < 250 && width < 1024 && (*/}
                            {/*        <div className={"lg:hidden"}>*/}
                            {/*            <BackButton/>*/}
                            {/*        </div>*/}
                            {/*    )*/}
                            {/*}*/}

                            {/*ORDER DETAILS*/}
                            <div className={"lg:w-7/12 bg-white md:border h-min px-4 md:p-7"}>
                                <div className={"pt-5 md:pt-0 pb-5 lg:pb-0 lg:flex"}>
                                    {
                                        width >= 768 && (
                                            <div className={"-translate-y-7 -translate-x-7"}>
                                                <BackButton/>
                                            </div>
                                        )
                                    }
                                    <h1 className={"lg:mx-auto text-2xl font-semibold text-center"}>
                                        Order # {order._id}
                                    </h1>
                                </div>
                                <div className={"pb-3"}>
                                    <Message variant={"warning"}>
                                        Please save this order number, you can use it to locate and track your order using our order locator<span className={"link link-primary pl-1"} onClick={() => window.alert("This feature is coming soon")}>tool.</span>
                                    </Message>
                                </div>
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                        <h3 className={"font-semibold"}>
                                            Customer Email:
                                        </h3>
                                    </div>
                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12 flex items-center"}>
                                        <div className={"flex flex-col text-sm"}>
                                            <span>{order.user.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Ship To:
                                        </h3>
                                    </div>
                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                        <div className={"flex flex-col text-sm"}>
                                            <span>{order.shippingAddress.name}</span>
                                            <span>{order.shippingAddress.address}</span>
                                            <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</span>
                                            <span>{order.shippingAddress.country}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                        <h3 className={"font-semibold pr-5"}>
                                            Payment Service:
                                        </h3>
                                    </div>
                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
                                        <div className={"flex items-center xl:items-start"}>
                                            <div className={"flex flex-col text-sm"}>
                                                {
                                                    order.paymentMethod === "PayPal / Credit Card" ? (
                                                        <>
                                                            <span className={"font-semibold"}>Paypal, Inc.</span>
                                                            <span>(includes: Paypal, Venmo, Credit Card, etc.)</span>
                                                        </>
                                                    ) :  order.paymentMethod === "Stripe / Credit Card" ? (
                                                        <>
                                                            <span className={"font-semibold"}>Stripe, Inc.</span>
                                                            <span>(includes: Cash App, Afterpay, Credit Card, etc.)</span>
                                                        </>
                                                    ) : ""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    order.paymentResult && (
                                        <div className={"flex border-b-[1px] border-gray-300 py-4"}>
                                            <div className={"w-4/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                                <h3 className={"font-semibold"}>
                                                    Transaction #
                                                </h3>
                                            </div>
                                            <div className={"w-8/12 sm:w-7/12 lg:w-8/12 lex items-center"}>
                                        <span className={"text-xs sm:text-sm px-1"}>
                                            {order.paymentResult.id}
                                        </span>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-start"}>
                                        <h3 className={"font-semibold pr-2"}>
                                            Order Position:
                                        </h3>
                                    </div>
                                    <div className={"w-9/12 sm:w-7/12 lg:w-8/12"}>
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

                                        {
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
                                    </div>
                                </div>
                                {
                                    order.isShipped && (
                                        <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                            <div className={"w-3/12 sm:w-5/12 lg:w-4/12 flex items-center"}>
                                                <h3 className={"font-semibold pr-2"}>
                                                    Tracking #
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
                            {/*ORDER DETAILS*/}


                            <div className={"pt-5 lg:pt-0 px-3 pb-5 lg:pl-5 lg:w-5/12 flex flex-col-reverse md:flex-col"}>

                                <div className={"pt-5 lg:pt-0 pb-5"}>
                            {/*CANCEL OPTIONS*/}
                            {
                                !order.isShipped && !order.isDelivered && !order.isCanceled && order.canceledItems.length !== order.orderItems.length ? (
                                    <div className={"px-3 w-full flex justify-end"}>
                                        <button onClick={() => window.confirm_modal.showModal()}
                                                className={"btn btn-outline bg-white btn-error normal-case btn-sm w-40 md:w-full rounded-full"}
                                        >
                                            Cancel This Order
                                        </button>
                                    </div>
                                ) : (order.isCanceled || totalNumberOfCanceledItemsThatRequireRefund > 0) && order.isPaid && !order.isReimbursed ? (
                                        <h5 className={"text-center"}>
                                            Refunds can take up 5-7 business to process.
                                        </h5>
                                ) : (order.isCanceled || order.canceledItems?.length === order.orderItems.length) || order.isDelivered  ? (
                                        ""
                                ) : (
                                    <h5 className={"text-center"}>
                                        This order has shipped and can no longer be canceled.
                                    </h5>
                                )
                            }
                            {/*CANCEL OPTIONS*/}

                                </div>

                                <div className={"flex flex-col"}>
                                    {
                                        totalNumberOfItems - totalNumberOfCanceledItems !== 0 && (
                                            <>
                                            {/*ORDER SUMMARY*/}
                                                <h3 className={"hidden md:block py-2 ibmplex text-2xl bg-zinc-700 text-white font-semibold text-center"}>
                                                    {
                                                        order.isPaid ? (
                                                            "Payment Summary"
                                                        ) : (
                                                            "Pay Order"
                                                        )
                                                    }
                                                </h3>
                                                <h1 className={"md:hidden text-center pt-3 font-semibold text-3xl bg-white px-2"}>
                                                    {
                                                        order.isPaid ? (
                                                            "Payment Summary"
                                                        ) : (
                                                            "Pay Order"
                                                        )
                                                    }
                                                </h1>
                                                <div className="bg-white md:border">
                                                    <div className="pt-0 px-3 md:px-6">
                                                        <div className={"flex flex-col md:pt-6"}>
                                                            <div className={"md:hidden mt-5 mb-3"}/>
                                                            <div className={"flex justify-between text-sm my-1"}>
                                                                <span>Items ({totalNumberOfItems - totalNumberOfCanceledItems}):</span>
                                                                <span className="pl-2">${(order.itemsPrice).toFixed(2)}</span>
                                                            </div>
                                                            <div className={"flex justify-between text-sm my-1"}>
                                                                <span>Shipping & handling:</span>
                                                                <span className="pl-2">${(order.shippingPrice).toFixed(2)}</span>
                                                            </div>
                                                            <span className={"self-end w-16 my-1 border-b-[1px] border-grey-500"}/>
                                                            <div className={"flex justify-between text-sm my-1"}>
                                                                <span>Total before tax:</span>
                                                                <span className="pl-2">${(order.itemsPrice + order.shippingPrice).toFixed(2)}</span>
                                                            </div>
                                                            <div className={"flex justify-between text-sm my-1"}>
                                                                <span>Estimated tax to be collected:</span>
                                                                <span className="pl-2">${(order.taxPrice).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={"flex justify-between font-semibold text-lg px-3 md:px-6 pt-6 pb-8"}>
                                                        <span className="text-red-600">Order Total:</span>
                                                        <span className="text-red-600">${(order.taxPrice + order.shippingPrice + order.itemsPrice).toFixed(2)}</span>
                                                    </div>

                                            {/*ORDER SUMMARY*/}

                                            {/*PAYMENT OPTIONS*/}
                                            {
                                                !order.isPaid && (!order.isCanceled || order.orderItems.length !== order.canceledItems.length) && (
                                                    <div className={"px-3 md:px-6 pb-5"}>

                                                        <div className={"border-t-[1px] pb-10"}/>

                                                        {
                                                            order.paymentMethod === "PayPal / Credit Card" && (
                                                                <div className={"px-4"}>
                                                                    <PaypalCheckout existingOrder={order}/>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            order.paymentMethod === "Stripe / Credit Card" && (
                                                                <>
                                                                    <div className={"pb-3 flex w-full justify-center items-center"}>
                                                                        <div className={"flex justify-center items-center px-3 rounded-lg border-2 border-[#4f3cff]"}>
                                                                            <span className={"ibmplex text-sm text-[#4f3cff]"}>Powered by</span>
                                                                            <StripeLogo className={"w-16"}/>
                                                                        </div>
                                                                    </div>
                                                                    <StripeCheckout existingOrder={order}/>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            }
                                                </div>
                                            {/*PAYMENT OPTIONS*/}
                                            </>
                                        )
                                    }
                                    {
                                        order.isPaid && (totalNumberOfCanceledItemsThatRequireRefund > 0) && (order.isCanceled || order.canceledItems.length > 0) && (

                                            <div className={`${totalNumberOfCanceledItemsThatRequireRefund === orderItemsPaidAndNotCanceled.length ? "mt-5" : ""}`}>
                                                <h3 className={"hidden md:block py-2 ibmplex text-2xl bg-zinc-700 text-white font-semibold text-center"}>
                                                    Refund Summary
                                                </h3>
                                                <h1 className={"md:hidden pt-5 text-center font-semibold text-3xl bg-white px-2"}>
                                                    Refund Summary
                                                </h1>
                                                <div className="bg-white md:border pt-0 px-3 md:px-6">
                                                    <div className={"flex flex-col md:pt-6"}>
                                                        <div className={"md:hidden mt-5 mb-3"}/>
                                                        <div className={"flex justify-between text-sm my-1"}>
                                                            <span>Items ({totalNumberOfCanceledItemsThatRequireRefund}):</span>
                                                            <span className="pl-2">${totalDollarAmountOfCanceledItemsThatRequireRefund.toFixed(2)}</span>
                                                        </div>
                                                        {
                                                            order.isCanceled && (
                                                                <div className={"flex justify-between text-sm my-1"}>
                                                                    <span>Shipping & handling:</span>
                                                                    <span className="pl-2">${totalDollarAmountOfShippingRefund.toFixed(2)}</span>
                                                                </div>
                                                            )
                                                        }
                                                        <div className={"flex justify-between text-sm my-1"}>
                                                            <span>Tax collected:</span>
                                                            <span className="pl-2">${(TAX_PERCENTAGE * totalDollarAmountOfCanceledItemsThatRequireRefund).toFixed(2)}</span>
                                                        </div>
                                                        {
                                                            !order.isCanceled && (
                                                                <>
                                                                    <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                                                    <div className={"flex justify-between text-sm my-1"}>
                                                                        <span>Refund subtotal:</span>
                                                                        <span className="pl-2">$
                                                                            {
                                                                                (totalDollarAmountOfCanceledItemsThatRequireRefund + (TAX_PERCENTAGE * totalDollarAmountOfCanceledItemsThatRequireRefund)).toFixed(2)
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className={"flex justify-between text-sm my-1"}>
                                                                        <span>Shipping Fee:</span>
                                                                        <span className="pl-2">- ${totalDollarAmountOfFees.toFixed(2)}</span>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                        <div className={"flex justify-between font-semibold text-lg pt-6 pb-8"}>
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