import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      required: true,
    },
  },
  { timestamps: true }
)

// A user can like a given image only once
likeSchema.index({ user: 1, image: 1 }, { unique: true })

export default mongoose.model('Like', likeSchema)
