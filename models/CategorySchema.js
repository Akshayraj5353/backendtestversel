const mongoose = require("mongoose");

const CategoriesSchema = mongoose.Schema(
    {
       name:{
        type: String,
        required: true,
       },
       Image:{
        type: String,
        required: true,
       },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Categories',CategoriesSchema);