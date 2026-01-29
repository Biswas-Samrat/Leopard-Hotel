const path = require('path');
const { pool } = require(path.join(__dirname, '../../backend/config/mysql'));

// @desc    Get all rooms
// @route   GET /api/admin/rooms
// @access  Private (Admin)
exports.getAllRooms = async (req, res) => {
    try {
        const [rooms] = await pool.query(
            'SELECT * FROM rooms ORDER BY room_number ASC'
        );

        res.json({
            success: true,
            count: rooms.length,
            data: rooms
        });

    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single room
// @route   GET /api/admin/rooms/:id
// @access  Private (Admin)
exports.getRoom = async (req, res) => {
    try {
        const [rooms] = await pool.query(
            'SELECT * FROM rooms WHERE id = ?',
            [req.params.id]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        res.json({
            success: true,
            data: rooms[0]
        });

    } catch (error) {
        console.error('Get room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create new room
// @route   POST /api/admin/rooms
// @access  Private (Admin)
exports.createRoom = async (req, res) => {
    try {
        const { room_number, room_type, capacity, price_per_night, status, description, amenities } = req.body;

        // Validation
        if (room_number === undefined || room_number === '' ||
            room_type === undefined || room_type === '' ||
            capacity === undefined || capacity === '' ||
            price_per_night === undefined || price_per_night === '') {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: Room Number, Type, Capacity, and Price'
            });
        }

        // Check if room number already exists
        const [existing] = await pool.query(
            'SELECT id FROM rooms WHERE room_number = ?',
            [room_number]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Room number already exists'
            });
        }

        const [result] = await pool.query(
            `INSERT INTO rooms (room_number, room_type, capacity, price_per_night, status, description, amenities, images) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [room_number, room_type, capacity, price_per_night, status || 'available', description, amenities, '[]']
        );

        const [newRoom] = await pool.query(
            'SELECT * FROM rooms WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Room created successfully',
            data: newRoom[0]
        });

    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update room (Dynamic fields)
// @route   PUT /api/admin/rooms/:id
// @access  Private (Admin)
exports.updateRoom = async (req, res) => {
    try {
        const { room_number, room_type, capacity, price_per_night, status, description, amenities, images } = req.body;

        // Check if room exists
        const [existing] = await pool.query(
            'SELECT id FROM rooms WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Dynamic update
        const fields = [];
        const values = [];

        if (room_number !== undefined) { fields.push('room_number = ?'); values.push(room_number); }
        if (room_type !== undefined) { fields.push('room_type = ?'); values.push(room_type); }
        if (capacity !== undefined) { fields.push('capacity = ?'); values.push(capacity); }
        if (price_per_night !== undefined) { fields.push('price_per_night = ?'); values.push(price_per_night); }
        if (status !== undefined) { fields.push('status = ?'); values.push(status); }
        if (description !== undefined) { fields.push('description = ?'); values.push(description); }
        if (amenities !== undefined) { fields.push('amenities = ?'); values.push(amenities); }
        if (images !== undefined) {
            // images might be passed as string from JSON.stringify in frontend
            fields.push('images = ?');
            values.push(typeof images === 'string' ? images : JSON.stringify(images));
        }

        if (fields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        values.push(req.params.id);

        await pool.query(
            `UPDATE rooms SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
            values
        );

        const [updatedRoom] = await pool.query(
            'SELECT * FROM rooms WHERE id = ?',
            [req.params.id]
        );

        res.json({
            success: true,
            message: 'Room updated successfully',
            data: updatedRoom[0]
        });

    } catch (error) {
        console.error('Update room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete room
// @route   DELETE /api/admin/rooms/:id
// @access  Private (Admin)
exports.deleteRoom = async (req, res) => {
    try {
        // Check if room exists
        const [existing] = await pool.query(
            'SELECT id FROM rooms WHERE id = ?',
            [req.params.id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Delete the room (MySQL will cascade delete associated bookings)
        await pool.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);

        res.json({
            success: true,
            message: 'Room deleted successfully'
        });

    } catch (error) {
        console.error('Delete room error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all booked rooms with details
// @route   GET /api/admin/rooms/booked
// @access  Private (Admin)
exports.getBookedRooms = async (req, res) => {
    try {
        const [rooms] = await pool.query(
            `SELECT r.*, b.check_in, b.check_out, b.num_guests, b.special_requests, g.name as guest_name, g.email as guest_email, g.phone as guest_phone
             FROM rooms r
             LEFT JOIN bookings b ON r.id = b.room_id 
                AND b.id = (
                    SELECT id FROM bookings 
                    WHERE room_id = r.id 
                    AND status != 'cancelled' 
                    ORDER BY created_at DESC 
                    LIMIT 1
                )
             LEFT JOIN guests g ON b.guest_id = g.id
             WHERE r.status IN ('booked', 'occupied', 'Booked')`
        );

        res.json({
            success: true,
            count: rooms.length,
            data: rooms
        });
    } catch (error) {
        console.error('Get booked rooms error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getAllRooms: exports.getAllRooms,
    getRoom: exports.getRoom,
    createRoom: exports.createRoom,
    updateRoom: exports.updateRoom,
    deleteRoom: exports.deleteRoom,
    getBookedRooms: exports.getBookedRooms
};
