import React from 'react';
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {savePaymentMethod} from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import {ReactComponent as PayPal} from "../icons/paypal.svg";
import {FaCreditCard} from "react-icons/fa";

const PaymentPage = () => {


    const cartItems = useSelector(function (state) {
        return state.cart;
    });
    const {shippingAddress, paymentMethod} = cartItems;
    const [paymentMeth, setPaymentMeth] = useState(paymentMethod ? paymentMethod : null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const shippingAddressIsInvalid = Object.keys(shippingAddress).length === 0;

    useEffect(function (){

        if (cartItems.cartItems.length === 0) {
            navigate("/")
        } else if (shippingAddressIsInvalid) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress])

    const submitPaymentMethod = (e) => {
        e.preventDefault();
        if (paymentMeth) {
            dispatch(savePaymentMethod(paymentMeth));
            navigate("/checkout")
        }

    }
    return (
        <>
            <CheckoutSteps step2 />
            <div className={"w-full flex justify-center"}>
                <div className={"card p-10 w-[35em] bg-base-100 shadow-xl"}>
                    <div className={"w-full pb-5 flex justify-center"}>
                        <h1 className={"text-2xl font-bold"}>Payment Methods</h1>
                    </div>
                    <form onSubmit={submitPaymentMethod}>
                        <div className="mt-5">
                            <div
                                className={"w-full card bg-base-200 cursor-pointer"}
                                onClick={() => setPaymentMeth("PayPal")}
                            >
                                <div className={"w-full flex p-6"}>
                                    <div className={"w-2/12"}>
                                        <PayPal className={"w-8"}/>
                                    </div>
                                    <div className={"w-8/12 flex  items-center"}>
                                        <span className={"text-lg"}>
                                            PayPal
                                        </span>
                                    </div>
                                    <div className={"w-2/12 flex items-center"}>
                                        <input
                                            onChange={(e) => setPaymentMeth(e.target.value)}
                                            type="radio"
                                            name="paymentMethod"
                                            id={"PayPal"}
                                            value={"PayPal"}
                                            className="radio radio-primary"
                                            checked={paymentMeth === "PayPal"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="my-5">
                            <div
                                className={"w-full card bg-base-200 cursor-pointer"}
                                onClick={() => setPaymentMeth("CreditCard")}
                            >
                                <div className={"w-full flex p-6"}>
                                    <div className={"w-2/12"}>
                                        <FaCreditCard className={"text-3xl"}/>
                                    </div>
                                    <div className={"w-8/12 flex  items-center"}>
                                        <span className={"text-lg"}>
                                            Credit Card
                                        </span>
                                    </div>
                                    <div className={"w-2/12 flex items-center"}>
                                        <input
                                            onChange={(e) => setPaymentMeth(e.target.value)}
                                            type="radio"
                                            name="paymentMethod"
                                            id={"CreditCard"}
                                            value={"CreditCard"}
                                            className="radio radio-primary"
                                            checked={paymentMeth === "CreditCard"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"pt-5 w-full flex justify-end"}>
                            <button className="btn btn-primary btn-wide" disabled={paymentMeth === null}>
                                Continue To Checkout
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;