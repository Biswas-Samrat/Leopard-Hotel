const express = require('express');
const { getRooms, getRoom } = require('../controllers/roomController');

const router = express.Router();

router.route('/').get(getRooms);
router.route('/:id').get(getRoom);

module.exports = router;
