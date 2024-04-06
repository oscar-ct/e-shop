import {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import {useDispatch, useSelector} from "react-redux";
import {useCreateOrderMutation,} from "../slices/ordersApiSlice";
import {useValidateDiscountCodeMutation} from "../slices/productsApiSlice";
import {setLoading} from "../slices/loadingSlice";
import {applyDiscountCode, removeDiscountCode} from "../slices/cartSlice";
import Message from "../components/Message";
import CheckoutItem from "../components/CheckoutItem";
import {ReactComponent as PayPal} from "../icons/paypal-logo.svg";
import {ReactComponent as StripeLogo} from "../icons/stripe-logo.svg";
import {FaEdit} from "react-icons/fa";
import Meta from "../components/Meta";
import {toast} from "react-hot-toast";
import PaypalCheckout from "../components/PaypalCheckout";
import StripeCheckout from "../components/StripeCheckout";


const CheckoutPage = () => {

    const {userData} = useSelector( (state) => state.auth);
    const cartState = useSelector( (state) => state.cart);
    const { discount, discountKey, shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, itemsPrice, totalPrice, guestData,
    } = cartState;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [createOrder] = useCreateOrderMutation();
    const [validateDiscountCode] = useValidateDiscountCodeMutation();

    const [discountCode, setDiscountCode] = useState("");
    const [discountLabelActive, setDiscountLabelActive] = useState(false);
    const [discountLabelHover, setDiscountLabelHover] = useState(false);

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    useEffect( () => {
        if (cartItems.length === 0) {
            navigate("/cart");
        } else if (!paymentMethod) {
            navigate("/payment");
        } else if (Object.keys(shippingAddress).length === 0 ) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress, paymentMethod, cartItems.length]);

    /// Discount Code Handlers ////
    const submitApplyDiscountCode = async () => {
        const res = await validateDiscountCode({code: discountCode}).unwrap();
        if (!res.validCode) {
            dispatch(setLoading(true));
            toast.remove();
            setTimeout(() => {
                dispatch(setLoading(false));
                toast.error("Invalid discount code :(");
            }, 1000)
        } else {
            toast.success("You are now receiving FREE SHIPPING!");
            dispatch(applyDiscountCode(discountCode));
        }
    };
    const submitRemoveDiscountCode = () => {
        setDiscountCode("");
        dispatch(removeDiscountCode());
    };


    /// Helper /////
    const createNewOrder = async () => {
        try {
            let user;
            if (userData) {
                user = {
                    id: userData._id,
                    name: userData.name,
                    email: userData.email,
                };
            } else {
                user = {
                    name: shippingAddress.name,
                    email: guestData,
                };
            }
            const res = await validateDiscountCode({code: discountKey}).unwrap();
            const order = await createOrder({
                user,
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                validCode: res.validCode,
            }).unwrap();
            return order._id;
        } catch (e) {
            console.log(e.data.message);
            toast.error(e.data.message);
        }
    };

    /// Creates and saves order for future payment ////
    const createNewUnpaidOrder = async () => {
        dispatch(setLoading(true));
        const orderId = await createNewOrder();
        if (orderId) {
            navigate(`/order/${orderId}/payment?${paymentMethod === "Stripe / Credit Card" ? "stripe" : "paypal"}=unsuccessful`);
        }
        dispatch(setLoading(false));
    };


    return (
        <>
            <Meta title={"Order Review"}/>
            {
                cartItems.length !== 0 && (Object.keys(shippingAddress).length !== 0 || paymentMethod !== null) && (
                    <div>
                        <CheckoutSteps/>
                        <div className={"pt-0 flex-col flex lg:flex-row w-full 2xl:container mx-auto"}>
                            <div className={"lg:w-7/12 h-min md:pl-3 md:pr-3 lg:pr-0"}>
                                <div className={"pt-3 sm:pt-7"}>
                                    <h1 className={"hidden md:block py-2 text-center text-3xl md:text-2xl font-semibold ibmplex bg-white md:bg-zinc-700 md:text-white"}>
                                        Your Order (
                                        <span className={"text-2xl md:text-xl md:text-white md:font-light"}>
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
                                <div className={"bg-white border px-4 sm:px-7 py-4"}>
                                    {
                                        !userData && guestData && (
                                            <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                                <div className={"w-3/12 sm:w-4/12 flex items-center"}>
                                                    <h3 className={"font-semibold"}>
                                                        Email:
                                                    </h3>
                                                </div>
                                                <div className={"w-9/12 sm:w-8/12"}>
                                                    <div className={"flex justify-between items-center"}>
                                                        <div className={"flex flex-col text-sm"}>
                                                            <span>{guestData}</span>
                                                        </div>
                                                        <div>
                                                            <Link to={"/shipping"}>
                                                                <FaEdit className={"w-3.5"}/>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                        <div className={"w-3/12 sm:w-4/12"}>
                                            <h3 className={"font-semibold"}>
                                                Ship To:
                                            </h3>
                                        </div>
                                        <div className={"w-9/12 sm:w-8/12"}>
                                            <div className={"flex justify-between"}>
                                                <div className={"flex flex-col text-sm"}>
                                                    <span>{shippingAddress.name}</span>
                                                    <span>{shippingAddress.address}</span>
                                                    <span>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</span>
                                                    <span>{shippingAddress.country}</span>
                                                </div>
                                                <div>
                                                    <Link to={"/shipping"}>
                                                        <FaEdit className={"w-3.5"}/>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                        <div className={"w-5/12 sm:w-4/12 flex items-center"}>
                                            <h3 className={"font-semibold"}>
                                                Payment Service:
                                            </h3>
                                        </div>
                                        <div className={"w-7/12 sm:w-8/12"}>
                                            <div className={"flex justify-between"}>
                                                <div className={"flex items-center"}>
                                                    <div>
                                                        {
                                                            paymentMethod === "PayPal / Credit Card" ? (
                                                                <PayPal width={"40"} height={"40"}/>
                                                            ) :  paymentMethod === "Stripe / Credit Card" ? (
                                                                <StripeLogo className={"w-16"}/>
                                                            ) : ""
                                                        }
                                                    </div>
                                                </div>
                                                <div className={"flex items-center"}>
                                                    <Link to={"/payment"}>
                                                        <FaEdit className={"w-3.5"}/>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"py-5"}>
                                        <h3 className={"font-semibold"}>
                                            Order Item(s):
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
                            </div>
                            <div className={"p-3 lg:pt-7 lg:pl-5 lg:w-5/12"}>
                                {
                                    totalPrice > 100 || discount ? (
                                        <div className={"pb-3 px-2 sm:px-0"}>
                                            <Message variant={"success"}>
                                                <span className={"text-sm"}>Your order qualifies for FREE shipping!</span>
                                            </Message>
                                        </div>
                                    ) : (
                                        <div className={"pb-3 px-2 sm:px-0"}>
                                            <Message variant={"info"}>
                                                <span className={"text-sm"}>Add <span
                                                    className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.
                                                </span>
                                            </Message>
                                        </div>
                                    )
                                }
                                    <div className="bg-white border">
                                        <h3 className={"pt-5 pb-0 md:py-2 ibmplex text-2xl md:bg-zinc-700 md:text-white font-semibold text-center"}>
                                            Order Summary
                                        </h3>
                                        <div className="pt-0 px-6">
                                            <div className={"flex flex-col md:pt-6"}>
                                                <div className={"md:hidden border-b-[1px] border-gray-300 mt-5 mb-3"}/>
                                                <div className={"flex justify-between text-sm my-1"}>
                                                    <span>Items({totalNumberOfItems}):</span>
                                                    <span className="pl-2">${itemsPrice}</span>
                                                </div>
                                                <div className={"flex justify-between text-sm my-1"}>
                                                    <span>Shipping flat rate:</span>
                                                    <span className="pl-2">${shippingPrice}</span>
                                                </div>
                                                <span className={"self-end w-16 my-1 border-b-[1px] border-grey-500"}/>
                                                <div className={"flex justify-between text-sm my-1"}>
                                                    <span>Total before tax:</span>
                                                    <span
                                                        className="pl-2">${Number(itemsPrice + shippingPrice).toFixed(2)}</span>
                                                </div>
                                                <div className={"flex justify-between text-sm my-1"}>
                                                    <span>Estimated tax to be collected:</span>
                                                    <span className="pl-2">${taxPrice}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"flex justify-between font-semibold text-lg px-6 pt-5 pb-6"}>
                                            <span className="text-red-600">Order Total:</span>
                                            <span className="text-red-600">${totalPrice}</span>
                                        </div>
                                        <div className={"px-6 pb-4"}>
                                            {
                                                discount ? (
                                                    <div className={"pb-10 w-full flex items-center justify-between"}>
                                                        <span className={"text-sm font-semibold"}>Discount code applied :D</span>
                                                        <div className={"pl-10"}>
                                                            <button onClick={() => submitRemoveDiscountCode()}
                                                                    className={"btn btn-sm text-xs rounded-full px-4 normal-case"}>
                                                                Remove Discount
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className={"pb-10"}>
                                                        {/*{*/}
                                                        {/*    !discountLabelActive ? (*/}
                                                        {/*        <div className={"flex justify-start items-end h-11"}>*/}
                                                        {/*            <span onClick={() => setDiscountLabelActive(true)} className={"text-sm text-primary cursor-pointer"}>Have a discount code?</span>*/}
                                                        {/*        </div>*/}
                                                        {/*    ) : (*/}
                                                                <div className={"flex w-full items-end"}>
                                                                    <div className={`relative h-11 w-full`} >
                                                                        <input
                                                                            onMouseEnter={() => setDiscountLabelHover(true)}
                                                                            onMouseLeave={() => setDiscountLabelHover(false)}
                                                                            onFocus={() => setDiscountLabelActive(true)}
                                                                            // onBlur={() => discountCode.length === 0 && setDiscountLabelActive(false)}
                                                                            onBlur={() => discountCode.length === 0 && setDiscountLabelActive(false)}
                                                                            value={discountCode}
                                                                            onChange={(e) => setDiscountCode(e.target.value)}
                                                                            placeholder="Enter discount code"
                                                                            className={`${!discountLabelActive ? "cursor-pointer" : ""} text-[16px] lg:text-base peer h-full w-full rounded-none border-b border-gray-300 hover:border-gray-400 bg-transparent pt-4 pb-1.5 font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 placeholder-shown:text-sm focus:border-gray-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 placeholder:opacity-0 focus:placeholder:opacity-100`}/>
                                                                        <label
                                                                            className={`${discountLabelHover ? "text-gray-700" : "text-gray-500"} after:content[''] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-gray-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-[14px] peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:after:scale-x-100 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500`}>
                                                                            {discountLabelActive ? "Discount code" : "Have a discount code?"}
                                                                        </label>
                                                                    </div>
                                                                    {
                                                                        discountLabelActive && (
                                                                            <button
                                                                                onClick={submitApplyDiscountCode}
                                                                                className={"pl-5 text-xs"}
                                                                            >
                                                                                Apply
                                                                            </button>
                                                                        )
                                                                    }
                                                                </div>
                                                        {/*    )*/}
                                                        {/*}*/}
                                                    </div>
                                                )
                                            }


                                            {/*<div className={"border-b my-6"}/>*/}

                                            {
                                                paymentMethod === "PayPal / Credit Card" && (
                                                    <div className={"px-4"}>
                                                        <PaypalCheckout createNewOrder={() => createNewOrder()}/>
                                                    </div>
                                                )
                                            }
                                            {
                                                paymentMethod === "Stripe / Credit Card" && (
                                                    <>
                                                        <div className={"flex w-full justify-center items-center"}>
                                                            <div className={"flex justify-center items-center px-3 rounded-lg border-2 border-[#4f3cff]"}>
                                                                <span className={"ibmplex text-sm text-[#4f3cff]"}>Powered by</span>
                                                                <StripeLogo className={"w-16"}/>
                                                            </div>
                                                        </div>
                                                        <StripeCheckout/>
                                                    </>

                                                )
                                            }
                                        </div>
                                    </div>
                                {
                                    userData && (
                                        <div className={"pt-3 px-2 sm:px-0"}>
                                            <div className={"alert flex rounded-md w-full"}>
                                                <div className={"flex items-center justify-start w-full"}>
                                                    <div className={"mr-1"}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                             className="stroke-current shrink-0 w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                        </svg>
                                                    </div>
                                                    <div className={"w-full flex justify-between items-center"}>
                                                        <span className={"text-sm"}>Save order and pay later?</span>
                                                        <button
                                                            onClick={createNewUnpaidOrder}
                                                            disabled={cartItems.length === 0}
                                                            className={"btn btn-xs btn-neutral rounded-full !px-4 normal-case"}
                                                        >
                                                            Save Order
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
};

export default CheckoutPage;