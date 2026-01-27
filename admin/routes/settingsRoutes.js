const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.get('/:key', getSettings);
router.put('/:key', protect, updateSettings);

module.exports = router;
