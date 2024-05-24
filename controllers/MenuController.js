const FormData = require('../models/MenuSchema');
const mongoose = require('mongoose')

// const CreateOrderDetails = async (req, res) => {
//     try {
//         const formData = req.body;
//         // Save form data to MongoDB
//         const cartData = await FormData.create(formData);


//         res.send({ message: 'Form data saved to MongoDB', cartData });
//     } catch (error) {
//         console.error('Error saving form data to MongoDB:', error);
//         res.status(500).send({ error: 'An error occurred while saving form data' });
//     }
// }


const CreateOrderDetails = async (req, res) => {
  try {
    const formData = req.body;
    const userId = formData.userId; // Assuming you have a userId in the formData

    // Check if an order exists for the user
    let existingOrder = await FormData.findOne({ userId });

    if (existingOrder) {
      // Update existing order with new form data
      Object.assign(existingOrder, formData);
      await existingOrder.save();
      res.send({ message: 'Form data updated in MongoDB', cartData: existingOrder });
    } else {
      // Save new form data to MongoDB
      const cartData = await FormData.create(formData);
      res.send({ message: 'Form data saved to MongoDB', cartData });
    }
  } catch (error) {
    console.error('Error saving form data to MongoDB:', error);
    res.status(500).send({ error: 'An error occurred while saving form data' });
  }
}


// Get all form data
const getAllOrderDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const formData = await FormData.find({ userId: new mongoose.Types.ObjectId(userId) });
    res.json({ data: formData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single form data by ID
const getOrderDetailsById = async (req, res) => {
  try {
    const formData = await FormData.findById(req.params.id);
    if (!formData) {
      return res.status(404).json({ message: 'Form data not found' });
    }
    res.json(formData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a form data by ID
const updateOrderDetails = async (req, res) => {
  try {
    const formData = await FormData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!formData) {
      return res.status(404).json({ message: 'Form data not found' });
    }
    res.json(formData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a form data by ID
const deleteOrderDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find and delete document by userId field
    const formData = await FormData.findOneAndDelete({ userId: new mongoose.Types.ObjectId(userId) });
    if (!formData) {
      return res.status(404).json({ message: 'Form data not found' });
    }

    res.json({ message: 'Form data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { CreateOrderDetails, getAllOrderDetails, getOrderDetailsById, updateOrderDetails, deleteOrderDetails };