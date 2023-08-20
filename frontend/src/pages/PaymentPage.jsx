import React from 'react';
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {savePaymentMethod} from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import {ReactComponent as PayPal} from "../icons/paypal-icon.svg";
import Meta from "../components/Meta";
// import {FaCreditCard} from "react-icons/fa";

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
    }, [navigate, shippingAddress, cartItems.cartItems.length, shippingAddressIsInvalid])

    const submitPaymentMethod = (e) => {
        e.preventDefault();
        if (paymentMeth) {
            dispatch(savePaymentMethod(paymentMeth));
            navigate("/submitorder")
        }

    }
    return (
        <>
            <Meta title={"Payment Method"}/>
            <CheckoutSteps step3 />
            <div className={"w-full flex justify-center"}>
                <div className={"mb-10 card p-10 w-[35em] bg-white shadow-xl"}>
                    <div className={"w-full pb-5 flex justify-center"}>
                        <h1 className={"text-2xl font-semibold"}>Payment Methods</h1>
                    </div>
                    <form onSubmit={submitPaymentMethod}>
                        <div className="my-5">
                            <div
                                className={"w-full card bg-base-200 cursor-pointer"}
                                onClick={() => setPaymentMeth("PayPal")}
                            >
                                <div className={"w-full flex p-6"}>
                                    <div className={"w-2/12"}>
                                      <PayPal width={"30"} height={"38"}/>
                                    </div>
                                    <div className={"w-8/12 flex  items-center"}>
                                        <span className={"text-lg"}>
                                            PayPal / Credit Card
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
                        {/*<div className="my-5">*/}
                        {/*    <div*/}
                        {/*        className={"w-full card bg-base-200 cursor-pointer"}*/}
                        {/*        onClick={() => setPaymentMeth("CreditCard")}*/}
                        {/*    >*/}
                        {/*        <div className={"w-full flex p-6"}>*/}
                        {/*            <div className={"w-2/12"}>*/}
                        {/*                <FaCreditCard className={"text-3xl"}/>*/}
                        {/*            </div>*/}
                        {/*            <div className={"w-8/12 flex  items-center"}>*/}
                        {/*                <span className={"text-lg"}>*/}
                        {/*                    Credit Card*/}
                        {/*                </span>*/}
                        {/*            </div>*/}
                        {/*            <div className={"w-2/12 flex items-center"}>*/}
                        {/*                <input*/}
                        {/*                    onChange={(e) => setPaymentMeth(e.target.value)}*/}
                        {/*                    type="radio"*/}
                        {/*                    name="paymentMethod"*/}
                        {/*                    id={"CreditCard"}*/}
                        {/*                    value={"CreditCard"}*/}
                        {/*                    className="radio radio-primary"*/}
                        {/*                    checked={paymentMeth === "CreditCard"}*/}
                        {/*                />*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className={"pt-5 w-full flex justify-end"}>
                            <button className={`${paymentMeth && "shadow-blue"} btn btn-primary btn-wide rounded-xl`} disabled={paymentMeth === null}>
                                Continue To Order Review
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentPage;