import express from 'express'
import { toggleLike, getMyLikes } from '../controllers/likeController.js'
import { protect } from '../middleware/authMiddleware.js'
import optionalAuth from '../middleware/optionalAuth.js'

const router = express.Router()

router.get('/me', protect, getMyLikes)
router.post('/:imageId', optionalAuth, toggleLike)

export default router

