const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: true,
    },
    guestName: {
        type: String,
        required: [true, 'Please add a name'],
    },
    guestEmail: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    checkIn: {
        type: Date,
        required: [true, 'Please add check-in date'],
    },
    checkOut: {
        type: Date,
        required: [true, 'Please add check-out date'],
    },
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Booking', BookingSchema);
