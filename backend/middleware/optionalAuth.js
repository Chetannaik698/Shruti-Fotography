import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Attaches req.user if a valid token is present, but never blocks the request.
// Used on public routes (like the gallery feed) that behave slightly differently
// for logged-in users (e.g. showing "likedByMe").
const optionalAuth = async (req, res, next) => {
  let token

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (user) req.user = user
  } catch (err) {
    // Invalid/expired token on a public route — just proceed as a guest
  }

  next()
}

export default optionalAuth
