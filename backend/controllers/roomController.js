const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: room });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
