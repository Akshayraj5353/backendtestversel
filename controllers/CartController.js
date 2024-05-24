const express = require('express');
const router = express.Router();
const CartSchema = require('../models/CartSchema');

// POST route for checkout
const cartDetails = async (req, res) => {
  try {
    // Extract data from the request body
    const { userId, cartData, subtotal, GST, total, dessertTotals } = req.body;

    // Check if any dessert quantity is less than 1
    if (
      dessertTotals.gulabJamoon.quantity < 1 
    //   dessertTotals.moongDalHalwa.quantity < 1 ||
    //   dessertTotals.todaysSpecialSweet.quantity < 1
    ) {
      return res.status(400).json({ error: 'Dessert quantity should be at least 1' });
    }

    // Create a new instance of Checkout model
    const cartDatas = new CartSchema({
      userId,
      subtotal,
      GST,
      total,
      dessertTotals,
      vegMealTotal: req.body.vegMealTotal,
      vegMealQuantity: req.body.vegMealQuantity,
      vegMealDescription: req.body.vegMealDescription
    });

    // Save the checkout data to the database
    await cartDatas.save();

    // Respond with success message
    res.status(201).json({ message: 'Checkout data saved successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {cartDetails};