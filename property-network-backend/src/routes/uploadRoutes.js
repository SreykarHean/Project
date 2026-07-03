const express = require('express')
const router = express.Router()
const { listingPhotoUpload } = require('../middleware/uploadMiddleware')
const { uploadListingPhoto } = require('../controllers/uploadController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.post(
    '/listings/:listing_id/photos',
    protect,
    allowRoles('agent'),
    (req, res, next) => {
        listingPhotoUpload.single('photo')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message })
            }
            next()
        })
    },
    uploadListingPhoto
)

module.exports = router
