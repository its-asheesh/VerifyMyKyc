// Razorpay integration for Node.js/Express
const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

// Replace with your Razorpay key and secret
env = process.env;
const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

// Create order route
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify payment route
router.post('/verify', (req, res) => {
  // You can verify payment signature here
  // See Razorpay docs for details
  res.json({ status: 'ok' });
});

module.exports = router;
