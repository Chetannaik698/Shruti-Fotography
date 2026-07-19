import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
})

/**
 * Uploads a file buffer (from multer memoryStorage) to Cloudinary.
 * Returns the Cloudinary upload result (secure_url, public_id, etc.)
 */
export const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'lumiframe-studio/gallery',
        resource_type: 'image',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    streamifier.createReadStream(buffer).pipe(uploadStream)
  })
}

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return
  await cloudinary.uploader.destroy(publicId)
}

export default cloudinary
