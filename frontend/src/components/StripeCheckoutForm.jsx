import {useState, useEffect, useCallback} from "react";
import {PaymentElement, LinkAuthenticationElement, useStripe, useElements} from "@stripe/react-stripe-js";
import CustomBtn from "./CustomBtn";
import {useCreateStripePaymentIntentMutation} from "../slices/stripeApiSlice";
import {useCreateOrderMutation, usePayOrderMutation, useVerifyAmountMutation} from "../slices/ordersApiSlice";
import {useValidateDiscountCodeMutation} from "../slices/productsApiSlice";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-hot-toast";
import {removeDiscountCode} from "../slices/cartSlice";
import {useNavigate} from "react-router-dom";
import {setLoading} from "../slices/loadingSlice";

const StripeCheckoutForm = ({existingOrder}) => {

    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartState = useSelector(function (state) {
        return state.cart;
    });
    const {userData} = useSelector( (state) => state.auth);

    const { discountKey, cartItems, totalPrice, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, guestData} = cartState;

    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [clientHasSecret, setClientHasSecret] = useState(false);
    const [paymentFailed, setPaymentFailed] = useState(false);

    const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();

    const [validateDiscountCode] = useValidateDiscountCodeMutation();
    const [verifyAmount] = useVerifyAmountMutation();
    const [createOrder] = useCreateOrderMutation();
    const [payOrder,
        // {isLoading: loadingPay}
    ] = usePayOrderMutation();

    const placeNewOrder = useCallback(async () => {
        const res = await validateDiscountCode({code: discountKey}).unwrap();
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
    }, [cartItems, createOrder, discountKey, itemsPrice, paymentMethod, shippingAddress, shippingPrice, taxPrice, totalPrice, validateDiscountCode, userData, guestData]);

    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
        if (!clientSecret) {
            return;
        } else {
            setClientHasSecret(true);
            dispatch(setLoading(true));
        }
        if (!stripe) {
            return;
        }
        if (clientSecret) {
            stripe.retrievePaymentIntent(clientSecret).then(async ({paymentIntent}) => {
                switch (paymentIntent.status) {
                    case "succeeded": {
                        setMessage("Payment succeeded!");
                        const details = {
                            id: paymentIntent.id,
                            status: paymentIntent.status,
                            update_time: paymentIntent.created.toString()
                        };
                        if (!existingOrder) {
                            const orderId = await placeNewOrder();
                            if (orderId) {
                                const order = await payOrder({orderId: orderId, details}).unwrap();
                                if (order) {
                                    navigate(`/order/${order._id}/payment?stripe=successful`);
                                    // window.location.href = `/order/${data}/payment?stripe=successful`;
                                }
                            }
                        } else {
                            await payOrder({orderId: existingOrder._id, details}).unwrap();
                            // if (order) {
                            //     window.location.href = `/order/${order._id}`;
                            // }
                        }
                        dispatch(setLoading(false));
                        dispatch(removeDiscountCode());
                        break;
                    }
                    case "processing": {
                        setMessage("Your payment is processing.");
                        break;
                    }
                    case "requires_payment_method": {
                        setPaymentFailed(true);
                        setMessage("Your payment was not successful, please try again.");
                        dispatch(setLoading(false));
                        break;
                    }
                    default: {
                        setMessage("Something went wrong.");
                        setPaymentFailed(true);
                        dispatch(setLoading(false));
                        break;
                    }
                }
            });
        }
    }, [stripe, dispatch, navigate, placeNewOrder, existingOrder, payOrder]);

    const handleError = (error) => {
        dispatch(setLoading(false));
        setLoadingBtn(false);
        setErrorMessage(error.message);
    };

    const handlePriceError = () => {
        toast.error("Something went wrong, please try again later.");
        setLoadingBtn(false);
        dispatch(setLoading(false));
    };

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        if (!stripe) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        dispatch(setLoading(true));
        setLoadingBtn(true);
        // Trigger form validation and wallet collection
        const {error: submitError} = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }
        // Create the PaymentIntent and obtain clientSecret
        let isDiscounted;
        if (!existingOrder) {
            const discount = await validateDiscountCode({code: discountKey}).unwrap();
            isDiscounted = discount.validCode;
        }
        let totalPriceFromBackend = await verifyAmount({
            orderItems: existingOrder ? existingOrder.orderItems.filter((item) => !item.isCanceled) : cartItems,
            validCode : existingOrder ? existingOrder.freeShipping : isDiscounted,
        }).unwrap();
        totalPriceFromBackend = Number(totalPriceFromBackend);

        if (!existingOrder) {
            if (totalPriceFromBackend !== Number(totalPrice)) {
                handlePriceError();
                return;
            }
        } else {
            if (totalPriceFromBackend !== existingOrder.totalPrice) {
                handlePriceError();
                return;
            }
        }

        const {clientSecret} = await createStripePaymentIntent({totalPriceFromBackend}).unwrap();

        // Confirm the PaymentIntent using the details collected by the Payment Element
        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: existingOrder ? `${window.location.origin}/order/${existingOrder._id}` : `${window.location.origin}/submitorder`,
            },
        });
        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the payment. Show the error to your customer (for example, payment details incomplete)
            handleError(error);
        } else {
            console.log("This is active")
            // Your customer is redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer is redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    const linkAuthenticationElementOptions = {
        defaultValues: {
            email: userData ? userData.email : ""
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {
                !clientHasSecret && (
                    <>
                        <LinkAuthenticationElement options={linkAuthenticationElementOptions} className={"pb-5"}/>
                        <PaymentElement className={"pb-3"} options={paymentElementOptions}/>
                        <div className={"flex justify-center"}>
                            <CustomBtn customClass={"w-full flex justify-center items-center my-3"} type={"submit"}
                                       isDisabled={loadingBtn || !stripe || !elements}>
                                {
                                    loadingBtn ? <span className="loading loading-bars loading-sm"/> : `Pay Now - ($${existingOrder ? existingOrder.totalPrice : totalPrice})`
                                }
                            </CustomBtn>
                        </div>
                    </>
                )
            }
            {
                (errorMessage || message) && (
                    <div className={`text-center leading-[20px] text-lg ${errorMessage && "pt-4"}`}>
                        {errorMessage || message}
                    </div>
                )
            }
            {
                paymentFailed && (
                    <div className={"pt-6"}>
                        <CustomBtn customClass={"w-full"} type={"button"} onClick={(e) => {
                            e.preventDefault();
                            window.location.href = existingOrder ? `${window.location.origin}/order/${existingOrder._id}` : `${window.location.origin}/submitorder`
                        }}>
                            Try Again
                        </CustomBtn>
                    </div>
                )
            }
        </form>
    );
};

export default StripeCheckoutForm;