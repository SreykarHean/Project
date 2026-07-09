const express = require('express')
const router = express.Router()
const { createReport, getAllReports, updateReportStatus, getReportsForListing, respondToReport } = require('../controllers/reportController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.post('/', protect, allowRoles('buyer'), createReport)
router.get('/', protect, allowRoles('admin'), getAllReports)
router.patch('/:id', protect, allowRoles('admin'), updateReportStatus)
router.get('/listing/:listing_id', protect, allowRoles('agent'), getReportsForListing)
router.patch('/:id/response', protect, allowRoles('agent'), respondToReport)

module.exports = router