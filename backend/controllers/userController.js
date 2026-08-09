const { request } = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register a new user 
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                message: 'User registered successfully!'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const loginUser = async(req,res) => {
    try{
        const { email , password } = req.body;
        const user = await User.findOne({email});

        if (user && user.password === password){
            const token =  jwt.sign({id : user._id} , process.env.JWT_SECRET ,{
                expiresIn :'30d'
            });

            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            });
        }else{
            res.status(401).json({message:'Invalid email or password'})
        }
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

const getUserProfile = async (req, res) => {
    const user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
    };

    res.status(200).json(user);
};
module.exports = { registerUser , loginUser ,getUserProfile };