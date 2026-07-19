import asyncHandler from 'express-async-handler'
import Image from '../models/Image.js'
import Like from '../models/Like.js'
import Category from '../models/Category.js'
import { uploadBufferToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js'

// @desc    Get all gallery images (optionally filtered by category slug, with pagination)
// @route   GET /api/gallery?category=weddings&page=1&limit=24
// @access  Public
export const getImages = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 50 } = req.query

  const filter = {}
  if (category && category !== 'all') {
    const cat = await Category.findOne({ slug: category })
    if (!cat) {
      return res.status(200).json({ success: true, count: 0, images: [] })
    }
    filter.category = cat._id
  }

  const skip = (Number(page) - 1) * Number(limit)

  const [images, total] = await Promise.all([
    Image.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Image.countDocuments(filter),
  ])

  // If the request is authenticated, mark which images the user has liked
  let likedImageIds = new Set()
  if (req.user) {
    const likes = await Like.find({ user: req.user._id, image: { $in: images.map((i) => i._id) } })
    likedImageIds = new Set(likes.map((l) => l.image.toString()))
  }

  const payload = images.map((img) => ({
    id: img._id,
    title: img.title,
    description: img.description,
    imageUrl: img.imageUrl,
    tall: img.tall,
    featured: img.featured,
    likesCount: img.likesCount,
    likedByMe: likedImageIds.has(img._id.toString()),
    category: img.category ? { id: img.category._id, name: img.category.name, slug: img.category.slug } : null,
    createdAt: img.createdAt,
  }))

  res.status(200).json({ success: true, count: payload.length, total, page: Number(page), images: payload })
})

// @desc    Get single image by id
// @route   GET /api/gallery/:id
// @access  Public
export const getImageById = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id).populate('category', 'name slug')
  if (!image) {
    res.status(404)
    throw new Error('Image not found')
  }
  res.status(200).json({ success: true, image })
})

// @desc    Upload a new gallery image
// @route   POST /api/gallery
// @access  Private/Admin
export const createImage = asyncHandler(async (req, res) => {
  const { title, category, description, tall, featured } = req.body

  if (!req.file) {
    res.status(400)
    throw new Error('An image file is required')
  }
  if (!title || !category) {
    res.status(400)
    throw new Error('Title and category are required')
  }

  const categoryDoc = await Category.findById(category)
  if (!categoryDoc) {
    res.status(400)
    throw new Error('Selected category does not exist')
  }

  const result = await uploadBufferToCloudinary(req.file.buffer)

  const image = await Image.create({
    title,
    category: categoryDoc._id,
    description,
    tall: tall === 'true' || tall === true,
    featured: featured === 'true' || featured === true,
    imageUrl: result.secure_url,
    cloudinaryId: result.public_id,
    uploadedBy: req.user._id,
  })

  const populated = await image.populate('category', 'name slug')

  res.status(201).json({ success: true, message: 'Image uploaded successfully', image: populated })
})

// @desc    Update image details (title, category, description, flags). Optionally replace the file.
// @route   PUT /api/gallery/:id
// @access  Private/Admin
export const updateImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id)
  if (!image) {
    res.status(404)
    throw new Error('Image not found')
  }

  const { title, category, description, tall, featured } = req.body

  if (category) {
    const categoryDoc = await Category.findById(category)
    if (!categoryDoc) {
      res.status(400)
      throw new Error('Selected category does not exist')
    }
    image.category = categoryDoc._id
  }

  if (title !== undefined) image.title = title
  if (description !== undefined) image.description = description
  if (tall !== undefined) image.tall = tall === 'true' || tall === true
  if (featured !== undefined) image.featured = featured === 'true' || featured === true

  // Replace the underlying file if a new one was uploaded
  if (req.file) {
    const result = await uploadBufferToCloudinary(req.file.buffer)
    await deleteFromCloudinary(image.cloudinaryId)
    image.imageUrl = result.secure_url
    image.cloudinaryId = result.public_id
  }

  await image.save()
  const populated = await image.populate('category', 'name slug')

  res.status(200).json({ success: true, message: 'Image updated successfully', image: populated })
})

// @desc    Delete a gallery image (removes from Cloudinary + DB + related likes)
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id)
  if (!image) {
    res.status(404)
    throw new Error('Image not found')
  }

  await deleteFromCloudinary(image.cloudinaryId)
  await Like.deleteMany({ image: image._id })
  await image.deleteOne()

  res.status(200).json({ success: true, message: 'Image deleted successfully' })
})
