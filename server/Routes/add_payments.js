import express from "express";
// import { StripePayment, WalletPayment } from "../Controllers/payments/payments.controller.js";
import { StripePayment, StripeWebhook } from "../Controllers/payments/stripe/stripe.controller.js";
import { WalletPayment } from "../Controllers/payments/wallet/wallet.controller.js";

const router = express.Router();

//Routes
router.post('/stripe', StripePayment);
router.post('/wallet', WalletPayment);
router.post('/webhook', express.raw({type: 'application/json'}), StripeWebhook);

export default router;