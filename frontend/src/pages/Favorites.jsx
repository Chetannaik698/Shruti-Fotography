import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'
import api from '../api/axios'

export default function Favorites() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/likes/me')
      .then(({ data }) => setImages(data.images))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load favorites'))
      .finally(() => setLoading(false))
  }, [])

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
              <img src={img.imageUrl} alt={img.title} className="aspect-[4/5] w-full object-cover" />
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
