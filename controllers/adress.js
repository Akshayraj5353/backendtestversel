const User = require('../models/UserSchema');

const addAddress = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you pass the user ID in the URL
    const { fullAddress, city, state, pincode, landmark } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Add the new address to the user's addresses array
    user.addresses.push({ fullAddress, city, state, pincode, landmark });
    await user.save();

    // Send success response
    return res.status(201).json({ message: 'Address added successfully', user });
  } catch (error) {
    console.error('Error adding address:', error);
    return res.status(500).json({ message: 'Failed to add address. Please try again.' });
  }
};

module.exports = addAddress
