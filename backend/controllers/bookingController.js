const path = require('path');
const { pool } = require(path.join(__dirname, '../config/mysql'));
const {
    validateRequired,
    validateEmail,
    validatePhone,
    validateNumeric,
    validateDate,
    validateMinLength
} = require('../utils/validation');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res, next) => {
    try {
        const { room_id, guest_name, guest_email, guest_phone, check_in, check_out, guests, special_requests } = req.body;

        // Validation
        const errors = [];
        if (!validateRequired(room_id)) errors.push('Room selection is required');
        if (!validateRequired(guest_name) || !validateMinLength(guest_name, 2)) errors.push('Valid name is required (min 2 chars)');
        if (!validateRequired(guest_email) || !validateEmail(guest_email)) errors.push('Valid email is required');
        if (!validateRequired(guest_phone) || !validatePhone(guest_phone)) errors.push('Valid phone number is required');
        if (!validateRequired(check_in) || !validateDate(check_in)) errors.push('Valid check-in date is required');
        if (!validateRequired(check_out) || !validateDate(check_out)) errors.push('Valid check-out date is required');
        if (check_in && check_out && new Date(check_in) >= new Date(check_out)) errors.push('Check-out date must be after check-in');

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        // Check if room exists and is available
        const [rooms] = await pool.query(
            'SELECT id, status, price_per_night FROM rooms WHERE id = ?',
            [room_id]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        const room = rooms[0];

        if (room.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'Room is not available for booking'
            });
        }

        // Calculate total price based on nights
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const total_price = room.price_per_night * nights;

        // Check if guest exists, if not create guest record
        let guestId;
        const [existingGuests] = await pool.query(
            'SELECT id FROM guests WHERE email = ?',
            [guest_email]
        );

        if (existingGuests.length > 0) {
            guestId = existingGuests[0].id;
            // Update guest info
            await pool.query(
                'UPDATE guests SET name = ?, phone = ? WHERE id = ?',
                [guest_name, guest_phone || null, guestId]
            );
        } else {
            // Create new guest
            const [guestResult] = await pool.query(
                'INSERT INTO guests (name, email, phone) VALUES (?, ?, ?)',
                [guest_name, guest_email, guest_phone || null]
            );
            guestId = guestResult.insertId;
        }

        // Create booking
        const [result] = await pool.query(
            `INSERT INTO bookings (room_id, guest_id, check_in, check_out, num_guests, total_amount, special_requests, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [room_id, guestId, check_in, check_out, guests || 1, total_price, special_requests || null, 'pending']
        );

        // Update room status to 'booked'
        await pool.query(
            'UPDATE rooms SET status = ? WHERE id = ?',
            ['booked', room_id]
        );

        // Get the created booking with room and guest details
        const [bookings] = await pool.query(
            `SELECT b.*, r.room_number, r.room_type, g.name as guest_name, g.email as guest_email
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             JOIN guests g ON b.guest_id = g.id
             WHERE b.id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: bookings[0]
        });

    } catch (err) {
        console.error('Create booking error:', err);
        res.status(400).json({
            success: false,
            message: 'Error creating booking',
            error: err.message
        });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public (Should be private in production)
exports.getBookings = async (req, res, next) => {
    try {
        const [bookings] = await pool.query(
            `SELECT b.*, r.room_number, r.room_type, r.price_per_night, 
                    g.name as guest_name, g.email as guest_email, g.phone as guest_phone
             FROM bookings b
             JOIN rooms r ON b.room_id = r.id
             JOIN guests g ON b.guest_id = g.id
             ORDER BY b.created_at DESC`
        );

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        console.error('Get bookings error:', err);
        res.status(400).json({
            success: false,
            message: 'Error fetching bookings',
            error: err.message
        });
    }
};
