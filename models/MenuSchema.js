const mongoose = require("mongoose");
const formDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    selectedItemIndex: Number,
    mealType: String,
    mealPlan: String,
    mealQuantity: Number,
    addOns: {
        gulabJamoon: Number,
        // moongDalHalwa: Number,
        // todaysSpecialSweet: Number
    },
    deliveryDate: { type: Date, required: true }
    // itemName: String,
    // itemPrice: Number,
    // itemDetails: String,
});


module.exports = mongoose.model('cartDetails', formDataSchema);