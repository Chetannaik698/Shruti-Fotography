import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import Image from '../models/Image.js'
import Category from '../models/Category.js'
import Like from '../models/Like.js'
import Booking from '../models/Booking.js'

// @desc    Get admin dashboard summary stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = asyncHandler(async (req, res) => {
  const [userCount, imageCount, categoryCount, likeCount, bookingCount, topLiked, recentImages] = await Promise.all([
    User.countDocuments(),
    Image.countDocuments(),
    Category.countDocuments(),
    Like.countDocuments(),
    Booking.countDocuments(),
    Image.find().sort({ likesCount: -1 }).limit(5).populate('category', 'name'),
    Image.find().sort({ createdAt: -1 }).limit(6).populate('category', 'name'),
  ])

  res.status(200).json({
    success: true,
    stats: {
      userCount,
      imageCount,
      categoryCount,
      likeCount,
      bookingCount,
      topLiked,
      recentImages,
    },
  })
})

// @desc    List all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 })
  res.status(200).json({ success: true, count: users.length, users: users.map((u) => u.toSafeObject()) })
})

// @desc    Promote/demote a user's role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  if (!['user', 'admin'].includes(role)) {
    res.status(400)
    throw new Error("Role must be either 'user' or 'admin'")
  }

  if (req.params.id === req.user._id.toString()) {
    res.status(400)
    throw new Error('You cannot change your own role')
  }

  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  user.role = role
  await user.save()

  res.status(200).json({ success: true, message: 'User role updated', user: user.toSafeObject() })
})
