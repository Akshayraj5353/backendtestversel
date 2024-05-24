const express = require('express');
const router = express.Router();
const { loginData, verifyToken } = require('../controllers/LoginController');
const { signup } = require('../controllers/SignupController')
const { CreateOrderDetails, getAllOrderDetails, getOrderDetailsById, updateOrderDetails, deleteOrderDetails } = require('../controllers/MenuController');
const { cartDetails } = require('../controllers/CartController');
const addAddress = require('../controllers/adress');
const userAdress = require('../controllers/useradress');
// const paymentController = require('../controllers/PaymentController');
const deleteaddress = require('../controllers/deleteaddress')
const orderController = require('../controllers/orderController');
const { deleteCartDetails } = require('../controllers/deletecartdetails');
const axios = require('axios');
const sha256 = require('sha256');
const crypto = require('crypto');
const Order = require('../models/OrderSchema');

const uniqid = require('uniqid');

// const {verifyToken} = require('../controllers/authMiddleware');

// app.use(verifyToken);

router.post("/login", loginData);

router.post("/signup", signup)

router.post("/CreateOrderDetails", CreateOrderDetails);

router.post('/userAdress/:userId', addAddress);
router.get('/userAdress/:userId', userAdress);
router.delete('/userAdress/:userId/:addressId', deleteaddress);


router.get('/getAllOrderDetails/:userId', getAllOrderDetails);

router.get('/getOrderDetailsById', getOrderDetailsById);

router.put('/updateOrderDetails/:id', updateOrderDetails);

router.delete('/deleteOrderDetails/:userId', deleteOrderDetails);

router.post("/createCartDetails/:id", cartDetails);

// router.get('/getOrder', paymentController.renderProductPage);
// router.post('/createRazorPayOrder', paymentController.createOrder);


//
router.post('/createOrder/:userId', orderController.createOrder)
// Read all orders
router.get('/getAllOrders/:userId', orderController.getAllOrders);


//payment testing 
router.post('/pay', (req, res) => {
    const payEndpoint = "/pg/v1/pay"
    const { userId, amount, phonenumber, merchantTransactionId } = req.body;
    const salt_key = process.env.SALT_KEY;
    const salt_Index = process.env.SALT_INDEX;
    const amountInPaise = amount * 100;

    const payload = {
        "merchantId": `${process.env.MERCHANT_ID}`,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": userId,
        "amount": amountInPaise,
        "redirectUrl": `http://localhost:3000/OrderConformation/${merchantTransactionId}`,
        "redirectMode": "REDIRECT",
        "callbackUrl": "https://backend.caterorange.com/api/phonepe/webhook",
        "mobileNumber": phonenumber,
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    }

    const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
    const base64Encodedpayload = bufferObj.toString("base64");
    // console.log(base64Encodedpayload);
    const xVerify = sha256(base64Encodedpayload + payEndpoint + salt_key) + "###" + salt_Index
    // console.log(xVerify);

    const options = {
        method: 'post',
        url: `${process.env.PHONE_PE_HOST_URL}${payEndpoint}`,
        headers: {
            'Content-Type': 'application/json',
            "X-VERIFY": xVerify
        },
        data: {
            "request": base64Encodedpayload,
        }
    };
    axios
        .request(options)
        .then(function (response) {
            console.log(response.data);
            console.log(response.data.data.instrumentResponse.redirectInfo, "redirectinfo")
            // res.redirect(response.data.instrumentResponse.redirectInfo.url)
            res.send(response.data);
        })
        .catch(function (error) {
            console.error(error);
        });
})


router.post('/phonepe/webhook', async (req, res) => {
    try {
        const callbackHeaders = req.headers;
        const base64response = req.body.response;
        const xVerifyHeader = callbackHeaders['x-verify'];
        const decodedResponse = Buffer.from(base64response, 'base64').toString('utf8');
        const parsedResponse = JSON.parse(decodedResponse);
        const merchantTransactionId = parsedResponse.data.merchantTransactionId;
        const code = parsedResponse.code;

        console.log(parsedResponse,"parsedResponse");
        console.log(merchantTransactionId,code,"merchantTransactionId   code");

        // Compute the checksum
        const payload = base64response + process.env.SALT_KEY;
        const computedChecksum = crypto.createHash('sha256').update(payload).digest('hex') + '###' + process.env.SALT_INDEX;

        if (xVerifyHeader !== computedChecksum) {
            console.error('Checksum validation failed');
            return res.status(400).send('Checksum validation failed');
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { merchantTransactionId },
            {
                code,
                updatedAt: Date.now(),
            },
            { new: true, useFindAndModify: false } // Ensure it returns the updated document
        );

        if (!updatedOrder) {
            console.error(`Order not found for merchantTransactionId: ${merchantTransactionId}`);
            return res.status(404).send(`Order not found for merchantTransactionId: ${merchantTransactionId}`);
        }

        console.log(`Order updated successfully: ${updatedOrder}`);
        res.status(200).send(`Order updated successfully: ${updatedOrder}`);
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Internal server error');
    }
});


router.post("/status/:merchantTransactionId", async (req, res) => {
    const { merchantTransactionId } = req.params;
    const merchantId = process.env.MERCHANT_ID;

    if (!merchantTransactionId) {
        return res.status(400).send('merchantTransactionId is required');
    }

    try {
        const xVerify = sha256(`/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.SALT_KEY).toString() + "###" + process.env.SALT_INDEX;

        const options = {
            method: 'get',
            url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
            headers: {
                'Content-Type': 'application/json',
                'X-MERCHANT-ID': merchantId,
                'X-VERIFY': xVerify,
            },
        };

        const response = await axios.request(options);
        const responseData = response.data;

        if (responseData.success) {
            const code = responseData.code;
            switch (code) {
                case 'PAYMENT_SUCCESS':
                    // Handle payment success
                    console.log('Payment successful:', responseData.data);
                    break;
                case 'PAYMENT_ERROR':
                    // Handle payment error
                    console.log('Payment failed:', responseData.data);
                    break;
                case 'INTERNAL_SERVER_ERROR':
                    // Handle internal server error
                    console.log('Internal server error:', responseData.message);
                    break;
                default:
                    // Handle unexpected response codes
                    console.log('Unexpected response code:', code);
            }
        } else {
            // Handle unsuccessful responses
            console.log('Response error:', responseData.message);
        }

        res.send(responseData);
    } catch (error) {
        console.error('Error checking payment status:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;
