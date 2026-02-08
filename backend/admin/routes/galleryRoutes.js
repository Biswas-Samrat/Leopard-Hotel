const express = require('express');
const {
    addGalleryPhoto,
    replaceGalleryPhoto,
    deleteGalleryPhoto,
    getGalleryPhotos
} = require('../../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { uploadGallery } = require('../../utils/uploadHelpers');

const router = express.Router();

router.get('/:category', protect, getGalleryPhotos);
router.post('/:category', protect, uploadGallery.array('images', 20), addGalleryPhoto);
router.put('/:photoId', protect, uploadGallery.single('image'), replaceGalleryPhoto);
router.delete('/:photoId', protect, deleteGalleryPhoto);

module.exports = router;
