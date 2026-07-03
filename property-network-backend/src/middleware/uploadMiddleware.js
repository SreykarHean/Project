const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const listingStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'property_network/listings',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
})

const profileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'property_network/profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    },
})

const listingPhotoUpload = multer({ storage: listingStorage })
const profilePhotoUpload = multer({ storage: profileStorage })

module.exports = { listingPhotoUpload, profilePhotoUpload }
