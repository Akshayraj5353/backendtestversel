const User = require('../models/UserSchema');

const userAdress = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ addresses: user.addresses });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
};

module.exports = userAdress