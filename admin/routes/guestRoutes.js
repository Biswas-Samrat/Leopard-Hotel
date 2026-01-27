const express = require('express');
const router = express.Router();
const {
    getAllGuests,
    getGuest,
    updateGuest,
    deleteGuest
} = require('../controllers/guestController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/', protect, getAllGuests);
router.get('/:id', protect, getGuest);
router.put('/:id', protect, updateGuest);
router.delete('/:id', protect, deleteGuest);

module.exports = router;
