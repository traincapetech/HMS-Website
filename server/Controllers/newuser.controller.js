//newuser.controller.js
import Newuser from "../Models/newuser.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const registerNewuser = async (req, res) => {
  try {
    //finding any validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      UserName,
      FirstName,
      LastName,
      Email,
      Phone,
      Password,
      DOB,
      Gender,
      BloodGroup,
      Country,
      State,
      City,
      Address,
      Pincode,
      ExtraPhone,
      Language,
    } = req.body;

    //log the password
    console.log("Request body:", req.body);
    console.log("Password:", Password);

    //check if the Email is already in use
    const existingnewuser = await Newuser.findOne({ Email });
    if (existingnewuser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    //Log the files to see their content
    console.log("uploaded Image:", req.files["image"]);

    //Ensure files are uploaded and exists in req.files
    const image = req.files["image"] && req.files["image"][0];

    if (!image) {
      return res.status(400).json({ message: "Image are required" });
    }

    //hashing the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    //create new user
    const newUser = new Newuser({
      UserName,
      FirstName,
      LastName,
      Email,
      Phone,
      Password: hashedPassword,
      DOB,
      Gender,
      BloodGroup,
      Country,
      State,
      City,
      Address,
      Pincode,
      ExtraPhone,
      Language,
      image: {
        data: image.buffer,
        contentType: image.mimetype,
      },
    });

    //save the new user
    await newUser.save();

    res
      .status(201)
      .json({ message: " New User successfully created", newuser: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while regstering the new user" });
  }
};

//login a user
const loginNewuser = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    //check if the user exists
    const user = await Newuser.findOne({ Email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //compare the password with the store hashed password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    //generate a JWT token
    const token = jwt.sign(
      { userId: user._id, Email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        UserName: user.UserName,
        FirstName: user.FirstName,
        LastName: user.LastName,
        Email: user.Email,
        Phone: user.Phone,
        DOB: user.DOB,
        BloodGroup: user.BloodGroup,
        Gender: user.Gender,
        Country: user.Country,
        State: user.State,
        City: user.City,
        Address: user.Address,
        Pincode: user.Pincode,
        ExtraPhone: user.ExtraPhone,
        Language: user.Language,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occured during login" });
  }
};

//get all newuser's data
const getnewUser = async (req, res) => {
  try {
    const newuser = await Newuser.find();
    res.status(200).json({ newuser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching new user data" });
  }
};

//get a newuser's data by id
const getnewUserById = async (req, res) => {
  try {
    const newuser = await Newuser.findById(req.params.id);
    if (!newuser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ newuser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching User data" });
  }
};

//serve the newuser's image
const getNewuserImage = async (req, res) => {
  try {
    const newuser = await Newuser.findById(req.params.id);
    if (!newuser || !newuser.image || !newuser.image.data) {
      return res.status(404).json({ message: "Image not found" });
    }

    //set headers for image
    res.setHeader("Content-Type", newuser.image.contentType);
    res.setHeader(
      "Content-Disposition",
      'inline; filename = "newuser-image.png"'
    );

    //send the buffer as response
    res.send(newuser.image.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching the image " });
  }
};

const sendOTPToEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp.hostinger.com",
    port: 465, // Explicitly set the port
    secure: true,
    auth: {
      //   user: "sales@traincapetech.in",
      //   pass: "Canada@1212",
      user: "support@tamdhealth.com",
      pass: "Tamd@1289",
    }, // Add this to debug the connection:
    debug: true,
  });
  const { email } = req.body;
  console.log(email);
  try {
    const user = await Newuser.findOne({ Email: email });
    if (!user) {
      return res
        .status(400)
        .send({ msg: "Email Id does not exist in the database" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      //from: "sales@traincapetech.in",
      from: "support@tamdhealth.com",
      to: email,
      subject: "Password Reset OTP",
      html: `
      <!-- Updated HTML template with image -->
<div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
      <h2 style="color: #333;">OTP Verification</h2>
      <p style="color: #555; font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>
      <div style="font-size: 24px; font-weight: bold; color: #333; padding: 10px 20px; background: #f8f8f8; border: 1px dashed #333; display: inline-block; margin: 10px 0;">
          ${otp}
      </div>
      <p style="color: #777; font-size: 14px;">This OTP is valid for only 10 minutes. Do not share it with anyone.</p>
      <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
      <div style="font-size: 12px; color: #aaa; margin-top: 20px;">© 2025 TrainCape Industries</div>
  </div>
</div>
`,
      ////////////added code
      headers: {
        "X-Mailer": "Nodemailer",
        "X-Priority": "1", // High priority
      },
      //////////////added code
    };
    transporter
      .sendMail(mailOptions)
      .then(() => {
        return res.json({ success: true, message: "OTP sent successfully" });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({ message: "Error sending email" });
      });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Internal Server Error" });
  }
};
const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;
  try {
    const user = await Newuser.findOne({ Email: email });
    if (!user) {
      return res.status(400).send({ msg: "Wrong Credentials" });
    }
    if (user.verifyOtp !== otp || user.verifyOtp === "") {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    user.verifyOtp = "";
    user.verifyOTPExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};
const reset_password = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await Newuser.findOne({  Email: email });
    if (!user) {
      return res.status(400).send({ msg: "Wrong Credentials" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.Password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "Password has been changed Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};
export {
  sendOTPToEmail,
  registerNewuser,
  loginNewuser,
  getnewUser,
  getnewUserById,
  getNewuserImage,
  verifyOtp,
  reset_password,
};
