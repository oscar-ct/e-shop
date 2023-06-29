import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import Message from "../components/Message";
import {useSelector} from "react-redux";
import CartItem from "../components/CartItem";

const CartPage = () => {

    const navigate = useNavigate();

    const {cartItems} = useSelector(function (state) {
        return state.cart;
    });

    const totalPrice =  cartItems.reduce(function (acc, product) {
        return acc + product.quantity * product.price;
    }, 0).toFixed(2);

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <>
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
                        <div className={"lg:w-8/12 card bg-base-100 shadow-xl"}>
                            <div className={"p-5"}>
                                <h1 className={"text-3xl"}>Shopping Cart</h1>
                            {
                                cartItems.map(function (item) {
                                    return (
                                        <CartItem item={item} key={item._id}/>
                                    )
                                })
                            }
                            </div>
                        </div>
                        <div className={"p-3 lg:w-4/12"}>
                            <div className="card bg-neutral text-neutral-content">
                                {
                                    totalPrice > 100 ? (
                                        <div className={"pt-3 px-3"}>
                                            <Message variant={"success"}>
                                                <span className={"text-sm"}>
                                                    Your order qualifies for FREE shipping!
                                                </span>
                                            </Message>
                                        </div>
                                    ) : (
                                        <div className={"pt-3 px-3"}>
                                            <Message>
                                                <span className={"text-sm"}>
                                                    Add <span className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.
                                                </span>
                                            </Message>
                                        </div>
                                    )
                                }

                                <div className="p-8">
                                    <div className={"flex pb-5"}>
                                        <span className="card-title">
                                            Subtotal
                                            ({
                                                cartItems.reduce(function (acc, product) {
                                                return acc + product.quantity;
                                                }, 0)
                                            } items):
                                        </span>
                                        <span className="pl-2 card-title font-bold">
                                            ${totalPrice}
                                        </span>
                                    </div>
                                    <div className="card-actions justify-end">
                                        <button
                                            onClick={checkoutHandler}
                                            className="btn"
                                        >
                                            Proceed To Checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default CartPage;