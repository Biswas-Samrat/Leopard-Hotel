const path = require('path');
const { pool } = require(path.join(__dirname, '../config/mysql'));

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
    try {
        const [rooms] = await pool.query(
            'SELECT id, room_number, room_type, capacity, price_per_night, status, description, amenities, images FROM rooms WHERE status = ?',
            ['available'] // Only show available rooms to public
        );

        // Parse images JSON for each room
        const roomsWithImages = rooms.map(room => ({
            ...room,
            images: typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || [])
        }));

        res.status(200).json({
            success: true,
            count: roomsWithImages.length,
            data: roomsWithImages
        });
    } catch (err) {
        console.error('Error fetching rooms:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res, next) => {
    try {
        const [rooms] = await pool.query(
            'SELECT * FROM rooms WHERE id = ?',
            [req.params.id]
        );

        if (rooms.length === 0) {
            return res.status(404).json({ success: false, message: 'Room not found' });
        }

        const room = rooms[0];

        // Parse images JSON
        room.images = typeof room.images === 'string' ? JSON.parse(room.images) : (room.images || []);

        res.status(200).json({ success: true, data: room });
    } catch (err) {
        console.error('Error fetching room:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};
