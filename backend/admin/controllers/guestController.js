const path = require('path');
const { pool } = require('../../config/mysql');

// @desc    Get all guests
// @route   GET /api/admin/guests
// @access  Private (Admin)
exports.getAllGuests = async (req, res) => {
    try {
        const { search } = req.query;

        let query = 'SELECT * FROM guests WHERE 1=1';
        const params = [];

        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC';

        const [guests] = await pool.query(query, params);

        res.json({
            success: true,
            count: guests.length,
            data: guests
        });

    } catch (error) {
        console.error('Get guests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single guest with booking history
// @route   GET /api/admin/guests/:id
// @access  Private (Admin)
exports.getGuest = async (req, res) => {
    try {
        const [guests] = await pool.query(
            'SELECT * FROM guests WHERE id = ?',
            [req.params.id]
        );

        if (guests.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guest not found'
            });
        }

        // Get guest's booking history
        const [bookings] = await pool.query(
            `SELECT b.*, r.room_number, r.room_type 
             FROM bookings b
             LEFT JOIN rooms r ON b.room_id = r.id
             WHERE b.guest_id = ?
             ORDER BY b.created_at DESC`,
            [req.params.id]
        );

        res.json({
            success: true,
            data: {
                ...guests[0],
                bookings
            }
        });

    } catch (error) {
        console.error('Get guest error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update guest
// @route   PUT /api/admin/guests/:id
// @access  Private (Admin)
exports.updateGuest = async (req, res) => {
    try {
        const { name, email, phone, address, id_proof } = req.body;

        const [existing] = await pool.query(
            'SELECT id FROM guests WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guest not found'
            });
        }

        await pool.query(
            `UPDATE guests 
             SET name = ?, email = ?, phone = ?, address = ?, id_proof = ?, updated_at = NOW()
             WHERE id = ?`,
            [name, email, phone, address, id_proof, req.params.id]
        );

        const [updated] = await pool.query(
            'SELECT * FROM guests WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Guest updated successfully',
            data: updated[0]
        });

    } catch (error) {
        console.error('Update guest error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete guest
// @route   DELETE /api/admin/guests/:id
// @access  Private (Admin)
exports.deleteGuest = async (req, res) => {
    try {
        const [existing] = await pool.query(
            'SELECT id FROM guests WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Guest not found'
            });
        }

        // Check if guest has active bookings
        const [activeBookings] = await pool.query(
            'SELECT id FROM bookings WHERE guest_id = ? AND status IN ("pending", "confirmed", "checked-in")',
            [req.params.id]
        );

        if (activeBookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete guest with active bookings'
            });
        }

        await pool.query('DELETE FROM guests WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Guest deleted successfully'
        });

    } catch (error) {
        console.error('Delete guest error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
