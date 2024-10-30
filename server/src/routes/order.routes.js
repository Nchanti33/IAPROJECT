import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { sendEmail } from '../services/email.service.js';

const router = express.Router();

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Verify products and calculate total
    const orderItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price
      };
    }));

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    // Update product stock and check for low stock
    await Promise.all(orderItems.map(async (item) => {
      const product = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      // Send low stock alert if stock falls below threshold
      if (product.stock < 5) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          'stockAlert',
          product
        );
      }
    }));

    const createdOrder = await order.save();

    // Send order confirmation email
    await sendEmail(
      req.user.email,
      'orderConfirmation',
      await Order.findById(createdOrder._id)
        .populate('items.product', 'name price')
    );

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('user', 'email')
      .populate('items.product', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Send status update email
    await sendEmail(
      order.user.email,
      'orderStatusUpdate',
      updatedOrder
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user owns the order
    if (order.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;