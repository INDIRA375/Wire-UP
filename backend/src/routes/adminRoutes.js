const express = require('express');
const { getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/bookings', protect, adminOnly, getAllBookings);
router.patch('/bookings/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
