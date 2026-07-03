const { ListingPhoto } = require('../models')

const uploadListingPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' })
        }

        const listingId = parseInt(req.params.listing_id)

        const photo = await ListingPhoto.create({
            listing_id: listingId,
            photo_path: req.file.secure_url || req.file.path,
            display_order: req.body.display_order || 1,
        })

        res.status(201).json({
            success: true,
            message: 'Photo uploaded',
            data: {
                photo_id: photo.photo_id,
                photo_path: photo.photo_path,
                display_order: photo.display_order,
                listing_id: photo.listing_id,
            },
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = { uploadListingPhoto }