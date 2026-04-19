const Attendance = require('../models/Attendance');
const fs = require('fs');
const path = require('path');

const logToFile = (entry) => {
  const logPath = path.join(__dirname, '../../logs/attendance.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
};

const createAttendance = async (req, res) => {
  try {
    const { studentName, rollNumber, status, date } = req.body;

    if (!studentName || !rollNumber || !status || !date) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const record = await Attendance.create({
      studentName,
      rollNumber,
      status,
      date,
      userId: req.user._id
    });

    logToFile({ action: 'CREATE', record: record._id, time: new Date() });

    res.status(201).json({ success: true, message: 'Attendance marked', data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const { status, favorite, search, sortBy, limit, skip } = req.query;

    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (favorite === 'true') filter.favorite = true;
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const query = Attendance.find(filter)
      .sort(sortBy ? { [sortBy]: -1 } : { createdAt: -1 })
      .limit(parseInt(limit) || 0)
      .skip(parseInt(skip) || 0);

    const [records, total] = await Promise.all([
      query,
      Attendance.countDocuments(filter)
    ]);

    res.json({ success: true, total, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const record = await Attendance.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    logToFile({ action: 'UPDATE', record: record._id, time: new Date() });

    res.json({ success: true, message: 'Record updated', data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const record = await Attendance.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    logToFile({ action: 'DELETE', record: req.params.id, time: new Date() });

    res.json({ success: true, message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rateAttendance = async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be 1–5' });
    }
    const record = await Attendance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { rating },
      { new: true }
    );
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, message: 'Rating saved', data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  try {
    const record = await Attendance.findOne({ _id: req.params.id, userId: req.user._id });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    record.favorite = !record.favorite;
    await record.save();
    res.json({ success: true, message: `${record.favorite ? 'Added to' : 'Removed from'} favorites`, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  rateAttendance,
  toggleFavorite
};
