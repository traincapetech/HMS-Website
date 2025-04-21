import express from "express";
// import { StripePayment, WalletPayment } from "../Controllers/payments/payments.controller.js";
import { StripePayment, StripePaymentSuccess } from "../Controllers/payments/stripe/stripe.controller.js";
import { StripeAppointment, TamdCoinAppointment } from "../Controllers/payments/appointments/appointment.payment.controller.js";
import { createCryptoPayment, handleCryptoWebhook, checkCryptoPaymentStatus } from "../Controllers/payments/crypto/crypto.controller.js";

const router = express.Router();

//Routes
router.post('/stripe', StripePayment);
router.get('/success', StripePaymentSuccess);
router.post('/appointment-stripe', StripeAppointment);
router.post('/appointment-tamd', TamdCoinAppointment);

// Crypto payment routes
router.post('/crypto', createCryptoPayment);
router.post('/crypto/webhook', handleCryptoWebhook);
router.get('/crypto/status/:chargeId', checkCryptoPaymentStatus);

export default router;