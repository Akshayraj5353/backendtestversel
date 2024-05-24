const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const renderProductPage = async (req, res) => {
    try {
        res.render('product');
    } catch (error) {
        console.log(error.message);
    }
}

const createOrder = async (req, res) => {
    try {
        const amount = req.body.amount * 100;
        const options = {
            amount: amount,
            currency: req.body.currency,
            receipt: req.body.receipt
        }

        razorpayInstance.orders.create(options,
            (err, order) => {
                if (!err) {
                    res.status(200).send({
                        success: true,
                        msg: 'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id: RAZORPAY_ID_KEY,
                        // product_name:req.body.name,
                        // description:req.body.description,
                        // description:req.body.description,
                        // contact: "655433",
                        // name: "jhjwehdjh",
                        // email: "skdnskn@gmail.com"
                    })
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong'})
                }
            }
        )
    }catch{

    }
}



module.exports = {  renderProductPage, createOrder }