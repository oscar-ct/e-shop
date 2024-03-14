import {Elements} from "@stripe/react-stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";
import {useEffect, useState} from "react";
import {applyPublishableKey} from "../slices/cartSlice";
import {loadStripe} from "@stripe/stripe-js/pure";
import {useDispatch, useSelector} from "react-redux";
import {useGetStripeClientIdQuery} from "../slices/stripeApiSlice";

const StripeCheckout = ({existingOrder}) => {

    const cartState = useSelector( (state) => state.cart);
    const { publishableKey } = cartState;

    const dispatch = useDispatch();

    const {data: stripeClientId} = useGetStripeClientIdQuery();

    useEffect(() => {
        if (!publishableKey && stripeClientId) {
            dispatch(applyPublishableKey(stripeClientId.clientId));
            setStripePromise(loadStripe(stripeClientId.clientId));
        }
    }, [publishableKey, stripeClientId, dispatch]);

    const [stripePromise, setStripePromise] = useState(() => publishableKey ? loadStripe(publishableKey) : null);

    /// Stripe Options ////
    const appearance = {
        theme: 'stripe',
    };
    const options = {
        mode: 'payment',
        amount: 100,
        currency: 'usd',
        appearance,
    };

    return (
        stripePromise ? (
            <Elements stripe={stripePromise} options={options}>
                <StripeCheckoutForm existingOrder={existingOrder}/>
            </Elements>
        ) : (
            "Loading..."
        )
    );
};

export default StripeCheckout;