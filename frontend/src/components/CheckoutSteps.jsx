import React from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const CheckoutSteps = ({ step1, step2, step3 }) => {

    const {cartItems,shippingAddress, paymentMethod} = useSelector(function (state) {
       return state.cart;
    });

    return (
        <div className={"flex justify-center py-5"}>
            {
                step1 ? (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-primary">Cart</Link>
                        {
                            cartItems.length !== 0 ? (
                                <Link to={"/shipping"} className="step">Shipping</Link>
                            ) : (
                                <button className="step">Shipping</button>
                            )
                        }
                        {
                            Object.keys(shippingAddress).length !== 0 ? (
                                <Link to={"/payment"} className="step">Payment</Link>
                            ) : (
                                <button className="step">Payment</button>
                            )
                        }
                        {
                            paymentMethod ? (
                                <Link to={"/checkout"} className="step">Checkout</Link>
                            ) : (
                                <button className="step">Checkout</button>
                            )
                        }
                    </div>
                ) : step2 ? (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-primary">Cart</Link>
                        {
                            cartItems.length !== 0 ? (
                                <Link to={"/shipping"} className="step step-primary">Shipping</Link>
                            ) : (
                                <button className="step step-primary">Shipping</button>
                            )
                        }
                        {
                            Object.keys(shippingAddress).length !== 0 ? (
                                <Link to={"/payment"} className="step">Payment</Link>
                            ) : (
                                <button className="step mx-2">Payment</button>
                            )
                        }
                        {
                            paymentMethod ? (
                                <Link to={"/checkout"} className="step">Checkout</Link>
                            ) : (
                                <button className="step">Checkout</button>
                            )
                        }
                    </div>
                ) : step3 ?  (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-primary">Cart</Link>
                        <Link to={"/shipping"} className="step step-primary">Shipping</Link>
                        <Link to={"/payment"} className="step step-primary">Payment</Link>
                        {
                            paymentMethod ? (
                                <Link to={"/checkout"} className="step">Checkout</Link>
                            ) : (
                                <button className="step">Checkout</button>
                            )
                        }
                    </div>
                ) : (
                    <div className={"steps w-full"}>
                        <Link to={"/cart"} className="step step-primary">Cart</Link>
                        <Link to={"/shipping"} className="step step-primary">Shipping</Link>
                        <Link to={"/payment"} className="step step-primary">Payment</Link>
                        <Link to={"/checkout"} className="step step-primary">Checkout</Link>
                    </div>
                )
            }
        </div>
    );
};

export default CheckoutSteps;