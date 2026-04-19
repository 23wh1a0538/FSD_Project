const express = require('express');
const router = express.Router();
const {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  rateAttendance,
  toggleFavorite
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getAllAttendance)
  .post(createAttendance);

router.route('/:id')
  .get(getAttendanceById)
  .put(updateAttendance)
  .delete(deleteAttendance);

router.put('/:id/rate', rateAttendance);
router.put('/:id/favorite', toggleFavorite);

module.exports = router;
