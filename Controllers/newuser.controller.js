//newuser.controller.js
import Newuser from "../Models/newuser.model.js";
import {validationResult} from "express-validator";
import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";

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

        //log the password
        console.log('Request body:', req.body);
        console.log('Password:', Password);

        //check if the Email is already in use
        const existingnewuser = await Newuser.findOne({Email});
        if(existingnewuser){
            return res.status(400).json({message: "Email is already in use"});
        }

         //Log the files to see their content 
         console.log('uploaded Image:', req.files['image']);

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
        res.status(500).json({message: "An error occurred while regstering the new user"});
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

export {registerNewuser, loginNewuser, getnewUser, getnewUserById, getNewuserImage};
