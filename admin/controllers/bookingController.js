const path = require('path');
const { pool } = require(path.join(__dirname, '../../backend/config/mysql'));

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;

        let query = `
            SELECT b.*, g.name as guest_name, g.email as guest_email, 
                   r.room_number, r.room_type
            FROM bookings b
            LEFT JOIN guests g ON b.guest_id = g.id
            LEFT JOIN rooms r ON b.room_id = r.id
            WHERE 1=1
        `;

        const params = [];

        if (status) {
            query += ' AND b.status = ?';
            params.push(status);
        }

        if (startDate) {
            query += ' AND b.check_in >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND b.check_out <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY b.created_at DESC';

        const [bookings] = await pool.query(query, params);

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single booking
// @route   GET /api/admin/bookings/:id
// @access  Private (Admin)
exports.getBooking = async (req, res) => {
    try {
        const [bookings] = await pool.query(
            `SELECT b.*, g.name as guest_name, g.email as guest_email, g.phone as guest_phone,
                    r.room_number, r.room_type, r.price_per_night
             FROM bookings b
             LEFT JOIN guests g ON b.guest_id = g.id
             LEFT JOIN rooms r ON b.room_id = r.id
             WHERE b.id = ?`,
            [req.params.id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: bookings[0]
        });

    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Please provide status'
            });
        }

        const validStatuses = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Check if booking exists
        const [existing] = await pool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = existing[0];

        // Update room status based on booking status
        if (status === 'checked-in') {
            await pool.query(
                'UPDATE rooms SET status = "occupied" WHERE id = ?',
                [booking.room_id]
            );
        } else if (status === 'checked-out' || status === 'cancelled') {
            await pool.query(
                'UPDATE rooms SET status = "available" WHERE id = ?',
                [booking.room_id]
            );
        }

        await pool.query(
            'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, req.params.id]
        );

        const [updated] = await pool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: updated[0]
        });

    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete booking
// @route   DELETE /api/admin/bookings/:id
// @access  Private (Admin)
exports.deleteBooking = async (req, res) => {
    try {
        const [existing] = await pool.query(
            'SELECT * FROM bookings WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = existing[0];

        // If booking was active, make room available
        if (booking.status === 'confirmed' || booking.status === 'checked-in') {
            await pool.query(
                'UPDATE rooms SET status = "available" WHERE id = ?',
                [booking.room_id]
            );
        }

        await pool.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });

    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
