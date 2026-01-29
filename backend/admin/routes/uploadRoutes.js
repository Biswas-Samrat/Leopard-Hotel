const express = require('express');
const router = express.Router();
const { uploadRoomImage, deleteRoomImage, getRoomImages, uploadGeneralImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { uploadRoomImage: roomUpload, uploadGeneral: generalUpload } = require('../../utils/uploadHelpers');

// All routes are protected
router.post('/room/:roomId', protect, roomUpload.array('room_images', 10), uploadRoomImage);
router.post('/general', protect, generalUpload.single('image'), uploadGeneralImage);
router.delete('/room/:roomId/image', protect, deleteRoomImage);
router.get('/room/:roomId/images', protect, getRoomImages);

module.exports = router;
