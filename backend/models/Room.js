const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a room name'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    pricePerNight: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    capacity: {
        type: Number,
        required: [true, 'Please add capacity'],
    },
    amenities: [String],
    images: [String],
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Room', RoomSchema);
