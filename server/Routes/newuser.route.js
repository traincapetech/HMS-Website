//newuser.route.js
import express from 'express';
import { registerNewuser, loginNewuser, getnewUser, getnewUserById, getNewuserImage} from '../Controllers/newuser.controller.js';
import { authenticateToken } from '../Middlewares/auth.middleware.js';
import { uploadFiles } from '../multer.js';
import Newuser from '../Models/newuser.model.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

//Routes
// router.post('/register', registerNewuser);
router.post('/register', (req, res) => {
    console.log('Request Body', req.body);
    console.log('Request Files', req.files);

    uploadFiles(req, res, (err) => {
        if(err) {
            console.error('Multer Error', err);
            return res.status(400).json({ message: err.message });
        }
        console.log('Request Files', req.files);
        registerNewuser(req, res);
    });
});
router.post('/login', loginNewuser);
router.get('/all', authenticateToken, getnewUser);
router.get('/:id', authenticateToken, getnewUserById);

//routes for fetching image
router.get('/:id/image', getNewuserImage);

// Password reset routes
router.post('/forgot-password', async (req, res) => {
  // Create a nodemailer transport with fallback behavior
  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || "",
      },
    });
  } catch (error) {
    console.error('Error creating mail transporter:', error);
    // Continue with a dummy transporter that doesn't actually send
    // This allows the process to continue even if email setup fails
  }
  
  const { Email } = req.body;
  try {
    console.log('Finding user with email:', Email);
    const user = await Newuser.findOne({ Email });
    
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Email Id does not exist in the database" });
    }
    
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    
    // Add OTP fields to user schema if they don't exist
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours validity
    await user.save();
    
    // For development/testing, immediately return success with OTP in console
    // In production, this should be removed for security
    console.log('Generated OTP for development:', otp);
    
    if (!transporter || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials missing, returning mock success response');
      return res.json({ 
        success: true, 
        message: "OTP generated successfully (email sending skipped - no credentials)", 
        devOtp: process.env.NODE_ENV === 'production' ? undefined : otp 
      });
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Email,
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
      <p style="color: #777; font-size: 14px;">This OTP is valid for 24 hours. Do not share it with anyone.</p>
      <p style="color: #777; font-size: 14px;">If you did not request this, please ignore this email.</p>
      <div style="font-size: 12px; color: #aaa; margin-top: 20px;">© 2025 TAMD Health</div>
  </div>
</div>
`,
    };

    // Try to send email but handle any failures gracefully
    try {
      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error('Email Error:', error);
      // Still return success since we saved the OTP in the database
      // The user can still reset their password with the console-logged OTP during development
      return res.json({ 
        success: true, 
        message: "OTP generated successfully (email sending failed)", 
        devOtp: process.env.NODE_ENV === 'production' ? undefined : otp
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { otp, Email } = req.body;
  try {
    console.log('Verifying OTP for email:', Email, 'OTP:', otp);
    const user = await Newuser.findOne({ Email });
    
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    
    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }
    
    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { Email, Password } = req.body;
  try {
    console.log('Resetting password for email:', Email);
    const user = await Newuser.findOne({ Email });
    
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    
    const hashedPassword = await bcrypt.hash(Password, 10);
    user.Password = hashedPassword;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    
    return res.json({
      success: true,
      message: "Password has been changed successfully",
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;