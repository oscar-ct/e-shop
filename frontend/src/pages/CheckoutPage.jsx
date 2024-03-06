import {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import {useDispatch, useSelector} from "react-redux";
import {
    useCreateOrderMutation,
    useGetPayPalClientIdQuery,
    usePayOrderMutation,
    useVerifyAmountMutation
} from "../slices/ordersApiSlice";
import {useValidateDiscountCodeMutation} from "../slices/productsApiSlice";
import {setLoading} from "../slices/loadingSlice";
import {applyDiscountCode, clearCartItems, removeDiscountCode} from "../slices/cartSlice";
import Message from "../components/Message";
import CheckoutItem from "../components/CheckoutItem";
import {ReactComponent as PayPal} from "../icons/paypal-icon.svg";
import {FaCreditCard, FaEdit} from "react-icons/fa";
import BackButton from "../components/BackButton";
import Meta from "../components/Meta";
import {toast} from "react-hot-toast";
import {PayPalButtons, usePayPalScriptReducer} from "@paypal/react-paypal-js";
import NotFoundPage from "./NotFoundPage";


const CheckoutPage = () => {

    const {userData} = useSelector(function (state) {
        return state.auth;
    });
    const cartState = useSelector(function (state) {
        return state.cart;
    });

    const { discount, discountKey, shippingAddress, paymentMethod, cartItems, taxPrice, shippingPrice, itemsPrice, totalPrice } = cartState;

    const [discountCode, setDiscountCode] = useState("");
    const [orderSubmitted, setOrderSubmitted] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [payOrder,
        // {isLoading: loadingPay}
    ] = usePayOrderMutation();
    const [createOrder, {error}] = useCreateOrderMutation();
    const [validateDiscountCode] = useValidateDiscountCodeMutation();
    const [verifyAmount] = useVerifyAmountMutation();

    const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery();
    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const totalNumberOfItems = cartItems.reduce(function (acc, product) {
        return (acc + product.quantity);
    }, 0);

    useEffect(function () {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        "client-id": paypal.clientId,
                        currency: "USD",
                        enableFunding: "venmo"
                    }
                });
                paypalDispatch({type: "setLoadingStatus", value: "pending"});
            }
            if (!window.paypal) {
                loadPayPalScript();
            }

        }
    }, [paypal, paypalDispatch, loadingPayPal, errorPayPal]);

    useEffect(function () {
        if (Object.keys(shippingAddress).length === 0 && !orderSubmitted) {
            navigate("/shipping");
        } else if (!paymentMethod && !orderSubmitted) {
            navigate("/payment");
        }
    }, [navigate, shippingAddress, paymentMethod, orderSubmitted]);

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

    const checkoutHandler = async () => {
        setOrderSubmitted(true);
        dispatch(setLoading(true));
        const res = await validateDiscountCode({code: discountKey}).unwrap();
        try {
            const order = await createOrder({
                orderItems: cartItems,
                shippingAddress: shippingAddress,
                paymentMethod: paymentMethod,
                itemsPrice: itemsPrice,
                shippingPrice: shippingPrice,
                taxPrice: taxPrice,
                totalPrice: totalPrice,
                validCode : res.validCode,
            }).unwrap();
            dispatch(clearCartItems());
            // window.location.href = `/order/${order._id}`;
            navigate(`/order/${order._id}`);
            dispatch(setLoading(false));
        } catch (e) {
            dispatch(setLoading(false));
            console.log(e || error);
        }
    };

    const createNewOrder = async (data, actions) => {
        try {
            const discount = await validateDiscountCode({code: discountKey}).unwrap();
            const totalPriceFromBackend = await verifyAmount({orderItems: cartItems, validCode : discount.validCode}).unwrap();
            if (totalPriceFromBackend !== totalPrice) {
                // console.log("Prices DO NOT match!!");
                toast.error("Something went wrong, please try again later.");
                return
            }
            return await actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            value: (Number(totalPriceFromBackend)).toFixed(2),
                        }
                    }
                ]
            });
        } catch (e) {
            console.log(e.error);
        }
    };

    const onApprove = (data, actions) => {
        setOrderSubmitted(true);
        dispatch(setLoading(true));
        try {
            return actions.order.capture().then(async function (details) {
                const res = await validateDiscountCode({code: discountCode}).unwrap();
                const order = await createOrder({
                    orderItems: cartItems,
                    shippingAddress: shippingAddress,
                    paymentMethod: paymentMethod,
                    itemsPrice: itemsPrice,
                    shippingPrice: shippingPrice,
                    taxPrice: taxPrice,
                    totalPrice: totalPrice,
                    validCode : res.validCode,
                }).unwrap();
                const newOrder = await payOrder({orderId: order._id, details}).unwrap();
                navigate(`/order/${newOrder._id}`);
                dispatch(clearCartItems());
                // window.location.href = `/order/${newOrder._id}`;
                dispatch(setLoading(false));
            });
        } catch (e) {
            console.log(e);
            dispatch(setLoading(false));
        }
    };

    const onError = (error) => {
        console.log(error);
        // toast.error(error);
    };

    return (
        <>
            <Meta title={"Order Review"}/>
            {
                cartItems.length === 0 ? (
                    <div className={"px-2"}>
                        <BackButton/>
                        <div className={"lg:pt-4 pt-20 px-2"}>
                            <Message variant={"info"}>
                                You have no items in your cart.  Click <Link to={"/"} className={"link link-primary"}>here</Link> to continue shopping.
                            </Message>
                        </div>
                    </div>
                ) : cartItems.length !== 0 && Object.keys(shippingAddress).length === 0 && paymentMethod === null ? (
                    <NotFoundPage/>
                ) : (
                    <div>
                        <CheckoutSteps/>
                        <div className={"pt-3 sm:pt-0 mb-10 flex-col flex lg:flex-row w-full"}>
                            <div className={"lg:w-7/12 card bg-white h-min"}>
                                <div className={"pt-7"}>
                                    <h1
                                        // style={{ background: "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(216,228,253,1) 100%)"}}
                                        className={"py-2 text-center text-3xl md:text-2xl font-semibold ibmplex bg-white md:bg-neutral md:text-white"}>
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
                                        <div className={"w-5/12 lg:w-4/12"}>
                                            <h3 className={"font-semibold"}>
                                                Ship To:
                                            </h3>
                                        </div>
                                        <div className={"w-7/12 lg:w-8/12"}>
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
                                    <div className={"flex border-b-[1px] border-gray-300 py-5"}>
                                        <div className={"w-5/12 lg:w-4/12"}>
                                            <h3 className={"font-semibold"}>
                                                Payment Method:
                                            </h3>
                                        </div>
                                        <div className={"w-7/12 lg:w-8/12"}>
                                            <div className={"flex justify-between"}>
                                                <div className={"flex items-center text-sm"}>
                                                    <div>
                                                        {
                                                            paymentMethod === "PayPal / Credit Card" ? (
                                                                <PayPal width={"22"} height={"26"}/>
                                                            ) : (
                                                                <FaCreditCard className={"text-2xl"}/>
                                                            )
                                                        }
                                                    </div>
                                                    <span className={"pl-2"}>{paymentMethod}</span>
                                                </div>
                                                <div>
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
                                                <span className={"text-sm"}>
                                                    Your order qualifies for FREE shipping!
                                                </span>
                                            </Message>
                                        </div>
                                    ) : (
                                        <div className={"pb-3 px-2 sm:px-0"}>
                                            <Message variant={"info"}>
                                                <span className={"text-sm"}>
                                                    Add <span className={"font-bold"}>${(100 - totalPrice).toFixed(2)}</span> to your order to qualify for FREE shipping.
                                                </span>
                                            </Message>
                                        </div>
                                    )
                                }
                                <div className="bg-white border">
                                    <div className="pt-8 px-8">
                                        <div className={"flex flex-col"}>
                                            <h3 className={"pb-5 text-xl font-bold"}>
                                                Order Summary
                                            </h3>
                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                <span>Items({totalNumberOfItems}):</span>
                                                <span className="pl-2">${itemsPrice}</span>
                                            </div>
                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                <span>Shipping flat rate:</span>
                                                <span className="pl-2">${shippingPrice}</span>
                                            </div>
                                            <span className={"self-end w-16 my-1 border-b-2 border-grey-500"}/>
                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                <span>Total before tax:</span>
                                                <span className="pl-2">${Number(itemsPrice + shippingPrice).toFixed(2)}</span>
                                            </div>
                                            <div className={"flex justify-between font-semibold text-sm my-1"}>
                                                <span>Estimated tax to be collected:</span>
                                                <span className="pl-2">${taxPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"flex justify-between font-bold text-xl px-8 pt-8"}>
                                        <span className="text-red-600">Order Total:</span>
                                        <span className="text-red-600">${totalPrice}</span>
                                    </div>
                                    <div className={"px-8 pt-8 pb-6"}>
                                    {
                                        discount ? (
                                            <div className={"w-full flex items-center justify-between"}>
                                                <span className={"text-sm"}>Congrats! Discount code applied!</span>
                                                <div className={"pl-10"}>
                                                    <button onClick={() => submitRemoveDiscountCode()} className={"btn btn-xs rounded-full btn-error px-4"}>
                                                        remove
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={"flex flex-col items-end md:items-center md:flex-row md:justify-between lg:flex-col lg:items-end xl:items-center xl:flex-row xl:justify-between"}>
                                                    <input
                                                        className={"bg-white text-[16px] input input-bordered input-sm w-full max-w-xs border border-gray-300 rounded-sm focus:outline-none focus:border-blue-400"}
                                                        placeholder={"Have a discount code?"}
                                                        value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} type={"text"}
                                                    />
                                                    <div className={"pt-3 md:pt-0 lg:pt-3 xl:pt-0 xl:pl-10"}>
                                                        <button onClick={submitApplyDiscountCode} className={"btn btn-xs rounded-full btn-neutral px-4 truncate"}>
                                                            Apply code
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                        <div className={"border-b-[1px] border-gray-300 my-8"}/>
                                        {
                                            !isPending && (
                                                <PayPalButtons
                                                    forceReRender={[totalPrice]}
                                                    createOrder={createNewOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                    style={{shape: "pill", height: 40}}
                                                >
                                                </PayPalButtons>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className={"pt-3 px-2 sm:px-0"}>
                                    <div className={"alert flex rounded-md w-full"}>
                                        <div className={"flex items-center justify-start w-full"}>
                                            <div className={"mr-1"}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            </div>
                                            <div className={"w-full flex justify-between items-center"}>
                                                <span className={"text-sm"}>Save order and pay later?</span>
                                                <button
                                                    onClick={checkoutHandler}
                                                    disabled={cartItems.length === 0}
                                                    className={"btn btn-xs btn-neutral rounded-full !px-4"}
                                                >Save</button>
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