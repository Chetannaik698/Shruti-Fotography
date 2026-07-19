import express from 'express'
import { createPayment, getPayments, updatePaymentStatus } from '../controllers/paymentController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', createPayment)
router.get('/', protect, adminOnly, getPayments)
router.put('/:id/status', protect, adminOnly, updatePaymentStatus)

export default router
