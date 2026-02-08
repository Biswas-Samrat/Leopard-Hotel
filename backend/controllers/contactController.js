const { pool } = require('../config/mysql');
const {
    validateRequired,
    validateEmail,
    validateMinLength
} = require('../utils/validation');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
exports.createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const errors = [];
        if (!validateRequired(name) || !validateMinLength(name, 2)) errors.push('Valid name is required (min 2 chars)');
        if (!validateRequired(email) || !validateEmail(email)) errors.push('Valid email is required');
        if (!validateRequired(message) || !validateMinLength(message, 10)) errors.push('Message is required (min 10 chars)');

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors
            });
        }

        const [result] = await pool.query(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || '', message]
        );

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: { id: result.insertId }
        });
    } catch (err) {
        console.error('Create message error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
