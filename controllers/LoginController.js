const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const cors = require("cors");
const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');



const app = express();
app.use(bodyParser.json());
app.use(cors());

// app.use(express.json());

const loginData = async (req, res) => {
  console.log("logindata")
  console.log(req.body);

  try {
    const { email, password } = req.body;
    const lowercaseEmail = email.toLowerCase();
    console.log('Received credentials:', { email: lowercaseEmail, password });
    const user = await User.findOne({email: lowercaseEmail });

    if (!user || !(await bcrypt.compare(password, user.password)) ) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
     user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { loginData, verifyToken };
