import asyncHandler from 'express-async-handler'
import { validationResult } from 'express-validator'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400)
    throw new Error(errors.array()[0].msg)
  }

  const { name, email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    res.status(409)
    throw new Error('An account with this email already exists')
  }

  // Only the very first account (if none exist) becomes admin automatically.
  const userCount = await User.countDocuments()
  const role = userCount === 0 ? 'admin' : 'user'

  const user = await User.create({ name, email, password, role })
  const token = generateToken(user._id)

  res.cookie('token', token, cookieOptions)
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: user.toSafeObject(),
  })
})

// @desc    Login with email & password
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400)
    throw new Error(errors.array()[0].msg)
  }

  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  const token = generateToken(user._id)

  res.cookie('token', token, cookieOptions)
  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    user: user.toSafeObject(),
  })
})

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toSafeObject() })
})

// @desc    Logout — clears auth cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', cookieOptions)
  res.status(200).json({ success: true, message: 'Logged out successfully' })
})
