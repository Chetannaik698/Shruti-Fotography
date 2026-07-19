import asyncHandler from 'express-async-handler'
import Like from '../models/Like.js'
import Image from '../models/Image.js'

// @desc    Toggle like/unlike on an image
// @route   POST /api/likes/:imageId
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  const { imageId } = req.params
  const { action } = req.body

  const image = await Image.findById(imageId)
  if (!image) {
    res.status(404)
    throw new Error('Image not found')
  }

  let liked
  if (req.user) {
    const existing = await Like.findOne({ user: req.user._id, image: imageId })

    if (existing) {
      await existing.deleteOne()
      image.likesCount = Math.max(0, image.likesCount - 1)
      liked = false
    } else {
      await Like.create({ user: req.user._id, image: imageId })
      image.likesCount += 1
      liked = true
    }
  } else {
    if (action === 'unlike') {
      image.likesCount = Math.max(0, image.likesCount - 1)
      liked = false
    } else {
      image.likesCount += 1
      liked = true
    }
  }

  await image.save()

  res.status(200).json({
    success: true,
    liked,
    likesCount: image.likesCount,
  })
})

// @desc    Get all images the current user has liked (their favorites)
// @route   GET /api/likes/me
// @access  Private
export const getMyLikes = asyncHandler(async (req, res) => {
  const likes = await Like.find({ user: req.user._id }).populate({
    path: 'image',
    populate: { path: 'category', select: 'name slug' },
  })

  const images = likes
    .filter((l) => l.image)
    .map((l) => ({
      id: l.image._id,
      title: l.image.title,
      imageUrl: l.image.imageUrl,
      tall: l.image.tall,
      likesCount: l.image.likesCount,
      category: l.image.category ? { name: l.image.category.name, slug: l.image.category.slug } : null,
    }))

  res.status(200).json({ success: true, count: images.length, images })
})
