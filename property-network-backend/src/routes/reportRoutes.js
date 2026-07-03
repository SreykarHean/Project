const express = require('express')
const router = express.Router()
const { createReport, getAllReports, updateReportStatus } = require('../controllers/reportController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.post('/', protect, allowRoles('buyer'), createReport)
router.get('/', protect, allowRoles('admin'), getAllReports)
router.patch('/:id', protect, allowRoles('admin'), updateReportStatus)

module.exports = router