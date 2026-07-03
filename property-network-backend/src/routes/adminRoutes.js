const express = require('express')
const router = express.Router()
const { getAllAgents, getAllBuyers, verifyAgent, updateBuyerStatus, getAllReports } = require('../controllers/adminController')
const { protect } = require('../middleware/authMiddleware')
const { allowRoles } = require('../middleware/roleMiddleware')

router.use(protect)
router.use(allowRoles('admin'))

router.get('/agents', getAllAgents)
router.put('/agents/:id/verify', verifyAgent)
router.get('/buyers', getAllBuyers)
router.put('/buyers/:id/status', updateBuyerStatus)
router.get('/reports', getAllReports)

module.exports = router
