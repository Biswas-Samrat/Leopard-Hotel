const path = require('path');
const { pool } = require(path.join(__dirname, '../../backend/config/mysql'));

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total bookings
        const [bookingCount] = await pool.query(
            'SELECT COUNT(*) as total FROM bookings'
        );

        // Get total rooms
        const [roomCount] = await pool.query(
            'SELECT COUNT(*) as total FROM rooms'
        );

        // Get total guests
        const [guestCount] = await pool.query(
            'SELECT COUNT(*) as total FROM guests'
        );

        // Get revenue (assuming bookings have a total_amount field)
        const [revenue] = await pool.query(
            'SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = "confirmed"'
        );

        // Get recent bookings
        const [recentBookings] = await pool.query(
            `SELECT b.*, g.name as guest_name, r.room_number 
             FROM bookings b 
             LEFT JOIN guests g ON b.guest_id = g.id 
             LEFT JOIN rooms r ON b.room_id = r.id 
             ORDER BY b.created_at DESC 
             LIMIT 5`
        );

        // Get occupancy rate
        const [occupiedRooms] = await pool.query(
            'SELECT COUNT(*) as total FROM rooms WHERE status = "occupied"'
        );

        const totalRooms = roomCount[0].total;
        const occupancy = totalRooms > 0
            ? ((occupiedRooms[0].total / totalRooms) * 100).toFixed(2)
            : 0;

        res.json({
            success: true,
            stats: {
                totalBookings: bookingCount[0].total,
                totalRooms: roomCount[0].total,
                totalGuests: guestCount[0].total,
                totalRevenue: revenue[0].total,
                occupancyRate: occupancy
            },
            recentBookings
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get monthly revenue chart data
// @route   GET /api/admin/dashboard/revenue
// @access  Private (Admin)
exports.getRevenueData = async (req, res) => {
    try {
        const [monthlyRevenue] = await pool.query(
            `SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(total_amount) as revenue
             FROM bookings 
             WHERE status = 'confirmed'
             AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
             GROUP BY DATE_FORMAT(created_at, '%Y-%m')
             ORDER BY month ASC`
        );

        res.json({
            success: true,
            data: monthlyRevenue
        });

    } catch (error) {
        console.error('Revenue data error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
