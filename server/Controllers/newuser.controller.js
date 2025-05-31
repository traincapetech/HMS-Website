//newuser.controller.js
import Newuser from "../Models/newuser.model.js";
import {validationResult} from "express-validator";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Check username availability
const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }
        
        // Check if username already exists
        const existingUser = await Newuser.findOne({ UserName: username });
        
        if (existingUser) {
            return res.status(409).json({ message: "Username is already taken" });
        }
        
        res.status(200).json({ message: "Username is available" });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ message: "Error checking username availability" });
    }
};

const registerNewuser = async (req, res) => {
    try{
        //finding any validation error
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const{
            UserName, FirstName, LastName, Email, Phone, Password, DOB, Gender, BloodGroup,Country, State, City, Address, Pincode, ExtraPhone, Language
        } = req.body;   

        //check if the Email is already in use
        const existingnewuser = await Newuser.findOne({Email});
        if(existingnewuser){
            return res.status(400).json({message: "Email is already in use"});
        }

         //Log the files to see their content 
        //  console.log('uploaded Image:', req.files['image']);

         //Ensure files are uploaded and exists in req.files
        const image = req.files['image'] && req.files['image'][0];

        if(!image){
            return res.status(400).json({message: "Image are required"});
        }

        
        //hashing the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        //create new user
        const newUser = new Newuser({
            UserName, FirstName, LastName, Email, Phone, Password: hashedPassword, DOB, Gender, BloodGroup,Country, State, City, Address, Pincode, ExtraPhone, Language,
            image: {
                data: image.buffer,
                contentType: image.mimetype,
            },
        });
       
        //save the new user
        await newUser.save();

        res.status(201).json({message:" New User successfully created", newuser: newUser});
    }
    catch (error){
        console.error(error);
        
        // Handle duplicate key errors (username or email already exists)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            
            if (field === 'UserName') {
                return res.status(400).json({message: `Username "${value}" is already taken. Please choose a different username.`});
            } else if (field === 'Email') {
                return res.status(400).json({message: `Email "${value}" is already registered. Please use a different email or try logging in.`});
            } else {
                return res.status(400).json({message: `${field} "${value}" is already in use.`});
            }
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({message: `Validation error: ${validationErrors.join(', ')}`});
        }
        
        // Generic error for other cases
        res.status(500).json({message: "An error occurred while registering the new user"});
    }
};

//login a user
const loginNewuser = async (req, res) => {
    try{
        const {Email, Password} = req.body;

        //check if the user exists
        const user = await Newuser.findOne({Email});
        if(!user) {
            return res.status(404).json({message: "User not found"});
        } 
        //compare the password with the store hashed password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if(!isMatch){
            return res.status(401).json({message: "Invalid Password"});
        } 
        
        //generate a JWT token 
        const token = jwt.sign(
            {userId: user._id, Email: user.Email},
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.status(200).json({ message: "Login successful", token,
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
            }
        });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "An error occured during login"});
    }
};

//get all newuser's data
const getnewUser = async (req, res) => {
    try{
        const newuser = await Newuser.find();
        res.status(200).json({newuser});
    }
    catch (error){
        console.error(error);
        res.status(500).json({message: "An error occurred while fetching new user data"});
    }
};

//get a newuser's data by id
const getnewUserById = async (req, res) => {
    try{
        const newuser = await Newuser.findById(req.params.id);
        if(!newuser){
            return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({newuser});
}
    catch (error){
        console.error(error);
        res.status(500).json({message: "An error occurred while fetching User data"});
    }
};

//serve the newuser's image
const getNewuserImage = async(req, res) => {
    try {
        const newuser = await Newuser.findById(req.params.id);
        if(!newuser || !newuser.image || !newuser.image.data) {
            return res.status(404).json({ message: 'Image not found'});
        }
        
        //set headers for image
        res.setHeader('Content-Type', newuser.image.contentType);
        res.setHeader('Content-Disposition', 'inline; filename = "newuser-image.png"');

        //send the buffer as response
        res.send(newuser.image.data);
    }catch (error){
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the image "});
    }
};

//count total number of users
const countNewUser = async (req, res) => {
    try {
        const count = await Newuser.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting users:', error);
        res.status(500).json({ message: 'Error counting users' });
    }
};

const sendOTPToEmail = async (req, res) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: "support@tamdhealth.com",
        pass: "Tamd@1289",
      },
      debug: true,
    });
    
    const { email } = req.body;
    
    try {
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }

      const user = await Newuser.findOne({ Email: email });
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: "Email address not found in our records" 
        });
      }
      
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
      await user.save();
  
      const mailOptions = {
        from: "support@tamdhealth.com",
        to: email,
        subject: "Password Reset OTP - TAMD Health",
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #ffffff;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
            <h2 style="color: #d32f2f;">Reset Password OTP Verification</h2>
            <p style="color: #555; font-size: 16px;">Your One-Time Password (OTP) for password reset is:</p>
            <div style="font-size: 28px; font-weight: bold; color: #d32f2f; padding: 15px 25px; background: #f8f8f8; border: 1px solid #ffcdd2; display: inline-block; margin: 15px 0; border-radius: 6px; letter-spacing: 3px;">
              ${otp}
            </div>
            <p style="color: #555; font-size: 14px;">This OTP is valid for only 10 minutes. Do not share it with anyone.</p>
            <p style="color: #555; font-size: 14px;">If you did not request this, please ignore this email.</p>
            <div style="font-size: 12px; color: #888; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
              &copy; 2025 TAMD Health Company
            </div>
          </div>
        </div>
        `,
        headers: {
          "X-Mailer": "Nodemailer",
          "X-Priority": "1",
        },
      };
      
      await transporter.sendMail(mailOptions);
      return res.json({ success: true, message: "OTP sent successfully to your email" });
      
    } catch (error) {
      console.error("Send OTP Error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send OTP. Please try again later." 
      });
    }
  };

  const verifyOtp = async (req, res) => {
    const { otp, email } = req.body;
    
    try {
      if (!otp || !email) {
        return res.status(400).json({ 
          success: false, 
          message: "OTP and email are required" 
        });
      }

      const user = await Newuser.findOne({ Email: email });
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      
      if (!user.verifyOtp || user.verifyOtp !== otp) {
        return res.json({ success: false, message: "Invalid OTP" });
      }
      
      if (user.verifyOtpExpireAt < Date.now()) {
        return res.json({ success: false, message: "OTP has expired. Please request a new one." });
      }
      
      user.verifyOtp = "";
      user.verifyOtpExpireAt = 0;
      await user.save();
      
      return res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      console.error("Verify OTP Error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to verify OTP. Please try again." 
      });
    }
  };

  const reset_password = async (req, res) => {
    const { email, newPassword } = req.body;
    
    try {
      if (!email || !newPassword) {
        return res.status(400).json({ 
          success: false, 
          message: "Email and new password are required" 
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ 
          success: false, 
          message: "Password must be at least 8 characters long" 
        });
      }

      const user = await Newuser.findOne({ Email: email });
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.Password = hashedPassword;
      
      user.verifyOtp = "";
      user.verifyOtpExpireAt = 0;
  
      await user.save();
      
      return res.json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to reset password. Please try again." 
      });
    }
  };

export {registerNewuser, loginNewuser, getnewUser, getnewUserById, getNewuserImage, sendOTPToEmail, verifyOtp, reset_password, countNewUser, checkUsernameAvailability};