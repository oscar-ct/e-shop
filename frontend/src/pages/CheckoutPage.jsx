import React, {useState} from 'react';
import {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import {useSelector, useDispatch} from "react-redux";
import {useCreateOrderMutation} from "../slices/ordersApiSlice";
import {useValidateDiscountCodeMutation} from "../slices/productsApiSlice";
import {setLoading} from "../slices/loadingSlice";
import {applyDiscountCode, clearCartItems, removeDiscountCode} from "../slices/cartSlice";
import Message from "../components/Message";
import CheckoutItem from "../components/CheckoutItem";
import {ReactComponent as PayPal} from "../icons/paypal-icon.svg";
import {FaCreditCard, FaTimes} from "react-icons/fa";
import BackButton from "../components/BackButton";
import Meta from "../components/Meta";
import {toast} from "react-hot-toast";


const CheckoutPage = () => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const cartState = useSelector(function (state) {
        return state.cart;
    });

    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [discountCode, setDiscountCode] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { discount, shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, itemsPrice,totalPrice } = cartState;

    const [createOrder, {error}] = useCreateOrderMutation();
    const [validateDiscountCode] = useValidateDiscountCodeMutation();

    useEffect(function () {
        if (Object.keys(shippingAddress).length === 0 && !orderSubmitted) {
            navigate("/shipping");
        } else if (!paymentMethod && !orderSubmitted) {
            navigate("/payment");
        }
    }, [navigate, shippingAddress, paymentMethod, orderSubmitted]);

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);


    const submitApplyDiscountCode = async () => {
        const res = await validateDiscountCode({code: discountCode}).unwrap();
        if (!res.validCode) {
            toast.error("Invalid discount code");
        } else {
            toast.success("Discount applied!");
            dispatch(applyDiscountCode());
            setDiscountCode("");
        }
    };

    const submitRemoveDiscountCode = () => {
        dispatch(removeDiscountCode());
    }

    const checkoutHandler = async () => {
        setOrderSubmitted(true);
        dispatch(setLoading(true));
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
            dispatch(setLoading(false));
            dispatch(clearCartItems());
            navigate(`/order/${order._id}`);
        } catch (e) {
            console.log(e || error);
            dispatch(setLoading(false));
        }
    };

    return (
        <>
            <Meta title={"Order Review"}/>
            {
                cartItems.length === 0 ? (
                    <div className={"px-2"}>
                        <BackButton/>
                        <Message variant={"info"}>
                            You have no items in your cart.  Click <Link to={"/"} className={"link link-primary"}>here</Link> to continue shopping.
                        </Message>
                    </div>
                ) : (
                    <div>
                        <CheckoutSteps/>
                        <div className={"mb-10 flex-col flex lg:flex-row w-full"}>
                            <div className={"lg:w-7/12 card bg-white shadow-xl h-min p-4 sm:p-7"}>
                                <div className={"pb-5"}>
                                    <h1
                                        // style={{ background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(216,228,253,1) 100%)"}}
                                        className={"border-b-[1px] border-gray-300 py-2 rounded-xl text-2xl text-center font-semibold"}>
                                        Order Review (
                                        <span className={"text-xl text-gray-500 font-bold"}>
                                            {totalNumberOfItems}
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
                                <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                    <div className={"w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Ship To:
                                        </h3>
                                    </div>
                                    <div className={"w-7/12 lg:w-8/12"}>
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


                                <div className={"flex border-b-[1px] border-gray-300 py-5"}>
                                    <div className={"w-5/12 lg:w-4/12"}>
                                        <h3 className={"font-semibold"}>
                                            Payment Method:
                                        </h3>
                                    </div>
                                    <div className={"w-7/12 lg:w-8/12"}>
                                        <div className={"flex items-center text-sm"}>
                                            <div>
                                                {
                                                    paymentMethod === "PayPal" ? (
                                                        <PayPal width={"22"} height={"26"}/>
                                                    ) : (
                                                        <FaCreditCard className={"text-2xl"}/>
                                                    )
                                                }

                                            </div>
                                            <span className={"pl-2"}>
                                            {paymentMethod}
                                        </span>
                                        </div>
                                    </div>
                                </div>


                                <div className={"py-5"}>
                                    <h3 className={"font-semibold"}>
                                        Review Items:
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


                            <div className={"p-3 pt-5 lg:pl-10 lg:w-5/12"}>
                                <div className="card bg-white shadow-xl">
                                    <div className="pt-8 px-8">
                                        <div className="card-actions justify-center">
                                            <button
                                                onClick={checkoutHandler}
                                                disabled={cartItems.length === 0}
                                                className="btn btn-warning rounded-xl">
                                                Place your order
                                            </button>
                                        </div>
                                        <div className={"border-b-[1px] border-gray-300 mt-5 mb-3"}/>
                                        <div className={"flex flex-col"}>
                                            <h3 className={"pb-5 text-xl font-bold"}>
                                                Order Summary
                                            </h3>
                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                             <span className="">
                                                Items
                                                ({totalNumberOfItems}):
                                            </span>
                                                <span className="pl-2">
                                            ${itemsPrice.toFixed(2)}
                                            </span>
                                            </div>
                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                             <span className="">
                                                Shipping & Handling:
                                            </span>
                                                <span className="pl-2">
                                            ${shippingPrice.toFixed(2)}
                                            </span>
                                            </div>
                                            <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                             <span className="">
                                                Total before tax:
                                            </span>
                                                <span className="pl-2">
                                            ${(itemsPrice + shippingPrice).toFixed(2)}
                                            </span>
                                            </div>
                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
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
                                        className={"flex justify-between font-bold text-xl mx-8 py-8 border-b-[1px] border-gray-300"}>
                                         <span className="text-red-600">
                                            Order Total:
                                        </span>
                                        <span className="text-red-600">
                                        ${(taxPrice + shippingPrice + itemsPrice).toFixed(2)}
                                        </span>
                                    </div>

                                        {
                                            discount ? (
                                                <div className={"px-8 py-10"}>
                                                    <div className={"w-full"}>
                                                        <div className={"w-full text-sm font-semibold flex items-center justify-around text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]"}>
                                                            <span>
                                                                 Discount code has been applied! &#x1F389;
                                                            </span>
                                                            <button onClick={submitRemoveDiscountCode} className={"hover:opacity-80 cursor-pointer rounded-full border-2 border-[#27B1FFFF] p-[3px]"}>
                                                                <FaTimes className={"h-2 w-2"} fill={"#27b1ff"}/>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={"px-8 py-8"}>
                                                    <label className={"text-sm font-semibold flex flex-wrap items-center"}>
                                                        <span>
                                                            Have a discount code?
                                                        </span>
                                                    </label>
                                                    <div className={"flex justify-between"}>
                                                        <input className={"text-[16px] input input-bordered input-sm w-full max-w-xs border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"} value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} type={"text"}/>
                                                        <div className={"pl-10"}>
                                                            <button onClick={submitApplyDiscountCode} className={"btn btn-sm btn-neutral"}>
                                                                Apply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
};

export default CheckoutPage;