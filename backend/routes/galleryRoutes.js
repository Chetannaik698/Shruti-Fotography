import express from 'express'
import {
  getImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
} from '../controllers/galleryController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import optionalAuth from '../middleware/optionalAuth.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.get('/', optionalAuth, getImages)
router.get('/:id', getImageById)
router.post('/', protect, adminOnly, upload.single('image'), createImage)
router.put('/:id', protect, adminOnly, upload.single('image'), updateImage)
router.delete('/:id', protect, adminOnly, deleteImage)

export default router
