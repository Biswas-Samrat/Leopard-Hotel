const express = require('express');
const router = express.Router();
const { getDashboardStats, getRevenueData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.get('/stats', protect, getDashboardStats);
router.get('/revenue', protect, getRevenueData);

module.exports = router;
