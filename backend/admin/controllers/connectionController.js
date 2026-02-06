const { pool } = require('../../config/mysql');

// @desc    Get all contact messages
// @route   GET /api/admin/connection
// @access  Private/Admin
exports.getAllMessages = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Delete a message
// @route   DELETE /api/admin/connection/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.json({ success: true, message: 'Message deleted' });
    } catch (err) {
        console.error('Delete message error:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
