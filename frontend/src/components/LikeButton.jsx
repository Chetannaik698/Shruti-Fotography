import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGallery } from '../context/GalleryContext'

export default function LikeButton({ image, size = 16, className = '' }) {
  const { isAuthenticated } = useAuth()
  const { toggleLike } = useGallery()
  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await toggleLike(image.id)
    } catch (err) {
      // Silently ignore — a toast system could surface this in a fuller app
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      aria-label={image.likedByMe ? 'Unlike image' : 'Like image'}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
        image.likedByMe
          ? 'border-gold bg-gold/10 text-gold'
          : 'border-white/30 text-white/80 hover:border-gold hover:text-gold'
      } ${className}`}
    >
      <FiHeart className={image.likedByMe ? 'fill-gold' : ''} size={size} />
      {image.likesCount ?? 0}
    </motion.button>
  )
}
