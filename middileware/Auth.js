const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "1h" }
    );
};



module.exports = generateToken;
