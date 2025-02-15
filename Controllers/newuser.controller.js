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
            UserName, FirstName, LastName, Email, Phone, Password, DOB, Gender, Country, State, City, Address
        } = req.body;   

        //check if the Email is already in use
        const existingnewuser = await Newuser.findOne({Email});
        if(existingnewuser){
            return res.status(400).json({message: "Email is already in use"});
        }

        //hashing the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        //create new user
        const newUser = new Newuser({
            UserName, FirstName, LastName, Email, Phone, Password: hashedPassword, DOB, Gender, Country, State, City, Address
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

        res.status(200).json({ message: "Login successful", token });
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
            return res.status(404).json({message: "newuser not found"});
    }
    res.status(200).json({newuser});
}
    catch (error){
        console.error(error);
        res.status(500).json({message: "An error occurred while fetching new user data"});
    }
};

export {registerNewuser, loginNewuser, getnewUser, getnewUserById};
