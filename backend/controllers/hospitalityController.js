const path = require('path');
const { pool } = require(path.join(__dirname, '../config/mysql'));

// @desc    Create new restaurant booking
// @route   POST /api/hospitality/restaurant
// @access  Public
exports.createRestaurantBooking = async (req, res, next) => {
    try {
        const { name, email, phone, date, time, guests, special_requests } = req.body;

        if (!name || !email || !date || !time || !guests) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const [result] = await pool.query(
            `INSERT INTO restaurant_bookings (name, email, phone, date, time, guests, special_requests)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, phone || '', date, time, guests, special_requests || null]
        );

        res.status(201).json({
            success: true,
            message: 'Restaurant booking created successfully',
            data: { id: result.insertId, ...req.body }
        });

    } catch (err) {
        console.error('Create restaurant booking error:', err);
        res.status(400).json({
            success: false,
            message: 'Error creating booking',
            error: err.message
        });
    }
};

// @desc    Create new pub booking
// @route   POST /api/hospitality/pub
// @access  Public
exports.createPubBooking = async (req, res, next) => {
    try {
        const { name, email, phone, date, time, guests, special_requests } = req.body;

        if (!name || !email || !date || !time || !guests) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const [result] = await pool.query(
            `INSERT INTO pub_bookings (name, email, phone, date, time, guests, special_requests)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, phone || '', date, time, guests, special_requests || null]
        );

        res.status(201).json({
            success: true,
            message: 'Pub booking created successfully',
            data: { id: result.insertId, ...req.body }
        });

    } catch (err) {
        console.error('Create pub booking error:', err);
        res.status(400).json({
            success: false,
            message: 'Error creating booking',
            error: err.message
        });
    }
};

// @desc    Create new function room enquiry/booking
// @route   POST /api/hospitality/function
// @access  Public
exports.createFunctionBooking = async (req, res, next) => {
    try {
        const { name, email, phone, event_type, date, guests, details } = req.body;

        if (!name || !email || !event_type || !date) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const [result] = await pool.query(
            `INSERT INTO function_bookings (name, email, phone, event_type, date, guests, details)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, phone || '', event_type, date, guests || 0, details || null]
        );

        res.status(201).json({
            success: true,
            message: 'Function enquiry submitted successfully',
            data: { id: result.insertId, ...req.body }
        });

    } catch (err) {
        console.error('Create function booking error:', err);
        res.status(400).json({
            success: false,
            message: 'Error submitting enquiry',
            error: err.message
        });
    }
};
