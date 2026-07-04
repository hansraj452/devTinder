const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razpayInstnace = require("../utility/razorpay");
const Payments = require("../models/payment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const { memberShipAmount } = require("../utility/constant");
const User = require("../models/user");
const paymentRouter = express.Router();
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  const { memberShipType } = req.body;
  const { firstName, lastName, emailId } = req.user;
  try {
    const order = await razpayInstnace.orders.create({
      amount: memberShipAmount[memberShipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        memberShipType: memberShipType,
      },
    });
    const payment = new Payments({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savePayment = await payment.save();
    res.json({ ...savePayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get('X-Razorpay-Signature');
   const isValidateWebHookSignature = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if(!isValidateWebHookSignature){
    res.send.status(400).json({msg  : "Webhook signature is invalid"})
    }
    // geting the payment detials form web hook of razopay
    const paymentDetials =  req.body.payload.payment.entity;


    //finding the payment detials and updating the  order id and status
    const payment = await Payments.findOne({orderId : paymentDetials.order_id})
     payment.status = paymentDetials.status;
     await payment.save();

    const user = await User.findOne({_id : payment.userId})
     user.isPremium  = true;
     user.mermbershipType = payment.note.memberShipType;
     
     await user.save();

     return res.status(200).json({msg : "Webhook received successfully "})


  } catch (err) {
    res.send.status(500).json({ msg: err.message });
  }
});

paymentRouter.get("/premium/verify" , userAuth , (req , res) =>{
  const user = req.user;
  if(user.isPremium){
    return res.json({premium : isPremium})
  }
  return res.json({premium : isPremium});
})

module.exports = paymentRouter;
