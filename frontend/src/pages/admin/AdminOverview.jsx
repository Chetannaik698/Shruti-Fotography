import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiImage, FiTag, FiUsers, FiHeart, FiCalendar } from 'react-icons/fi'
import api from '../../api/axios'

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(({ data }) => setStats(data.stats))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
  }, [])

  const cards = [
    { label: 'Gallery Images', value: stats?.imageCount ?? '—', icon: <FiImage /> },
    { label: 'Categories', value: stats?.categoryCount ?? '—', icon: <FiTag /> },
    { label: 'Bookings', value: stats?.bookingCount ?? '—', icon: <FiCalendar /> },
    { label: 'Registered Users', value: stats?.userCount ?? '—', icon: <FiUsers /> },
    { label: 'Total Likes', value: stats?.likeCount ?? '—', icon: <FiHeart /> },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-muted">A snapshot of your studio&rsquo;s live content.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="rounded-md border border-white/10 bg-card p-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold">
              {c.icon}
            </span>
            <p className="mt-4 font-display text-3xl text-ink">{c.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {stats?.recentImages?.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl text-ink">Recently Uploaded</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stats.recentImages.map((img) => (
              <div key={img._id} className="overflow-hidden rounded-sm border border-white/10">
                <img src={img.imageUrl} alt={img.title} className="aspect-square w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {stats?.topLiked?.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl text-ink">Most Liked</h2>
          <div className="mt-4 space-y-2">
            {stats.topLiked.map((img) => (
              <div
                key={img._id}
                className="flex items-center justify-between rounded-sm border border-white/10 bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <img src={img.imageUrl} alt={img.title} className="h-10 w-10 rounded-sm object-cover" />
                  <div>
                    <p className="text-sm text-ink">{img.title}</p>
                    <p className="text-xs text-muted">{img.category?.name}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-sm text-gold">
                  <FiHeart /> {img.likesCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
