import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ReportSchedule } from '../models/reportSchedule.model.js';
import { Order } from '../models/order.model.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { sendEmail } from './email.service.js';

const generateSalesReport = async (startDate, endDate) => {
  const sales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' },
        orderCount: { $sum: 1 }
      }
    }
  ]);

  const topProducts = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ]);

  return {
    period: {
      start: format(startDate, 'dd MMMM yyyy', { locale: fr }),
      end: format(endDate, 'dd MMMM yyyy', { locale: fr })
    },
    summary: sales[0] || { totalSales: 0, orderCount: 0 },
    topProducts
  };
};

const generateInventoryReport = async () => {
  const products = await Product.find({})
    .sort({ stock: 1 })
    .select('name stock price category');

  const lowStock = products.filter(p => p.stock < 5);

  return {
    products,
    lowStock,
    summary: {
      totalProducts: products.length,
      lowStockCount: lowStock.length
    }
  };
};

export const scheduleReport = async (userId, reportType, frequency, email) => {
  const now = new Date();
  let nextScheduled;

  switch (frequency) {
    case 'DAILY':
      nextScheduled = addDays(now, 1);
      break;
    case 'WEEKLY':
      nextScheduled = addWeeks(now, 1);
      break;
    case 'MONTHLY':
      nextScheduled = addMonths(now, 1);
      break;
    default:
      throw new Error('Invalid frequency');
  }

  const schedule = new ReportSchedule({
    user: userId,
    reportType,
    frequency,
    email,
    nextScheduled
  });

  await schedule.save();
  return schedule;
};

export const processScheduledReports = async () => {
  const now = new Date();
  const schedules = await ReportSchedule.find({
    nextScheduled: { $lte: now }
  });

  for (const schedule of schedules) {
    try {
      let reportData;
      const endDate = new Date();
      let startDate;

      switch (schedule.frequency) {
        case 'DAILY':
          startDate = addDays(endDate, -1);
          break;
        case 'WEEKLY':
          startDate = addWeeks(endDate, -1);
          break;
        case 'MONTHLY':
          startDate = addMonths(endDate, -1);
          break;
      }

      switch (schedule.reportType) {
        case 'SALES':
          reportData = await generateSalesReport(startDate, endDate);
          break;
        case 'INVENTORY':
          reportData = await generateInventoryReport();
          break;
      }

      // Send email with report
      await sendEmail(schedule.email, 'scheduledReport', {
        type: schedule.reportType,
        frequency: schedule.frequency,
        data: reportData
      });

      // Update schedule
      schedule.lastSent = now;
      schedule.nextScheduled = getNextScheduleDate(now, schedule.frequency);
      await schedule.save();
    } catch (error) {
      console.error(`Error processing scheduled report ${schedule._id}:`, error);
    }
  }
};

const getNextScheduleDate = (from, frequency) => {
  switch (frequency) {
    case 'DAILY':
      return addDays(from, 1);
    case 'WEEKLY':
      return addWeeks(from, 1);
    case 'MONTHLY':
      return addMonths(from, 1);
    default:
      throw new Error('Invalid frequency');
  }
};