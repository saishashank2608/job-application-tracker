const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const registerUser = async(req, res) => {
    try {
        const {name, email, password} = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                message: "User already exists"
        });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = await User.create({
            name, 
            email,
            password: hashedPassword
        });
        // Create token for the newly registered user
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch(error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};


const loginUser = async(req, res) =>{
    try{
        const {email, password} = req.body;

        // Check if user exists
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch(error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};






module.exports = {
    registerUser,
    loginUser,
};