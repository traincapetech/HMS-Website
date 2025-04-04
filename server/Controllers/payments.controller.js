const StripePayment = async (req, res) => {
    const {
       paymentData
    } = req.body;
    try {
        console.log(paymentData);
        //finding any validation error
        // const errors = validationResult(req);
        // if (!errors.isEmpty()){
        //     return res.status(400).json({errors: errors.array()});
        // }
        // const {
        //     name, email, specialization, experience, phone, address, country, status
        // } = req.body;

        // //add doctor
        // const newDoc = new Add_doc({
        //     name, email, specialization, experience, phone, address, country, status
        // });

        // //save the new doc
        // await newDoc.save();
        res.status(200).json({ message: "stripe payment added successfully"});
    } catch (error){
        console.error(error);
        res.status(500).json({ message: "An error occured while adding the doctor"});
    }
};
const WalletPayment = async (req, res) => {
    try {
        console.log("wallet payment");
        //finding any validation error
        // const errors = validationResult(req);
        // if (!errors.isEmpty()){
        //     return res.status(400).json({errors: errors.array()});
        // }
        // const {
        //     name, email, specialization, experience, phone, address, country, status
        // } = req.body;

        // //add doctor
        // const newDoc = new Add_doc({
        //     name, email, specialization, experience, phone, address, country, status
        // });

        // //save the new doc
        // await newDoc.save();
        res.status(201).json({ message: "wallet payments successfully"});
    } catch (error){
        console.error(error);
        res.status(500).json({ message: "An error occured while adding the doctor"});
    }
};



export {StripePayment , WalletPayment};