import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiCalendar, FiMail, FiPhone, FiInfo, FiCheckCircle } from 'react-icons/fi'
import api from '../../api/axios'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedDescription, setSelectedDescription] = useState(null)

  const loadBookings = () => {
    setLoading(true)
    api
      .get('/bookings')
      .then(({ data }) => setBookings(data.bookings))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(loadBookings, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this booking request?')) return
    setError('')
    try {
      await api.delete(`/bookings/${id}`)
      setBookings((prev) => prev.filter((b) => (b.id || b._id) !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink flex items-center gap-3">
            <span className="text-gold"><FiCalendar /></span>
            Session Bookings
          </h1>
          <p className="mt-1 text-sm text-muted">View and manage photography and services bookings from your customers.</p>
        </div>
        <button
          onClick={loadBookings}
          className="btn-outline !px-5 !py-2.5 text-xs font-semibold self-start"
        >
          Refresh Bookings
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center text-muted text-sm">Loading bookings...</div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-md border border-white/10 bg-card/40 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-card text-xs uppercase tracking-widest text-muted border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Session Type</th>
                  <th className="px-6 py-4">Desired Date</th>
                  <th className="px-6 py-4">Story & Details</th>
                  <th className="px-6 py-4">Received On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => {
                  const bookingId = b._id || b.id
                  return (
                    <tr key={bookingId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-ink">{b.name}</div>
                        <div className="mt-1 flex flex-col gap-0.5 text-xs text-muted">
                          <a href={`mailto:${b.email}`} className="flex items-center gap-1 hover:text-gold transition-colors">
                            <FiMail size={12} /> {b.email}
                          </a>
                          <a href={`tel:${b.phone}`} className="flex items-center gap-1 hover:text-gold transition-colors">
                            <FiPhone size={12} /> {b.phone}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full bg-gold/10 border border-gold/20 px-3 py-1 text-xs text-gold font-medium">
                          {b.category?.name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-ink font-medium">
                          <span className="text-gold"><FiCalendar size={14} /></span>
                          {formatDate(b.bookingDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        {b.description ? (
                          <div className="flex items-start gap-2">
                            <p className="truncate text-xs text-muted flex-1">
                              {b.description}
                            </p>
                            <button
                              onClick={() => setSelectedDescription(b.description)}
                              className="text-gold/80 hover:text-gold shrink-0 transition-colors"
                              title="View full story"
                            >
                              <FiInfo size={14} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-white/20 italic text-xs">No details provided</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        {formatDateTime(b.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDelete(bookingId)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                            title="Remove booking"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted">
                      <div className="flex flex-col items-center gap-2">
                        <FiCheckCircle size={32} className="text-gold/40" />
                        <p className="text-sm">No session bookings found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Description Modal Popup */}
      <AnimatePresence>
        {selectedDescription && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg overflow-hidden rounded-md border border-white/10 bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display text-lg text-ink">Customer Story & Vision</h3>
                <button
                  onClick={() => setSelectedDescription(null)}
                  className="rounded-full p-1 text-muted hover:bg-white/5 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="mt-4 text-sm leading-relaxed text-muted max-h-96 overflow-y-auto pr-2">
                {selectedDescription}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedDescription(null)}
                  className="btn-outline !px-4 !py-2 text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
