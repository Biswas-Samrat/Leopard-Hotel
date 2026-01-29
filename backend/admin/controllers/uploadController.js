const path = require('path');
const { pool } = require('../../config/mysql');
const { deleteImage } = require('../../utils/uploadHelpers');

// @desc    Upload room image
// @route   POST /api/admin/upload/room/:roomId
// @access  Private (Admin)
exports.uploadRoomImage = async (req, res) => {
    try {
        const { roomId } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        // Get current room images
        const [rooms] = await pool.query(
            'SELECT images FROM rooms WHERE id = ?',
            [roomId]
        );

        if (rooms.length === 0) {
            // Delete uploaded images if room doesn't exist
            for (const file of req.files) {
                await deleteImage(file.filename);
            }
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Parse existing images
        let images = [];
        try {
            images = rooms[0].images ? (typeof rooms[0].images === 'string' ? JSON.parse(rooms[0].images) : rooms[0].images) : [];
        } catch (e) {
            images = [];
        }

        // Add new images
        const newImages = req.files.map(file => ({
            url: file.path,
            publicId: file.filename,
            uploadedAt: new Date(),
            isSelected: false, // For gallery selection (not used yet)
            isMain: images.length === 0 // If it's the first image, make it main
        }));

        images = [...images, ...newImages];

        // Update room with new images array
        await pool.query(
            'UPDATE rooms SET images = ? WHERE id = ?',
            [JSON.stringify(images), roomId]
        );

        res.json({
            success: true,
            message: `${newImages.length} image(s) uploaded successfully`,
            newImages,
            allImages: images
        });

    } catch (error) {
        console.error('Upload room image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete room image
// @route   DELETE /api/admin/upload/room/:roomId/image
// @access  Private (Admin)
exports.deleteRoomImage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({
                success: false,
                message: 'Public ID is required'
            });
        }

        // Get current room images
        const [rooms] = await pool.query(
            'SELECT images FROM rooms WHERE id = ?',
            [roomId]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Parse existing images
        let images = [];
        try {
            images = rooms[0].images ? (typeof rooms[0].images === 'string' ? JSON.parse(rooms[0].images) : rooms[0].images) : [];
        } catch (e) {
            images = [];
        }

        // Remove image from array
        const updatedImages = images.filter(img => img.publicId !== publicId);

        // Delete from Cloudinary
        await deleteImage(publicId);

        // Update database
        await pool.query(
            'UPDATE rooms SET images = ? WHERE id = ?',
            [JSON.stringify(updatedImages), roomId]
        );

        res.json({
            success: true,
            message: 'Image deleted successfully',
            allImages: updatedImages
        });

    } catch (error) {
        console.error('Delete room image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get room images
// @route   GET /api/admin/upload/room/:roomId/images
// @access  Private (Admin)
exports.getRoomImages = async (req, res) => {
    try {
        const { roomId } = req.params;

        const [rooms] = await pool.query(
            'SELECT images FROM rooms WHERE id = ?',
            [roomId]
        );

        if (rooms.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        let images = [];
        try {
            images = rooms[0].images ? (typeof rooms[0].images === 'string' ? JSON.parse(rooms[0].images) : rooms[0].images) : [];
        } catch (e) {
            images = [];
        }

        res.json({
            success: true,
            images
        });

    } catch (error) {
        console.error('Get room images error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Upload general image
// @route   POST /api/admin/upload/general
// @access  Private (Admin)
exports.uploadGeneralImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        res.json({
            success: true,
            url: req.file.path,
            publicId: req.file.filename
        });

    } catch (error) {
        console.error('Upload general image error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

