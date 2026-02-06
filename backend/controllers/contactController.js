const { pool } = require('../config/mysql');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
exports.createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email and message'
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
