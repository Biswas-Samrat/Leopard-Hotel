const { pool } = require('../config/mysql');
const { deleteImage } = require('../utils/uploadHelpers');

// @desc    Get all gallery photos by category
// @route   GET /api/gallery/:category
// @access  Public
exports.getGalleryPhotos = async (req, res) => {
    try {
        const { category } = req.params;
        const [photos] = await pool.query(
            'SELECT * FROM gallery_photos WHERE category = ? ORDER BY display_order ASC',
            [category]
        );
        res.status(200).json({
            success: true,
            data: photos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add photos to gallery
// @route   POST /api/admin/gallery/:category
// @access  Private/Admin
exports.addGalleryPhoto = async (req, res) => {
    try {
        const { category } = req.params;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images provided'
            });
        }

        // Check 20 photo limit
        const [countResult] = await pool.query(
            'SELECT COUNT(*) as count FROM gallery_photos WHERE category = ?',
            [category]
        );

        const currentCount = countResult[0].count;
        if (currentCount + files.length > 20) {
            // Delete uploaded files from Cloudinary
            for (const file of files) {
                await deleteImage(file.filename);
            }
            return res.status(400).json({
                success: false,
                message: `Cannot upload ${files.length} photos. Limit is 20 per gallery. Current: ${currentCount}, New: ${files.length}.`
            });
        }

        const uploadedPhotos = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const imageUrl = file.path;
            const publicId = file.filename;
            const displayOrder = currentCount + i;

            const [result] = await pool.query(
                'INSERT INTO gallery_photos (category, image_url, public_id, display_order) VALUES (?, ?, ?, ?)',
                [category, imageUrl, publicId, displayOrder]
            );

            uploadedPhotos.push({
                id: result.insertId,
                category,
                image_url: imageUrl,
                public_id: publicId,
                display_order: displayOrder
            });
        }

        res.status(201).json({
            success: true,
            data: uploadedPhotos,
            message: `Successfully uploaded ${files.length} photos`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Replace gallery photo
// @route   PUT /api/admin/gallery/:photoId
// @access  Private/Admin
exports.replaceGalleryPhoto = async (req, res) => {
    try {
        const { photoId } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image provided'
            });
        }

        // Get old photo details to delete from Cloudinary
        const [oldPhoto] = await pool.query('SELECT public_id FROM gallery_photos WHERE id = ?', [photoId]);

        if (oldPhoto.length === 0) {
            await deleteImage(req.file.filename);
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        const newImageUrl = req.file.path;
        const newPublicId = req.file.filename;

        // Delete old image
        await deleteImage(oldPhoto[0].public_id);

        // Update database
        await pool.query(
            'UPDATE gallery_photos SET image_url = ?, public_id = ? WHERE id = ?',
            [newImageUrl, newPublicId, photoId]
        );

        res.status(200).json({
            success: true,
            data: {
                id: photoId,
                image_url: newImageUrl,
                public_id: newPublicId
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete gallery photo
// @route   DELETE /api/admin/gallery/:photoId
// @access  Private/Admin
exports.deleteGalleryPhoto = async (req, res) => {
    try {
        const { photoId } = req.params;

        const [photo] = await pool.query('SELECT public_id FROM gallery_photos WHERE id = ?', [photoId]);

        if (photo.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
        }

        // Delete from Cloudinary
        await deleteImage(photo[0].public_id);

        // Delete from database
        await pool.query('DELETE FROM gallery_photos WHERE id = ?', [photoId]);

        res.status(200).json({
            success: true,
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
