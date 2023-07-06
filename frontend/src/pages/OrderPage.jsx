import {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {clearCartItems} from "../slices/cartSlice";
import {useDispatch, useSelector} from "react-redux";
import {useGetMyOrderByIdQuery} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import {ReactComponent as PayPal} from "../icons/paypal.svg";
import {FaCreditCard} from "react-icons/fa";
import OrderItem from "../components/OrderItem";


const OrderPage = () => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const cartState = useSelector(function (state) {
        return state.cart;
    });
    const { id: orderId } = useParams();
    const {data: order, refetch, isLoading, error} = useGetMyOrderByIdQuery(orderId);

    const { shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, itemsPrice,totalPrice } = cartState;

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);


    console.log(order);

    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : error ? (
                    <div className={"mt-5"}>
                        <Message variant={"error"}>{error.data.message}</Message>
                    </div>

                ) : (
                    <>
                        <div>
                            {
                                cartItems.length === 0 ? (
                                    <Message>
                                        Your cart is empty
                                        <Link className={"ml-2"} to={"/"}>
                                            <button className={"link btn btn-xs"}>
                                                Go back
                                            </button>
                                        </Link>
                                    </Message>

                                ) : (
                                    <div className={"lg:pt-10 flex-col flex lg:flex-row w-full"}>
                                        <div className={"lg:w-7/12 card bg-base-100 shadow-xl h-min p-4 sm:p-7"}>
                                            <div className={"pb-5"}>
                                                <h1 className={"text-2xl font-bold text-center"}>
                                                    Order # {order._id}
                                                </h1>
                                            </div>
                                            <div className={"flex border-b-2 border-grey-500 py-3"}>
                                                <div className={"w-5/12"}>
                                                    <h3 className={"text-xl font-bold"}>
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
                                                        {order.shippingAddress.city}, {shippingAddress.postalCode}
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
                                                </div>
                                                <div className={"w-7/12"}>
                                                    <div className={"flex flex-col text-sm"}>
                                                        {/*<Message variant={"info"}>*/}
                                                        {/*    Order is being processed*/}
                                                        {/*</Message>*/}
                                                        <Message variant={"warning"}>
                                                            Order is awaiting payment, please pay now.
                                                        </Message>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={"flex border-b-2 border-grey-500 py-3"}>
                                                <div className={"w-5/12"}>
                                                    <h3 className={"text-xl font-bold"}>
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
                                                        <Message variant={"error"}>Not Paid</Message>
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
                                                        ${itemsPrice.toFixed(2)}
                                                        </span>
                                                        </div>
                                                        <div className={"flex justify-between font-bold text-sm my-1"}>
                                                         <span className="">
                                                            Shipping & Handling:
                                                        </span>
                                                            <span className="pl-2">
                                                        ${shippingPrice.toFixed(2)}
                                                        </span>
                                                        </div>
                                                        <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                                        <div className={"flex justify-between font-bold text-sm my-1"}>
                                                         <span className="">
                                                            Total before tax:
                                                        </span>
                                                            <span className="pl-2">
                                                        ${(itemsPrice + shippingPrice).toFixed(2)}
                                                        </span>
                                                        </div>
                                                        <div className={"flex justify-between font-bold text-sm my-1"}>
                                                         <span className="">
                                                            Estimated tax to be collected:
                                                        </span>
                                                            <span className="pl-2">
                                                        ${taxPrice.toFixed(2)}
                                                        </span>
                                                        </div>
                                                        {/*<span className={"my-3 border-b-2 border-grey-500"}>*/}
                                                        {/*</span>*/}

                                                    </div>
                                                </div>
                                                <div
                                                    className={"flex justify-between font-bold rounded-bl-xl rounded-br-xl text-xl px-8 py-8"}>
                                                     <span className="text-red-600">
                                                        Order Total:
                                                    </span>
                                                    <span className="text-red-600">
                                                    ${(taxPrice + shippingPrice + itemsPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </>
                )
            }
        </>
    );
};

export default OrderPage;