import express from "express";
import { StripePayment, WalletPayment } from "../Controllers/payments.controller.js";

const router = express.Router();

//Routes
router.post('/stripe', StripePayment);
router.post('/wallet', WalletPayment);

export default router;