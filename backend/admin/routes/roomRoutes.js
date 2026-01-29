const express = require('express');
const router = express.Router();
const {
    getAllRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
    getBookedRooms
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

// Booked rooms route must come before /:id
router.route('/booked')
    .get(protect, getBookedRooms);

// All routes are protected
router.route('/')
    .get(protect, getAllRooms)
    .post(protect, createRoom);

router.route('/:id')
    .get(protect, getRoom)
    .put(protect, updateRoom)
    .delete(protect, deleteRoom);

module.exports = router;
