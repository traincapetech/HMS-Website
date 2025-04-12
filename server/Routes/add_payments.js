import express from "express";
// import { StripePayment, WalletPayment } from "../Controllers/payments/payments.controller.js";
import { StripePayment,StripePaymentSuccess } from "../Controllers/payments/stripe/stripe.controller.js";
import { StripeAppointment, TamdCoinAppointment } from "../Controllers/payments/appointments/appointment.payment.controller.js";

const router = express.Router();

//Routes
router.post('/stripe', StripePayment);
router.get('/success', StripePaymentSuccess);
router.post('/appointment-stripe', StripeAppointment);
router.post('/appointment-tamd', TamdCoinAppointment);
export default router;
