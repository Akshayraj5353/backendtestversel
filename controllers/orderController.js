const User = require('../models/UserSchema');
const Order = require('../models/OrderSchema');
const { default: mongoose } = require('mongoose');

const createOrder = async (req, res) => {
    const userId = req.params.userId;
    const { products, address, total , email ,phoneNumber , merchantTransactionId} = req.body;
    console.log(userId,"test user id for order creation ");

    try {
        // Ensure the user exists
        // const user = await User.findById(userId);
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        // Create a new order
        const newOrder = new Order({
            email,
            phoneNumber,
            products,
            address,
            total,
            userId,
            merchantTransactionId,
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();
        console.log(savedOrder);

        return res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// getOrders
const getAllOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        // const orders = await Order.find().populate('userId', 'name email');
        const orders = await Order.find({ userId: new mongoose.Types.ObjectId(userId) });
        return res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        console.error('Error fetching orders:', error);

        return res.status(500).json({ message: 'Internal server error' });
    }
};


// Update Order
// const updateOrder = async (req, res) => {
//     const orderId = req.params.orderId;
//     const { products, address, total } = req.body;

//     try {
//         const updatedOrder = await Order.findByIdAndUpdate(
//             orderId,
//             { products, address, total },
//             { new: true }
//         );

//         if (!updatedOrder) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         return res.status(200).json(updatedOrder);
//     } catch (error) {
//         console.error('Error updating order:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

// Delete Order
// const deleteOrder = async (req, res) => {
//     const orderId = req.params.orderId;

//     try {
//         const deletedOrder = await Order.findByIdAndDelete(orderId);

//         if (!deletedOrder) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         return res.status(200).json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting order:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

module.exports = {
    createOrder,
    getAllOrders,
    // updateOrder,
    // deleteOrder
};