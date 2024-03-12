import express from "express";
import {stripePaymentIntent, getStripeClientId} from "../controllers/stripeController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/config/stripe-js", protect, getStripeClientId)
router.post("/create-payment-intent", protect, stripePaymentIntent);

export default router;