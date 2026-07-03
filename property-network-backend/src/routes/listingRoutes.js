const express = require('express')
const router = express.Router()
const { createListing, getAllListings, getListingById, updateListing, deleteListing } = require('../controllers/listingController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.get('/', getAllListings)
router.get('/:id', getListingById)
router.post('/', protect, allowRoles('agent'), createListing)
router.put('/:id', protect, allowRoles('agent'), updateListing)
router.delete('/:id', protect, allowRoles('agent', 'admin'), deleteListing)

module.exports = router