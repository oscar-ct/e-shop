import React from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const CheckoutSteps = ({ step1, step2 }) => {

    const {cartItems,shippingAddress, paymentMethod} = useSelector(function (state) {
       return state.cart;
    });

    return (
        <div className={"flex justify-center mt-5"}>
            {
                step1 ? (
                    <div className={"steps"}>
                        <Link to={"/cart"} className="step step-primary mx-2">Cart</Link>
                        {
                            cartItems.length !== 0 ? (
                                <Link to={"/shipping"} className="step step-primary mx-2">Shipping</Link>
                            ) : (
                                <button className="step step-primary mx-2">Shipping</button>
                            )
                        }
                        {
                            Object.keys(shippingAddress).length !== 0 ? (
                                <Link to={"/payment"} className="step mx-2">Payment</Link>
                            ) : (
                                <button className="step mx-2">Payment</button>
                            )
                        }
                        {
                            paymentMethod ? (
                                <Link to={"/checkout"} className="step mx-2">Checkout</Link>
                            ) : (
                                <button className="step mx-2">Checkout</button>
                            )
                        }
                    </div>
                ) : step2 ?  (
                    <div className={"steps"}>
                        <Link to={"/cart"} className="step step-primary mx-2">Cart</Link>
                        <Link to={"/shipping"} className="step step-primary mx-2">Shipping</Link>
                        <Link to={"/payment"} className="step step-primary mx-2">Payment</Link>
                        {
                            paymentMethod ? (
                                <Link to={"/checkout"} className="step mx-2">Checkout</Link>
                            ) : (
                                <button className="step mx-2">Checkout</button>
                            )
                        }
                    </div>
                ) : (
                    <div className={"steps"}>
                        <Link to={"/cart"} className="step step-primary mx-2">Cart</Link>
                        <Link to={"/shipping"} className="step step-primary mx-2">Shipping</Link>
                        <Link to={"/payment"} className="step step-primary mx-2">Payment</Link>
                        <Link to={"/checkout"} className="step step-primary mx-2">Checkout</Link>
                    </div>
                )
            }
        </div>
    );
};

export default CheckoutSteps;