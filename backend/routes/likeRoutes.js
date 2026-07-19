import express from 'express'
import { toggleLike, getMyLikes } from '../controllers/likeController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/me', protect, getMyLikes)
router.post('/:imageId', protect, toggleLike)

export default router
