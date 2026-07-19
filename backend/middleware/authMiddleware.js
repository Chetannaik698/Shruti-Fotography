import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/User.js'

// Verifies the JWT (from Authorization header or httpOnly cookie) and attaches req.user
export const protect = asyncHandler(async (req, res, next) => {
  let token

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    if (!user) {
      res.status(401)
      throw new Error('Not authorized, user no longer exists')
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized, token invalid or expired')
  }
})

// Restricts access to admin/owner accounts only
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  res.status(403)
  throw new Error('Access denied — admin privileges required')
}
