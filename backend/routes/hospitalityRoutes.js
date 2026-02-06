const express = require('express');
const {
    createRestaurantBooking,
    createPubBooking,
    createFunctionBooking
} = require('../controllers/hospitalityController');

const router = express.Router();

router.post('/restaurant', createRestaurantBooking);
router.post('/pub', createPubBooking);
router.post('/function', createFunctionBooking);

module.exports = router;
