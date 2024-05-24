const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require('../models/UserSchema');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const signup = async (req, res) => {
    try {
        const email = req.body.email.toLowerCase();
        const { phoneNumber, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with encrypted password
        const newUser = new User({ email, phoneNumber, password: hashedPassword });
        await newUser.save();

        // Send success response
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error signing up:', error);
        return res.status(500).json({ message: 'Failed to sign up. Please try again.' });
    }
};

module.exports = { signup };