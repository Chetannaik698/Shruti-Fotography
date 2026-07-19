import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import { seedDefaults } from './config/seeder.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

connectDB().then(() => {
  seedDefaults()
})

const app = express()

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Shruti Fotography API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Shruti Fotography API listening on port ${PORT} [${process.env.NODE_ENV || 'development'}]`)
})
