import Newuser from "../../../Models/newuser.model.js";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51RA7gzR4IpVwwNdkUPnMXin0EA3VxD8GtWVV1O0gRhcRFYe2G7mDxQi7uKxZ0SnSf3i1e8jdvgL813vSZUoQIGz100zMlyCi6a",
  {
    apiVersion: "2023-10-16",
  }
);

// Get the frontend URL with better fallback handling
const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? (process.env.FRONTEND_URL || "https://tamd-website.onrender.com")
  : "https://tamdhealth.com/";

console.log("Using FRONTEND_URL for payment redirects:", FRONTEND_URL);

// Create payment session
const StripePayment = async (req, res) => {
  const { products } = req.body;
  try {
    console.log("The products are--->", products);
    
    const userEmail = products?.user?.Email;
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }
    
    const user = await Newuser.findOne({ Email: userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }
    
    // Calculate amount per unit in cents
    const amount = Math.round((products.amount * 100) / (products.quantity || 1));

    // Define success and cancel URLs
    const successUrl = `https://tamdhealth.com/payment/success`;
    const cancelUrl = `https://tamdhealth.com/payment/cancel`;
    
    console.log("Stripe payment URLs:", {
      successUrl: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&email=user@example.com`,
      cancelUrl
    });

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "TAMD Coin",
          },
          unit_amount: amount,
        },
        quantity: products.quantity || 1,
      },
    ];
    
    // Create a unique transaction ID
    const transactionId = `txn_${new Date().getTime()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Create the session with metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(userEmail)}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: user._id.toString(), // Convert ObjectId to string
        userEmail: userEmail,
        coinQuantity: products.quantity.toString(),
        transactionId: transactionId,
        amount: products.amount.toString()
      },
    });
    
    console.log("Session created successfully:", session.id);
    
    // Create a transaction record with pending status
    const transaction_details = {
      type: "purchase",
      amount: products.amount,
      coinQuantity: products.quantity,
      date: new Date(),
      status: "pending",
      paymentMethod: "stripe",
      transactionId: transactionId,
      stripeSessionId: session.id,
      metadata: session.metadata // Store all metadata for reference
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
    console.error("Stripe session creation error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the Stripe payment",
      error: error.message,
    });
  }
};

// Success handler with atomic operations and better idempotencyconst StripePaymentSuccess = async (req, res) => {
    const StripePaymentSuccess = async (req, res) => {
        try {
          const { session_id, email } = req.query;
          
          console.log("Processing payment success:", { session_id, email });
          
          if (!session_id || !email) {
            return res.status(400).json({
              success: false,
              message: "Missing session ID or email"
            });
          }
          
          // Verify the payment was successful with Stripe
          const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['payment_intent']
          });
          
          if (session.payment_status !== 'paid') {
            return res.status(400).json({
              success: false,
              message: "Payment not completed"
            });
          }
          
          // Find the user
          const user = await Newuser.findOne({ Email: email });
          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found"
            });
          }
          
          // Try to find transaction by either session ID or metadata transactionId
          const transaction = user.transactions.find(t => 
            t.stripeSessionId === session_id || 
            t.transactionId === session.metadata?.transactionId
          );
          
          if (!transaction) {
            return res.status(400).json({
              success: false,
              message: "Transaction record not found",
              suggestion: "Check your account balance as the transaction might have already been processed"
            });
          }
          
          const coinQuantity = parseInt(session.metadata?.coinQuantity) || 0;
          
          // Check if transaction is already completed
          if (transaction.status === 'completed') {
            return res.status(200).json({
              success: true,
              message: "Payment was already processed",
              newCoinQuantity: user.coinQuantity,
              transaction: transaction
            });
          }
          
          // Perform atomic update to prevent race conditions
          const updateResult = await Newuser.updateOne(
            {
              _id: user._id,
              "transactions.transactionId": transaction.transactionId,
              "transactions.status": "pending"
            },
            {
              $inc: { coinQuantity: coinQuantity },
              $set: {
                "transactions.$.status": "completed",
                "transactions.$.completedAt": new Date(),
                "transactions.$.stripePaymentIntent": session.payment_intent?.id,
                "transactions.$.metadata": session.metadata
              }
            }
          );
          
          if (updateResult.modifiedCount === 0) {
            // No documents were modified - likely already processed
            const currentUser = await Newuser.findOne({ Email: email });
            return res.status(200).json({
              success: true,
              message: "Payment was already processed",
              newCoinQuantity: currentUser.coinQuantity,
              transaction: transaction
            });
          }
          
          // Get the updated user data
          const updatedUser = await Newuser.findOne({ Email: email });
          const updatedTransaction = updatedUser.transactions.find(t => 
            t.transactionId === transaction.transactionId
          );
          
          return res.status(200).json({
            success: true,
            message: "Payment processed successfully",
            newCoinQuantity: updatedUser.coinQuantity,
            transaction: updatedTransaction
          });
          
        } catch (error) {
          console.error("Error processing successful payment:", error);
          res.status(500).json({
            success: false,
            message: "An error occurred while processing the payment success",
            error: error.message
          });
        }
      };


export { StripePayment, StripePaymentSuccess };