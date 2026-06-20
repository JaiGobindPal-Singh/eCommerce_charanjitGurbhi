import User from "../models/User.js";
import {generateHash, verifyHash} from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
    try{
        //validating input data
        const { name, phone, password } = req.body;
        if(!name || !phone || !password){
            return res.status(400).json({message: 'Name, phone and password are required'});
        }
        //checking if user already exist
        const user = await User.findOne({phone});
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }
        //hashing password and updating db
        const hashedPassword = await generateHash(String(password));
        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            role: 'client'
        });
        await newUser.save();

        //generate JWT token for the user and save as cookie
        const token  = generateToken({id: newUser._id, role: newUser.role});
        res.cookie('token', token, {httpOnly: true}); // 7 days

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                phone: newUser.phone,
                role: newUser.role
            }
        });

    }catch(error){
        // console.error('Error registering user:', error); debug
        return res.status(500).json({message: 'Internal server error'});
    }
}
export const loginUser = async (req, res) => {
    try{
        //validating data
        const { phone, password } = req.body;
        if(!phone || !password){
            return res.status(400).json({message: 'Phone and password are required'});
        }
        //checking if user exist
        const user = await User.findOne({phone});
        if(!user){
            return res.status(400).json({message: 'Invalid phone or password'});
        }
        //verify password
        const isPasswordValid = await verifyHash(String(password), user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: 'Invalid phone or password'});
        }

        //generate JWT token for the user and save as cookie
        const token  = generateToken({id: user._id, role: user.role});
        res.cookie('token', token, {httpOnly: true}); 

        return res.status(200).json({
            message: 'User logged in successfully',
            user:{
                id: user._id,
                name: user.name,
                phone: user.phone,
                role: user.role
            }
        });

    }catch(error){
        // console.error('Error logging in user:', error); debugging purposes
        return res.status(500).json({message: 'Internal server error'});
    }
}
//note frontend must refresh window after logout
export const logoutUser = async (req, res) => {
    try{
        //clearing cookies 
        res.clearCookie('token');
        return res.status(200).json({message: 'User logged out successfully'});
    }catch(error){
        // console.error('Error logging out user:', error); debugging purposes
        return res.status(500).json({message: 'Internal server error'});
    }
}

