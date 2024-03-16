import Stripe from 'stripe';
import asyncHandler from "../middleware/asyncHandler.js";
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY);

const calculateOrderAmountInCents = (dollarAmount) => {
    dollarAmount = (dollarAmount + '').replace(/[^\d.-]/g, '');
    if (dollarAmount && dollarAmount.includes('.')) {
        dollarAmount = dollarAmount.substring(0, dollarAmount.indexOf('.') + 3);
    }
    return dollarAmount ? Math.round(parseFloat(dollarAmount) * 100) : 0;
}

const stripePaymentIntent = asyncHandler(async (req, res) => {
    const {totalPriceFromBackend} = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmountInCents(totalPriceFromBackend),
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

const confirmStripeIntent = async (id) => {
    return await stripe.paymentIntents.retrieve(id);
};

const getStripeClientId = asyncHandler(async (req, res) => {
    res.send({
        clientId: process.env.STRIPE_API_PUBLISHABLE_KEY,
    });
});

export {stripePaymentIntent, getStripeClientId, confirmStripeIntent};