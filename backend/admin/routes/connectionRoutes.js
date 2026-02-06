const express = require('express');
const { getAllMessages, deleteMessage } = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllMessages);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
