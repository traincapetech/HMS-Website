import Newuser from "../../../Models/newuser.model.js";
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const StripePayment = async (req, res) => {
    const { paymentData } = req.body;
    
    try {
        // Extract user email from nested object
        const userEmail = paymentData?.user?.Email;
        
        if (!userEmail) {
            return res.status(400).json({ 
                success: false, 
                message: "User email is required" 
            });
        }
        
        const user = await Newuser.findOne({ Email: userEmail });
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found with this email" 
            });
        }
        
        // Validate payment amount and quantity
        if (!paymentData.amount || paymentData.amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });
        }
        
        if (!paymentData.quantity || paymentData.quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid coin quantity"
            });
        }
        
        // Create a payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: paymentData.amount * 100, // Stripe requires amount in cents
            currency: 'inr',
            metadata: {
                userId: user._id.toString(),
                coinQuantity: paymentData.quantity.toString(),
                userEmail: userEmail
            },
            description: `Purchase of ${paymentData.quantity} Tamd Coins`,
            receipt_email: userEmail
        });
        
        // Return the client secret to the frontend
        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "An error occurred while processing the Stripe payment" 
        });
    }
};

// Webhook to handle successful payments
const StripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];
    
    try {
        // Verify webhook signature
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        // Handle the payment_intent.succeeded event
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const metadata = paymentIntent.metadata;
            
            // Find user and update coin quantity
            const user = await Newuser.findById(metadata.userId);
            
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            
            // Update coin quantity
            const coinQuantity = parseInt(metadata.coinQuantity);
            user.coinQuantity += coinQuantity;
            
            // Create transaction record
            const transaction_details = {
                type: 'purchase',
                amount: paymentIntent.amount / 100, // Convert back from cents
                coinQuantity: coinQuantity,
                date: new Date(),
                status: 'completed',
                paymentMethod: 'card',
                transactionId: paymentIntent.id
            };
            
            // Initialize transactions array if it doesn't exist
            user.transactions = user.transactions || [];
            user.transactions.unshift(transaction_details);
            
            await user.save();
        }
        
        res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ success: false, message: `Webhook Error: ${error.message}` });
    }
};

export { StripePayment, StripeWebhook };