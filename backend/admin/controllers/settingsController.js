const path = require('path');
const { pool } = require('../../config/mysql');

// @desc    Get settings by key
// @route   GET /api/admin/settings/:key
// @access  Public
exports.getSettings = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT setting_value FROM settings WHERE setting_key = ?',
            [req.params.key]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Setting not found'
            });
        }

        let config = rows[0].setting_value;
        if (typeof config === 'string') {
            try {
                config = JSON.parse(config);
            } catch (e) {
                // Already an object or invalid JSON
            }
        }

        res.json({
            success: true,
            data: config
        });

    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update settings by key
// @route   PUT /api/admin/settings/:key
// @access  Private (Admin)
exports.updateSettings = async (req, res) => {
    try {
        const { value } = req.body;

        if (!value) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a value'
            });
        }

        const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value);

        await pool.query(
            'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            [req.params.key, stringifiedValue, stringifiedValue]
        );

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: value
        });

    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
