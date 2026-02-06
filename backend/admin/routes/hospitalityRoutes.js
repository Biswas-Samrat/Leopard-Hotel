const express = require('express');
const {
    getRestaurantBookings,
    getPubBookings,
    getFunctionBookings,
    updateRestaurantBookingStatus,
    updatePubBookingStatus,
    updateFunctionBookingStatus,
    deleteRestaurantBooking,
    deletePubBooking,
    deleteFunctionBooking
} = require('../controllers/hospitalityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/restaurant', protect, getRestaurantBookings);
router.put('/restaurant/:id/status', protect, updateRestaurantBookingStatus);
router.delete('/restaurant/:id', protect, deleteRestaurantBooking);

router.get('/pub', protect, getPubBookings);
router.put('/pub/:id/status', protect, updatePubBookingStatus);
router.delete('/pub/:id', protect, deletePubBooking);

router.get('/function', protect, getFunctionBookings);
router.put('/function/:id/status', protect, updateFunctionBookingStatus);
router.delete('/function/:id', protect, deleteFunctionBooking);

module.exports = router;
