const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary Storage for Room Images
const roomImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'leopard-hotel/rooms',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto:good' }
        ]
    }
});

// Configure Cloudinary Storage for Guest Documents
const guestDocumentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'leopard-hotel/guests',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        transformation: [{ quality: 'auto' }]
    }
});

// Configure Cloudinary Storage for Gallery Images
const galleryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'leopard-hotel/gallery',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1600, height: 1200, crop: 'limit' },
            { quality: 'auto:good' }
        ]
    }
});

// Configure Cloudinary Storage for General Uploads
const generalStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'leopard-hotel/general',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'mov'],
        resource_type: 'auto'
    }
});

// File filter for images only
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer upload configurations
const uploadRoomImage = multer({
    storage: roomImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const uploadGuestDocument = multer({
    storage: guestDocumentStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const uploadGeneral = multer({
    storage: generalStorage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit
    }
});

const uploadGallery = multer({
    storage: galleryStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Helper function to get image URL with transformations
const getImageUrl = (publicId, transformation = {}) => {
    return cloudinary.url(publicId, transformation);
};

module.exports = {
    uploadRoomImage,
    uploadGuestDocument,
    uploadGeneral,
    uploadGallery,
    deleteImage,
    getImageUrl,
    cloudinary
};
