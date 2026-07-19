import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useGallery } from '../context/GalleryContext'
import { getOptimizedCloudinaryUrl } from '../utils/image'

export default function Favorites() {
  const { isAuthenticated } = useAuth()
  const { images: allImages, fetchImages } = useGallery()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get('/likes/me')
        .then(({ data }) => {
          const normalized = data.images.map((img) => ({
            ...img,
            imageUrl: getOptimizedCloudinaryUrl(img.imageUrl),
            thumbnailUrl: getOptimizedCloudinaryUrl(img.imageUrl, 800),
            optimizedUrl: getOptimizedCloudinaryUrl(img.imageUrl, 1600),
          }))
          setImages(normalized)
        })
        .catch((err) => setError(err.response?.data?.message || 'Failed to load favorites'))
        .finally(() => setLoading(false))
    } else {
      const loadGuestFavorites = async () => {
        try {
          let guestLikes = []
          try {
            guestLikes = JSON.parse(localStorage.getItem('guest_likes') || '[]')
          } catch (e) {
            guestLikes = []
          }

          if (guestLikes.length === 0) {
            setImages([])
            setLoading(false)
            return
          }

          let currentImages = allImages
          if (currentImages.length === 0) {
            currentImages = await fetchImages()
          }

          const favs = currentImages.filter((img) => guestLikes.includes(img.id))
          setImages(favs)
        } catch (err) {
          setError('Failed to load favorites')
        } finally {
          setLoading(false)
        }
      }
      loadGuestFavorites()
    }
  }, [isAuthenticated, allImages, fetchImages])

  return (
    <div className="min-h-screen bg-bg px-6 py-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow">My Favorites</p>
        <h1 className="mt-3 section-heading">Images You&rsquo;ve Loved</h1>

        {loading && <p className="mt-10 text-muted">Loading...</p>}
        {error && <p className="mt-10 text-red-400">{error}</p>}

        {!loading && images.length === 0 && !error && (
          <div className="mt-16 flex flex-col items-center gap-3 text-muted">
            <FiHeart size={28} />
            <p>You haven&rsquo;t liked any images yet. Browse the portfolio and tap the heart on your favorites.</p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <motion.figure
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="overflow-hidden rounded-sm bg-card"
            >
              <img src={img.thumbnailUrl || img.imageUrl} alt={img.title} className="aspect-[4/5] w-full object-cover" />
              <figcaption className="p-3">
                <p className="text-sm text-ink">{img.title}</p>
                <p className="text-xs text-gold">{img.category?.name}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </div>
  )
}
