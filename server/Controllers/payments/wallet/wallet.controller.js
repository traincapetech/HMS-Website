import Newuser from "../../../Models/newuser.model.js";

const WalletPayment = async (req, res) => {
    const {
        paymentData
    } = req.body;
    try {
        const userEmail = paymentData?.user?.Email;
        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: "User  email is required"
            });
        }

        const user = await Newuser.findOne({ Email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: "User  not found with this email" });
        }

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

        if (user.walletBalance < paymentData.amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance"
            });
        }

        const transaction_details = {
            type: 'purchase',
            amount: paymentData.amount,
            coinQuantity: paymentData.quantity,
            date: new Date(),
            status: 'pending',
            paymentMethod: 'wallet',
        };

        user.transactions = user.transactions || [];
        user.transactions.unshift(transaction_details);

        try {
            user.walletBalance -= paymentData.amount;
            user.coinQuantity += paymentData.quantity;
            await user.save();

            transaction_details.status = 'completed';
            user.transactions[0] = transaction_details;
            await user.save();

            res.status(200).json({
                success: true,
                email: paymentData.Email,
                newWalletBalance: user.walletBalance,
                newCoinQuantity: user.coinQuantity,
            });
        } catch (error) {
            transaction_details.status = 'failed';
            user.transactions[0] = transaction_details;
            await user.save();

            console.error(error);
            res.status(500).json({ message: "An error occured while making the payment" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occured while making the payment" });
    }
};

export { WalletPayment };