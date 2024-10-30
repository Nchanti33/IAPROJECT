import mongoose from 'mongoose';

const reportScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    required: true,
    enum: ['SALES', 'INVENTORY', 'CUSTOMERS']
  },
  frequency: {
    type: String,
    required: true,
    enum: ['DAILY', 'WEEKLY', 'MONTHLY']
  },
  email: {
    type: String,
    required: true
  },
  lastSent: Date,
  nextScheduled: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ReportSchedule = mongoose.model('ReportSchedule', reportScheduleSchema);