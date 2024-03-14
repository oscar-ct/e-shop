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

    /// Redux Global State ////
    const {userData} = useSelector( (state) => state.auth);
    const cartState = useSelector( (state) => state.cart);
    const { discount, discountKey, shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, itemsPrice, totalPrice
    } = cartState;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [createOrder] = useCreateOrderMutation();
    const [validateDiscountCode] = useValidateDiscountCodeMutation();

    const [discountCode, setDiscountCode] = useState("");

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    /// useEffect Hooks ////

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
            toast.error("Invalid discount code :(");
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
            const res = await validateDiscountCode({code: discountKey}).unwrap();
            const order = await createOrder({
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
    }

    /// Creates and saves order for future payment ////
    const createNewUnpaidOrder = async () => {
        dispatch(setLoading(true));
        const orderId = await createNewOrder();
        if (orderId) {
            navigate(`/order/${orderId}/payment?paypal=unsuccessful`);
        }
        dispatch(setLoading(false));
    }


    return (
        <>
            <Meta title={"Order Review"}/>
            {
                cartItems.length !== 0 && (Object.keys(shippingAddress).length !== 0 || paymentMethod !== null) && (
                    <div>
                        <CheckoutSteps/>
                        <div className={"pt-0 mb-10 flex-col flex lg:flex-row w-full"}>
                            <div className={"lg:w-7/12 card bg-white h-min"}>
                                <div className={"pt-3 sm:pt-7"}>
                                    <h1
                                        // style={{ background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(216,228,253,1) 100%)"}}
                                        className={"hidden md:block py-2 text-center text-3xl md:text-2xl font-semibold ibmplex bg-white md:bg-neutral md:text-white"}>
                                        Checkout (
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
                                <div className={"border px-4 sm:px-7 py-4"}>
                                    <div className={"flex border-b-[1px] border-gray-300 py-3"}>
                                        <div className={"w-3/12 sm:w-4/12"}>
                                            <h3 className={"font-semibold"}>
                                                Ship To:
                                            </h3>
                                        </div>
                                        <div className={"w-9/12 sm:w-8/12"}>
                                            <div className={"flex justify-between"}>
                                                <div className={"flex flex-col text-sm"}>
                                                    <span>{userData.name}</span>
                                                    <span>{shippingAddress.address}</span>
                                                    <span>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</span>
                                                    <span>{shippingAddress.country}</span>
                                                </div>
                                                <div>
                                                    <Link to={"/shipping"}>
                                                        <FaEdit/>
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
                                                                <PayPal width={"50"} height={"50"}/>
                                                            ) :  paymentMethod === "Stripe / Credit Card" ? (
                                                                <StripeLogo className={"w-20"}/>
                                                            ) : ""
                                                        }
                                                    </div>
                                                </div>
                                                <div className={"flex items-center"}>
                                                    <Link to={"/payment"}>
                                                        <FaEdit/>
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
                            <div className={"p-3 pt-10 md:pt-7 lg:pl-10 lg:w-5/12"}>
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
                                    <div className="pt-8 px-8">
                                        <div className={"flex flex-col"}>
                                            <h3 className={"pb-5 text-xl font-semibold"}>
                                                Order Summary
                                            </h3>
                                            <div className={"flex justify-between text-sm my-1"}>
                                                <span>Items({totalNumberOfItems}):</span>
                                                <span className="pl-2">${itemsPrice}</span>
                                            </div>
                                            <div className={"flex justify-between text-sm my-1"}>
                                                <span>Shipping flat rate:</span>
                                                <span className="pl-2">${shippingPrice}</span>
                                            </div>
                                            <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
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
                                    <div className={"flex justify-between font-semibold text-xl px-8 pt-8"}>
                                        <span className="text-red-600">Order Total:</span>
                                        <span className="text-red-600">${totalPrice}</span>
                                    </div>
                                    <div className={"px-8 pt-8 pb-6"}>
                                        {
                                            discount ? (
                                                <div className={"w-full flex items-center justify-between"}>
                                                    <span className={"text-sm"}>Discount code applied :D</span>
                                                    <div className={"pl-10"}>
                                                        <button onClick={() => submitRemoveDiscountCode()}
                                                                className={"btn btn-xs rounded-full btn-error px-4"}>
                                                            remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div
                                                        className={"flex flex-col items-end md:items-center md:flex-row md:justify-between lg:flex-col lg:items-end xl:items-center xl:flex-row xl:justify-between"}>
                                                        <input
                                                            className={"bg-white text-[16px] input input-bordered input-sm w-full max-w-xs border border-gray-300 rounded-sm focus:outline-none focus:border-blue-400"}
                                                            placeholder={"Have a discount code?"}
                                                            value={discountCode}
                                                            onChange={(e) => setDiscountCode(e.target.value)}
                                                            type={"text"}
                                                        />
                                                        <div className={"pt-3 md:pt-0 lg:pt-3 xl:pt-0 xl:pl-10"}>
                                                            <button onClick={submitApplyDiscountCode}
                                                                    className={"btn btn-xs rounded-full btn-neutral px-4 truncate normal-case"}>
                                                                Apply Code
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                        <div className={"border-b-[1px] border-gray-300 mb-8 mt-4"}/>

                                        {
                                            paymentMethod === "PayPal / Credit Card" && (
                                                <PaypalCheckout createNewOrder={() => createNewOrder()}/>
                                            )
                                        }
                                        {
                                            paymentMethod === "Stripe / Credit Card" && (
                                                <StripeCheckout/>
                                            )
                                        }

                                    </div>
                                </div>
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
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
};

export default CheckoutPage;