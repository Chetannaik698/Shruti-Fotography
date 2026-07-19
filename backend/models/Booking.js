import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category (Session Type) is required'],
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Booking', bookingSchema)
