import { useEffect, useState } from 'react'
import { FiCalendar, FiMail, FiPhone, FiInfo, FiCheck, FiX, FiCreditCard } from 'react-icons/fi'
import api from '../../api/axios'

export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState(null)

  const loadPayments = () => {
    setLoading(true)
    api
      .get('/payments')
      .then(({ data }) => setPayments(data.payments))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load payments'))
      .finally(() => setLoading(false))
  }

  useEffect(loadPayments, [])

  const handleUpdateStatus = async (id, status) => {
    const actionText = status === 'verified' ? 'Verify' : 'Reject'
    if (!confirm(`Are you sure you want to mark this payment as ${status.toUpperCase()}?`)) return
    setError('')
    try {
      const response = await api.put(`/payments/${id}/status`, { status })
      if (response.data.success) {
        setPayments((prev) =>
          prev.map((p) => ((p._id || p.id) === id ? { ...p, status } : p))
        )
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update payment to ${status}`)
    }
  }

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt)
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
            <span className="text-gold"><FiCreditCard /></span>
            Payment Confirmations
          </h1>
          <p className="mt-1 text-sm text-muted">Review and verify payment receipts submitted by customers against your bank statement.</p>
        </div>
        <button
          onClick={loadPayments}
          className="btn-outline !px-5 !py-2.5 text-xs font-semibold self-start"
        >
          Refresh Payments
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-16 flex justify-center text-muted text-sm">Loading payments...</div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-md border border-white/10 bg-card/40 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-card text-xs uppercase tracking-widest text-muted border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4 font-mono">UTR / Transaction ID</th>
                  <th className="px-6 py-4">Payment Note</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Received On</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-muted">
                      No payment confirmations submitted yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => {
                    const paymentId = p._id || p.id
                    return (
                      <tr key={paymentId} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-ink">{p.name}</div>
                          <div className="mt-1 flex flex-col gap-0.5 text-xs text-muted">
                            <a href={`mailto:${p.email}`} className="flex items-center gap-1 hover:text-gold transition-colors">
                              <FiMail size={12} /> {p.email}
                            </a>
                            <a href={`tel:${p.phone}`} className="flex items-center gap-1 hover:text-gold transition-colors">
                              <FiPhone size={12} /> {p.phone}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gold">
                            {formatAmount(p.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-mono text-xs text-ink/90 font-medium select-all">
                            {p.transactionId}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          {p.note ? (
                            <div className="flex items-start gap-2">
                              <p className="truncate text-xs text-muted flex-1">
                                {p.note}
                              </p>
                              <button
                                onClick={() => setSelectedNote(p.note)}
                                className="text-gold/80 hover:text-gold shrink-0 transition-colors"
                                title="View payment note"
                              >
                                <FiInfo size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-white/20 italic text-xs">No details</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {p.status === 'verified' && (
                            <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">
                              Verified
                            </span>
                          )}
                          {p.status === 'rejected' && (
                            <span className="inline-block rounded-full bg-red-500/10 border border-red-500/20 px-3 py-0.5 text-[10px] text-red-400 uppercase tracking-widest font-semibold">
                              Rejected
                            </span>
                          )}
                          {p.status === 'pending' && (
                            <span className="inline-block rounded-full bg-yellow-500/10 border border-yellow-500/20 px-3 py-0.5 text-[10px] text-yellow-400 uppercase tracking-widest font-semibold animate-pulse">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted">
                          {formatDateTime(p.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdateStatus(paymentId, 'verified')}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300"
                                title="Verify Payment"
                              >
                                <FiCheck size={16} />
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(paymentId, 'rejected')}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300"
                                title="Reject Payment"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted italic">Processed</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Note modal */}
      {selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md border border-white/10 bg-card p-6 shadow-2xl">
            <h3 className="font-display text-xl text-ink">Payment Note / details</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted whitespace-pre-wrap">{selectedNote}</p>
            <button
              onClick={() => setSelectedNote(null)}
              className="btn-outline mt-6 w-full py-2.5 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
