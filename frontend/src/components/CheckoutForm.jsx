import { useState, useEffect } from "react";
import {
    PaymentElement,
        useStripe,
        useElements
} from "@stripe/react-stripe-js";
import CustomBtn from "./CustomBtn";
import {useCreateStripePaymentIntentMutation} from "../slices/stripeApiSlice";
import {
    useCreateOrderMutation,
    usePayOrderMutation,
    useVerifyAmountMutation
} from "../slices/ordersApiSlice";
import {useValidateDiscountCodeMutation} from "../slices/productsApiSlice";
import {useSelector, useDispatch} from "react-redux";
import {toast} from "react-hot-toast";
import {clearCartItems} from "../slices/cartSlice";
import {useNavigate} from "react-router-dom";
import {setLoading} from "../slices/loadingSlice";

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cartState = useSelector(function (state) {
        return state.cart;
    });

    const { discountKey, cartItems, totalPrice, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice} = cartState;

    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState();
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [clientHasSecret, setClientHasSecret] = useState(false);

    const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();

    const [validateDiscountCode] = useValidateDiscountCodeMutation();
    const [verifyAmount] = useVerifyAmountMutation();
    const [createOrder] = useCreateOrderMutation();
    const [payOrder,
        // {isLoading: loadingPay}
    ] = usePayOrderMutation();

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
        stripe.retrievePaymentIntent(clientSecret).then(async ({paymentIntent}) => {
            switch (paymentIntent.status) {
                case "succeeded": {
                    setMessage("Payment succeeded!");
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
                    const newOrder = await payOrder({orderId: order._id}).unwrap();
                    navigate(`/order/${newOrder._id}`);
                    dispatch(setLoading(false));
                    dispatch(clearCartItems());
                    break;
                }
                case "processing": {
                    setMessage("Your payment is processing.");
                    break;
                }
                case "requires_payment_method": {
                    setMessage("Your payment was not successful, please try again.");
                    break;
                }
                default: {
                    setMessage("Something went wrong.");
                    break;
                }
            }
        });
    }, [stripe, cartItems, createOrder, discountKey, dispatch, itemsPrice, navigate, payOrder, paymentMethod, shippingAddress, shippingPrice, taxPrice, totalPrice, validateDiscountCode]);

    const handleError = (error) => {
        dispatch(setLoading(false));
        setLoadingBtn(false);
        setErrorMessage(error.message);
    }

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
        const discount = await validateDiscountCode({code: discountKey}).unwrap();
        const totalPriceFromBackend = await verifyAmount({orderItems: cartItems, validCode : discount.validCode}).unwrap();
        if (totalPriceFromBackend !== totalPrice) {
            toast.error("Something went wrong, please try again later.");
            dispatch(setLoading(false));
            return
        }
        const {clientSecret} = await createStripePaymentIntent({totalPriceFromBackend}).unwrap();

        // Confirm the PaymentIntent using the details collected by the Payment Element
        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: 'http://localhost:5173/submitorder',
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
        layout: "tabs"
    }

    return (
        <form onSubmit={handleSubmit}>
            {
                !clientHasSecret && (
                    <>
                        <PaymentElement className={"pb-6"} options={paymentElementOptions}/>
                        <div className={"flex justify-center pb-6"}>
                            <CustomBtn customClass={"w-full flex justify-center items-center"} type={"submit"}
                                       isDisabled={loadingBtn || !stripe || !elements}>
                                {
                                    loadingBtn ? <span className="loading loading-bars loading-sm"/> : "Pay Now"
                                }
                            </CustomBtn>
                        </div>
                    </>
                )
            }
            {
                errorMessage || message && (
                    <div className={"text-center leading-[20px] text-lg"}>
                        {errorMessage || message}
                    </div>
                )
            }
        </form>
    );
};

export default CheckoutForm;