import {apiSlice} from "./apiSlice";
import {STRIPE_URL} from "../variables";

export const stripeApiSlice = apiSlice.injectEndpoints({
    endpoints: function (build) {
        return {
            getStripeClientId: build.query({
                query: function () {
                    return {
                        url: `${STRIPE_URL}/config/stripe-js`
                    }
                },
                keepUnusedDataFor: 2
            }),
            createStripePaymentIntent: build.mutation({
                query: (data) => {
                    return {
                        url:  `${STRIPE_URL}/create-payment-intent`,
                        method:  "POST",
                        body: data,
                    }
                }
            }),
        };
    }
});

export const {useGetStripeClientIdQuery, useCreateStripePaymentIntentMutation} = stripeApiSlice;