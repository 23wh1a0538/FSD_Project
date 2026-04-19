const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: [true, 'Status is required']
  },
  date: {
    type: String,
    required: [true, 'Date is required']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  favorite: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

attendanceSchema.index({ rollNumber: 1 });
attendanceSchema.index({ date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
