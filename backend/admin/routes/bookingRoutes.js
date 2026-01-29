const express = require('express');
const router = express.Router();
const {
    getAllBookings,
    getBooking,
    updateBookingStatus,
    deleteBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/', protect, getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
