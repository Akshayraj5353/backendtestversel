const User = require('../models/UserSchema');

const deleteaddress = async (req, res) => {
    const { userId, addressId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const addressIndex = user.addresses.findIndex(address => address._id == addressId);
      if (addressIndex === -1) {
        return res.status(404).json({ message: "Address not found" });
      }
      user.addresses.splice(addressIndex, 1);
      await user.save();
      res.json({ message: "Address deleted successfully" });
    } catch (error) {
      console.error("Error deleting address:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports = deleteaddress;