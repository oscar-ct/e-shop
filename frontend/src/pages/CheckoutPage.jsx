import React from 'react';
import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import CheckoutSteps from "../components/CheckoutSteps";
import {useCreateOrderMutation} from "../slices/ordersApiSlice";
import Spinner from "../components/Spinner";
import {clearCartItems} from "../slices/cartSlice";
import Message from "../components/Message";
import CheckoutItem from "../components/CheckoutItem";
import {ReactComponent as PayPal} from "../icons/paypal.svg";
import {FaCreditCard} from "react-icons/fa";

const CheckoutPage = () => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const cartState = useSelector(function (state) {
        return state.cart;
    });

    const navigate = useNavigate();
    const { shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, itemsPrice,totalPrice } = cartState;

    const [createOrder, {isLoading, error}] = useCreateOrderMutation();

    useEffect(function () {
        if (Object.keys(shippingAddress).length === 0) {
            navigate("/shipping");
        } else if (!paymentMethod) {
            navigate("/payment");
        }
    }, [navigate, shippingAddress, paymentMethod]);

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    const checkoutHandler = async () => {
        try {
            const order = await createOrder({
                orderItems: cartItems,
                shippingAddress: shippingAddress,
                paymentMethod: paymentMethod,
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
            }).unwrap();
            navigate(`/order/${order._id}`);
        } catch (e) {
            console.log(e || error);
        }
    }

    return (
        <>
            {
                isLoading ? (
                    <Spinner/>
                ) : (
                    <>
                        <CheckoutSteps step3/>
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
                                    <div className={"flex-col flex lg:flex-row w-full"}>
                                        <div className={"lg:w-7/12 card bg-base-100 shadow-xl h-min p-4 sm:p-7"}>
                                            <div className={"pb-3"}>
                                                <h1 className={"text-3xl text-center"}>Checkout (<span
                                                    className={"text-2xl text-gray-500 font-bold"}>{totalNumberOfItems}
                                                    {
                                                        totalNumberOfItems === 1 ? (
                                                            " Item"
                                                        ) : (
                                                            " Items"
                                                        )
                                                    }
                                                </span>)
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
                                                        {userData.name}
                                                    </span>
                                                        <span>
                                                        {shippingAddress.address}
                                                    </span>
                                                        <span>
                                                        {shippingAddress.city}, {shippingAddress.postalCode}
                                                    </span>
                                                        <span>
                                                        {shippingAddress.country}
                                                    </span>
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
                                                                paymentMethod === "PayPal" ? (
                                                                    <PayPal className={"w-8"}/>
                                                                ) : (
                                                                    <FaCreditCard className={"text-3xl"}/>
                                                                )
                                                            }

                                                        </div>
                                                        <span className={"pl-2"}>
                                                        {paymentMethod}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className={"py-3"}>
                                                <h3 className={"text-xl font-bold"}>
                                                    Review Items
                                                </h3>
                                                <div>
                                                    {
                                                        cartItems.map(function (item) {
                                                            return (
                                                                <CheckoutItem item={item} key={item._id}/>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>


                                        <div className={"p-3 lg:pl-10 lg:w-5/12"}>
                                            <div className="card bg-neutral text-neutral-content">
                                                <div className="pt-8 px-8">
                                                    <div className="card-actions justify-center">
                                                        <button
                                                            onClick={checkoutHandler}
                                                            disabled={cartItems.length === 0}
                                                            className="btn btn-warning">
                                                            Place your order
                                                        </button>
                                                    </div>
                                                    <div className={"border-b-2 border-grey-500 mt-5 mb-3"}/>
                                                    <div className={"flex flex-col"}>
                                                        <h3 className={"pb-5 text-xl font-bold"}>
                                                            Order Summary
                                                        </h3>
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
                                                    className={"flex justify-between font-bold rounded-bl-xl rounded-br-xl text-black text-xl px-8 py-8"}>
                                                     <span className="text-warning">
                                                        Order Total:
                                                    </span>
                                                    `<span className="text-warning">
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
    )
};

export default CheckoutPage;