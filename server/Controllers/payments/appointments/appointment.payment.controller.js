import Newuser from "../../../Models/newuser.model.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
const stripe = new Stripe(
  "sk_test_51RA7gzR4IpVwwNdkUPnMXin0EA3VxD8GtWVV1O0gRhcRFYe2G7mDxQi7uKxZ0SnSf3i1e8jdvgL813vSZUoQIGz100zMlyCi6a",
  {
    apiVersion: "2023-10-16",
  }
);
const successUrl = `http://localhost:5173/appointment-stripe-success`;
const cancelUrl = `https://tamdhealth.com/payment/cancel`;

const StripeAppointment = async (req, res) => {
  const data = req.body;
  try {
    const userEmail = data.customerEmail;
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User  email is required",
      });
    }

    const user = await Newuser.findOne({ Email: userEmail });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User  not found with this email" });
    }

    if (!data.amount || data.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }
    const amount = Math.round(data.amount * 100);

    console.log("Data is---->", data);
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Book an Appointment with TAMD",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ];
    const transactionId = `txn_${new Date().getTime()}_${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(
        userEmail
      )}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: user._id.toString(), // Convert ObjectId to string
        userEmail: userEmail,
        transactionId: transactionId,
        amount: data.amount.toString(),       
        Speciality:data.Speciality || "",
        Doctor:data.Doctor || "",
        doctorEmail:data.doctorEmail || "",
        Name:data.Name || "",
        Email:data.Email || "",
        Phone:data.Phone || "",
        AppointDate:data.AppointDate || "",
        AppointTime:data.AppointTime || "",
        Symptoms:data.Symptoms || "",
        Status:data.Status || "",
      },
    });
    const transaction_details = {
      type: "Appointment Booked",
      amount: -data.amount,
      date: new Date(),
      status: "pending",
      paymentMethod: "Stripe",
      transactionId: transactionId,
      stripeSessionId: session.id,
      metadata: session.metadata, // Store all metadata for reference
    };
    // Initialize transactions array if it doesn't exist
    if (!user.transactions) {
      user.transactions = [];
    }

    user.transactions.unshift(transaction_details);
    await user.save();
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occured while making the Stripe Payment" });
  }
};

const TamdCoinAppointment = async (req, res) => {
  console.log("Data is---->", req.body);
  const data = req.body;
  try {
    const userEmail = data.customerEmail;
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User  email is required",
      });
    }
    console.log("Useremail is---->", userEmail);

    const user = await Newuser.findOne({ Email: userEmail });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User  not found with this email" });
    }
    console.log("User is---->", user);
    if (!data.amount || data.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    if (user.coinQuantity * 2 < data.amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Coin quantity",
      });
    }
    const transactionId = uuidv4();
    const transaction_details = {
      coinQuantity: -data.amount / 2,
      type: "Appointment Booked",
      amount: -data.amount,
      date: new Date(),
      status: "Pending",
      paymentMethod: "TAMD Coins",
      transactionId: transactionId,
    };

    user.transactions = user.transactions || [];
    user.transactions.unshift(transaction_details);

    try {
      user.coinQuantity -= data.amount / 2;
      await user.save();

      transaction_details.status = "completed";
      user.transactions[0] = transaction_details;
      await user.save();

      res.status(200).json({
        success: true,
        newCoinQuantity: user.coinQuantity,
        transactionId: transactionId,
      });
    } catch (error) {
      transaction_details.status = "failed";
      user.transactions[0] = transaction_details;
      await user.save();

      console.error(error);
      res
        .status(500)
        .json({ message: "An error occured while making the payment" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occured while making the payment" });
  }
};

const StripeAppointmentSuccess = async (req, res) => {
  try {
    const { session_id, email } = req.query;

    console.log("Processing payment success:", { session_id, email });

    if (!session_id || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing session ID or email",
      });
    }

    // Verify the payment was successful with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    //   // Find the user
    const user = await Newuser.findOne({ Email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //   // Try to find transaction by either session ID or metadata transactionId
    const transaction = user.transactions.find(
      (t) =>
        t.stripeSessionId === session_id ||
        t.transactionId === session.metadata?.transactionId
    );

    if (!transaction) {
      return res.status(400).json({
        success: false,
        message: "Transaction record not found",
        suggestion:
          "Check your account balance as the transaction might have already been processed",
      });
    }
    const appointmentData = {
      userId: session.metadata.userId,
      userEmail: session.metadata.userEmail,
      transactionId: session.metadata.transactionId,
      amount: parseFloat(session.metadata.amount),
      Speciality: session.metadata.Speciality,
      Doctor: session.metadata.Doctor,
      doctorEmail: session.metadata.doctorEmail,
      Name: session.metadata.Name,
      Email: session.metadata.Email,
      Phone: session.metadata.Phone,
      AppointDate: session.metadata.AppointDate,
      AppointTime: session.metadata.AppointTime,
      Symptoms: session.metadata.Symptoms,
      Status: session.metadata.Status,
      // Extract any other fields you added
    }; 

    //   // Check if transaction is already completed
    if (transaction.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        transaction: transaction,
        appointmentData: appointmentData
      });
    }

    //   // Perform atomic update to prevent race conditions
    const updateResult = await Newuser.updateOne(
      {
        _id: user._id,
        "transactions.transactionId": transaction.transactionId,
        "transactions.status": "pending",
      },
      {
        $set: {
          "transactions.$.status": "completed",
          "transactions.$.completedAt": new Date(),
          "transactions.$.stripePaymentIntent": session.payment_intent?.id,
          "transactions.$.metadata": session.metadata,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      // No documents were modified - likely already processed
      const currentUser = await Newuser.findOne({ Email: email });
      return res.status(200).json({
        success: true,
        message: "Payment was already processed",
        transaction: transaction,
        appointmentData: appointmentData
      });
    }

    //   // Get the updated user data
    const updatedUser = await Newuser.findOne({ Email: email });
    const updatedTransaction = updatedUser.transactions.find(
      (t) => t.transactionId === transaction.transactionId
    );

    return res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      transaction: updatedTransaction,
      appointmentData: appointmentData
    });
  } catch (error) {
    //   console.error("Error processing successful payment:", error);
    //   res.status(500).json({
    //     success: false,
    //     message: "An error occurred while processing the payment success",
    //     error: error.message
    //   });
  }
};

export { TamdCoinAppointment, StripeAppointment, StripeAppointmentSuccess };
