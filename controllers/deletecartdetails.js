const CartSchema = require('../models/CartSchema');

// DELETE route for removing cart details by userId
const deleteCartDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and remove the cart details for the specified userId
    const deletedCart = await CartSchema.findOneAndDelete({ userId });

    if (!deletedCart) {
      return res.status(404).json({ error: 'Cart details not found for the specified user' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Cart details deleted successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error deleting cart details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { deleteCartDetails };
