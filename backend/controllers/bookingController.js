const Booking = require('../models/Booking');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res, next) => {
    try {
        const booking = await Booking.create(req.body);
        res.status(201).json({ success: true, data: booking });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public (Should be private in production)
exports.getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate('room');
        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
