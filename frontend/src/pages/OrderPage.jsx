import {useEffect} from 'react';
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    useGetOrderByIdQuery,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
    useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import {setLoading} from "../slices/loadingSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {ReactComponent as PayPal} from "../icons/paypal.svg";
import {FaCheck, FaCreditCard} from "react-icons/fa";
import OrderItem from "../components/OrderItem";


const OrderPage = () => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    const dispatch = useDispatch();
    const { id: orderId } = useParams();
    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();
    const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();
    const {data: order, refetch, isLoading, error} = useGetOrderByIdQuery(orderId);
    const [deliverOrder] = useDeliverOrderMutation();

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
    
    const onApproveTest = async  () => {
        dispatch(setLoading(true));
        await payOrder({orderId, details: { payer: {} }});
        refetch();
        dispatch(setLoading(false));
    }
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

    const deliverOrderHandler = async () => {
        const confirmDeliver = window.confirm(`Are you sure you want to mark order ${order._id} as delivered?`);
        if (confirmDeliver) {
            dispatch(setLoading(true));
            try {
                await deliverOrder(orderId);
                refetch();
                dispatch(setLoading(false));
            } catch (e) {
                console.log(e)
                dispatch(setLoading(false));
            }
        }
    }

    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <div className={"pt-5"}>
                        <Message variant={"error"}>{error.data.message}</Message>
                    </div>
                ) : (
                    <>
                        <div className={"p-5 lg:pt-10 lg:pb-5"}>
                            {
                                order.isPaid ? (
                                    <h1 className={"text-4xl font-bold text-neutral-700"}>Payment successful! Order is now being processed.</h1>
                                ) : (
                                    <h1 className={"text-4xl font-bold text-neutral-700"}>Thanks for the order! Please pay order below to begin shipment process.</h1>
                                )
                            }

                        </div>
                        <div className={"lg:pt-5 flex-col flex lg:flex-row w-full"}>
                            <div className={"lg:w-7/12 card bg-base-100 shadow-xl h-min p-4 sm:p-7"}>
                                <div className={"pb-5"}>
                                    <h1 className={"text-2xl font-bold text-center"}>
                                        Order # {order._id}
                                    </h1>
                                </div>
                                <div className={"flex border-b-2 border-grey-500 py-3"}>
                                    <div className={"w-5/12"}>
                                        <h3 className={"text-lg font-bold"}>
                                            Shipping Address
                                        </h3>
                                    </div>
                                    <div className={"w-7/12"}>
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

                                <div className={"flex border-b-2 border-grey-500 py-3"}>
                                    <div className={"w-5/12"}>
                                        <h3 className={"text-md text-neutral-500 font-bold"}>
                                            Shipment Status
                                        </h3>
                                        {
                                            userData?.isAdmin && order.isPaid && !order.isDelivered && (
                                                <div className={"flex pt-1"}>
                                                    <button onClick={deliverOrderHandler} className={"text-sm link link-primary"}>
                                                    Mark as delivered
                                                    </button>
                                                    <FaCheck className={"pl-1 text-primary"}/>
                                                </div>
                                            )
                                        }

                                    </div>
                                    <div className={"w-7/12"}>
                                        <div className={"flex flex-col text-sm"}>
                                            {
                                                order.isPaid && !order.isDelivered ? (
                                                    <Message variant={"info"}>
                                                        Order is being processed
                                                    </Message>
                                                ) : order.isPaid && order.isDelivered ? (
                                                    <Message variant={"success"}>
                                                        Delivered on {order.deliveredAt}
                                                    </Message>
                                                ) : (
                                                    <Message variant={"warning"}>
                                                        Order is awaiting payment, please pay now.
                                                    </Message>
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>

                                <div className={"flex border-b-2 border-grey-500 py-3"}>
                                    <div className={"w-5/12"}>
                                        <h3 className={"text-lg font-bold"}>
                                            Payment Method
                                        </h3>
                                    </div>
                                    <div className={"w-7/12"}>
                                        <div className={"flex items-center text-sm"}>
                                            <div>
                                                {
                                                    order.paymentMethod === "PayPal" ? (
                                                        <PayPal className={"w-8"}/>
                                                    ) : (
                                                        <FaCreditCard className={"text-3xl"}/>
                                                    )
                                                }

                                            </div>
                                            <span className={"pl-2"}>
                                            {order.paymentMethod}
                                        </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={"flex border-b-2 border-grey-500 py-3"}>
                                    <div className={"w-5/12"}>
                                        <h3 className={"text-md text-neutral-500 font-bold"}>
                                            Payment Status
                                        </h3>
                                    </div>
                                    <div className={"w-7/12"}>
                                        <div className={"flex items-center text-sm"}>
                                            {
                                                order.isPaid ? (
                                                    <Message variant={"success"}>
                                                        Paid on {order.paidAt}
                                                    </Message>
                                                ) : (
                                                    <Message variant={"error"}>
                                                        Not Paid
                                                    </Message>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>



                                <div className={"py-3"}>
                                    <h3 className={"text-xl font-bold"}>
                                        Order Items
                                    </h3>
                                    <div>
                                        {
                                            order.orderItems.map(function (item) {
                                                return (
                                                    <OrderItem item={item} key={item._id}/>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>


                            <div className={"p-3 lg:pl-10 lg:w-5/12"}>
                                <div className="card bg-base-100 shadow-xl">
                                    <div className="pt-8 px-8">
                                        <div className={"flex flex-col"}>
                                            <h3 className={"text-xl font-bold"}>
                                                Order Summary
                                            </h3>
                                            <div className={"border-b-2 border-grey-500 mt-5 mb-3"}/>
                                            <div className={"flex justify-between font-bold text-sm my-1"}>
                                             <span className="">
                                                Items
                                                ({totalNumberOfItems}):
                                            </span>
                                                <span className="pl-2">
                                            ${(order.itemsPrice).toFixed(2)}
                                            </span>
                                            </div>
                                            <div className={"flex justify-between font-bold text-sm my-1"}>
                                             <span className="">
                                                Shipping & Handling:
                                            </span>
                                                <span className="pl-2">
                                            ${(order.shippingPrice).toFixed(2)}
                                            </span>
                                            </div>
                                            <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                            <div className={"flex justify-between font-bold text-sm my-1"}>
                                             <span className="">
                                                Total before tax:
                                            </span>
                                                <span className="pl-2">
                                            ${(order.itemsPrice + order.shippingPrice).toFixed(2)}
                                            </span>
                                            </div>
                                            <div className={"flex justify-between font-bold text-sm my-1"}>
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
                                       !order.isPaid && (
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
                                                            <button
                                                                onClick={onApproveTest}
                                                                className={"btn btn-xs"}
                                                            >
                                                                Pay
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }

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