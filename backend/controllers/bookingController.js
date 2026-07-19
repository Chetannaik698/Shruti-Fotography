import asyncHandler from 'express-async-handler'
import Booking from '../models/Booking.js'
import Category from '../models/Category.js'

// @desc    Create a new session booking request
// @route   POST /api/bookings
// @access  Public
export const createBooking = asyncHandler(async (req, res) => {
  const { name, email, phone, category, bookingDate, description } = req.body

  if (!name || !email || !phone || !category || !bookingDate) {
    res.status(400)
    throw new Error('Please provide all required fields: name, email, phone, category, and bookingDate')
  }

  // Check if category exists
  const categoryExists = await Category.findById(category)
  if (!categoryExists) {
    res.status(400)
    throw new Error('Invalid Category (Session Type)')
  }

  const booking = await Booking.create({
    name,
    email,
    phone,
    category,
    bookingDate,
    description,
  })

  res.status(201).json({
    success: true,
    message: 'Booking request sent successfully!',
    booking,
  })
})

// @desc    Get all booking requests
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('category', 'name')
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  })
})

// @desc    Delete a booking request
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)

  if (!booking) {
    res.status(404)
    throw new Error('Booking request not found')
  }

  await booking.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Booking request deleted successfully',
  })
})
