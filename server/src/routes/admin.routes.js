import express from 'express';
import { protect, admin } from '../middleware/auth.middleware.js';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { scheduleReport, processScheduledReports } from '../services/report.service.js';

const router = express.Router();

// Schedule report
router.post('/reports/schedule', protect, admin, async (req, res) => {
  try {
    const { reportType, frequency, email } = req.body;
    const schedule = await scheduleReport(req.user._id, reportType, frequency, email);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to schedule report' });
  }
});

// Get report data with date range
router.get('/reports/:type', protect, admin, async (req, res) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    let data;
    switch (type) {
      case 'sales':
        data = await Order.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                day: { $dayOfMonth: '$createdAt' }
              },
              sales: { $sum: '$totalPrice' },
              orders: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);
        break;

      case 'inventory':
        data = await Product.aggregate([
          {
            $group: {
              _id: '$category',
              totalProducts: { $sum: 1 },
              averagePrice: { $avg: '$price' },
              totalStock: { $sum: '$stock' }
            }
          }
        ]);
        break;

      case 'customers':
        data = await User.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              newCustomers: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

// ... (rest of the routes)

export default router;