const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
    products: { type: Array, required: true },
    address: { type: Object, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true },
    total: { type: Number, required: true }, // Changed to Number to support decimals
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User collection
    createdAt: { type: Number, default: Math.floor(Date.now() / 1000) },
    updatedAt: { type: Date, default: Date.now },
    merchantTransactionId: { type: String, required: true, unique: true },
    code: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
});

OrderSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = Math.floor(Date.now() / 1000);
    }
    this.updatedAt = Date.now(); // Ensure updatedAt is set to current date on every save
    next();
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;


