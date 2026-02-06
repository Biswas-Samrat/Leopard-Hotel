const path = require('path');
const { pool } = require(path.join(__dirname, '../../config/mysql'));

// Helper to disable caching
const noCache = (res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
};

// @desc    Get all restaurant bookings
// @route   GET /api/admin/hospitality/restaurant
// @access  Private/Admin
exports.getRestaurantBookings = async (req, res) => {
    try {
        noCache(res);
        const [rows] = await pool.query('SELECT * FROM restaurant_bookings ORDER BY date DESC, time DESC');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (err) {
        console.error('Get restaurant bookings error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get all pub bookings
// @route   GET /api/admin/hospitality/pub
// @access  Private/Admin
exports.getPubBookings = async (req, res) => {
    try {
        noCache(res);
        const [rows] = await pool.query('SELECT * FROM pub_bookings ORDER BY date DESC, time DESC');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (err) {
        console.error('Get pub bookings error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get all function bookings
// @route   GET /api/admin/hospitality/function
// @access  Private/Admin
exports.getFunctionBookings = async (req, res) => {
    try {
        noCache(res);
        const [rows] = await pool.query('SELECT * FROM function_bookings ORDER BY date DESC');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (err) {
        console.error('Get function bookings error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update restaurant booking status
// @route   PUT /api/admin/hospitality/restaurant/:id/status
// @access  Private/Admin
exports.updateRestaurantBookingStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        console.log(`[Restaurant] Updating ID: ${id} to Status: ${status}`);

        const [result] = await pool.query(
            'UPDATE restaurant_bookings SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            console.log(`[Restaurant] ID ${id} not found.`);
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        console.log(`[Restaurant] Update Success. Rows: ${result.affectedRows}`);
        res.json({
            success: true,
            message: 'Booking status updated',
            affectedRows: result.affectedRows
        });
    } catch (err) {
        console.error('Update booking status error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
    }
};

// @desc    Update pub booking status
// @route   PUT /api/admin/hospitality/pub/:id/status
// @access  Private/Admin
exports.updatePubBookingStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        console.log(`[Pub] Updating ID: ${id} to Status: ${status}`);

        const [result] = await pool.query(
            'UPDATE pub_bookings SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            console.log(`[Pub] ID ${id} not found.`);
            return res.status(404).json({ success: false, message: 'Pub booking not found' });
        }

        console.log(`[Pub] Update Success.`);
        res.json({ success: true, message: 'Booking status updated' });
    } catch (err) {
        console.error('Update pub booking status error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update function booking status
// @route   PUT /api/admin/hospitality/function/:id/status
// @access  Private/Admin
exports.updateFunctionBookingStatus = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;

        console.log(`[Function] Updating ID: ${id} to Status: ${status}`);

        const [result] = await pool.query(
            'UPDATE function_bookings SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            console.log(`[Function] ID ${id} not found.`);
            return res.status(404).json({ success: false, message: 'Function booking not found' });
        }

        console.log(`[Function] Update Success.`);
        res.json({ success: true, message: 'Booking status updated' });
    } catch (err) {
        console.error('Update function booking status error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete restaurant booking
// @route   DELETE /api/admin/hospitality/restaurant/:id
// @access  Private/Admin
exports.deleteRestaurantBooking = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        console.log(`[Restaurant] Deleting ID: ${id}`);

        const [result] = await pool.query(
            'DELETE FROM restaurant_bookings WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, message: 'Booking deleted' });
    } catch (err) {
        console.error('Delete restaurant booking error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete pub booking
// @route   DELETE /api/admin/hospitality/pub/:id
// @access  Private/Admin
exports.deletePubBooking = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        console.log(`[Pub] Deleting ID: ${id}`);

        const [result] = await pool.query(
            'DELETE FROM pub_bookings WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, message: 'Booking deleted' });
    } catch (err) {
        console.error('Delete pub booking error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete function booking
// @route   DELETE /api/admin/hospitality/function/:id
// @access  Private/Admin
exports.deleteFunctionBooking = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        console.log(`[Function] Deleting ID: ${id}`);

        const [result] = await pool.query(
            'DELETE FROM function_bookings WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, message: 'Booking deleted' });
    } catch (err) {
        console.error('Delete function booking error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
