const express = require('express');
const { getGalleryPhotos } = require('../controllers/galleryController');

const router = express.Router();

router.get('/:category', getGalleryPhotos);

module.exports = router;
