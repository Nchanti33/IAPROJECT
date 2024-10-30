import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import stripe from '../config/stripe.js';
import { Order } from '../models/order.model.js';

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment processing error' });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const { orderId } = event.data.object.metadata;

      // Update order status
      await Order.findByIdAndUpdate(orderId, {
        status: 'processing',
        'paymentResult.status': 'completed',
        'paymentResult.updateTime': new Date()
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }
});

export default router;