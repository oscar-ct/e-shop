import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import Message from "../components/Message";
import {useSelector} from "react-redux";
import CartItem from "../components/CartItem";
import CheckoutSteps from "../components/CheckoutSteps";

const CartPage = () => {

    const navigate = useNavigate();

    const {cartItems} = useSelector(function (state) {
        return state.cart;
    });
    const {userData} = useSelector(function (state) {
        return state.auth;
    });

    const totalPrice =  cartItems.reduce(function (acc, product) {
        return acc + product.quantity * product.price;
    }, 0).toFixed(2);

    const checkoutHandler = () => {
        userData ? navigate("/shipping") : navigate('/login?redirect=/shipping');
    };

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    return (
        <div>

            {
                cartItems.length === 0 ? (
                    <div className={"p-5"}>
                        <Message>
                            Your cart is empty
                            <Link className={"ml-2"} to={"/"}>
                                <button className={"link btn btn-xs"}>
                                    Home
                                </button>
                            </Link>
                        </Message>
                    </div>

                ) : (
                    <>
                        <CheckoutSteps step1 />
                        <div className={"flex-col flex lg:flex-row w-full"}>
                            <div className={"lg:hidden"}>
                            {
                                totalPrice > 100 ? (
                                    <div className={"py-3 px-2 sm:px-0"}>
                                        <Message variant={"success"}>
                                                <span className={"text-sm"}>
                                                    Your order qualifies for FREE shipping!
                                                </span>
                                        </Message>
                                    </div>
                                ) : (
                                    <div className={"py-3 px-2 sm:px-0"}>
                                        <Message variant={"info"}>
                                                <span className={"text-sm"}>
                                                    Add <span className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.
                                                </span>
                                        </Message>
                                    </div>
                                )
                            }
                            </div>
                            <div className={"lg:mb-10 lg:w-8/12 card bg-base-100 shadow-xl h-min p-4 sm:p-7"}>
                                <div className={"pb-10"}>
                                    <h1
                                        // style={{background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(216,228,253,1) 100%)"}}
                                        className={"border-b-[1px] border-gray-300 py-2 text-gray-700 rounded-xl text-2xl text-center"}>
                                         Shopping Cart (
                                        <span className={"text-xl text-gray-500 font-bold"}>
                                            {totalNumberOfItems}
                                            {
                                                totalNumberOfItems === 1 ? (
                                                    " Item"
                                                ) : (
                                                    " Items"
                                                )
                                            }
                                        </span>
                                        )
                                    </h1>
                                </div>
                                {
                                    cartItems.map(function (item) {
                                        return (
                                            <CartItem item={item} key={item._id}/>
                                        )
                                    })
                                }

                            </div>
                            <div className={"px-3 lg:pl-10 lg:w-4/12"}>
                                <div className={"hidden lg:flex"}>
                                    {
                                        totalPrice > 100 ? (
                                            <div className={"pb-3 w-full"}>
                                                <Message variant={"success"}>
                                                    <span className={"text-sm"}>
                                                        Your order qualifies for FREE shipping!
                                                    </span>
                                                </Message>
                                            </div>
                                        ) : (
                                            <div className={"pb-3 w-full"}>
                                                <Message variant={"info"}>
                                                    <span className={"text-sm"}>
                                                        Add <span className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.
                                                    </span>
                                                </Message>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="mt-5 mb-10 lg:my-0 card lg:w-full shadow-xl bg-base-100 self-end">
                                    <div className="px-8 py-5">
                                        <div className={"flex flex-col"}>
                                            <h3 className={"text-xl"}>
                                                Subtotal ({totalNumberOfItems})
                                                {
                                                    totalNumberOfItems > 1 ? (" items:") : (" item:")
                                                }
                                            </h3>
                                            <div className={"border-b-[1px] border-gray-300 my-2"}/>
                                            <div className={"flex justify-end"}>
                                                <span className="pl-2 card-title font-bold">
                                                    ${totalPrice}
                                                    <span className={"text-sm font-bold"}>
                                                        USD
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-actions justify-end p-3">
                                        <button
                                            onClick={checkoutHandler}
                                            className="btn btn-primary rounded-xl"
                                        >
                                            Proceed To Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default CartPage;