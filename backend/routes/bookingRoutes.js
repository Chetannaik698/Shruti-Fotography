import express from 'express'
import { createBooking, getBookings, deleteBooking } from '../controllers/bookingController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', createBooking)
router.get('/', protect, adminOnly, getBookings)
router.delete('/:id', protect, adminOnly, deleteBooking)

export default router
