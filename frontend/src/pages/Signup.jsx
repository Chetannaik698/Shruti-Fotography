import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-md border border-white/10 bg-card p-8 md:p-10"
      >
        <Link to="/" className="font-display text-xl text-ink">
          LUMI<span className="text-gold">FRAME</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl text-ink">Create Account</h1>
        <p className="mt-2 text-sm text-muted">Join to save favorites and track your bookings.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <FieldWithIcon
            icon={<FiUser />}
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
          <FieldWithIcon
            icon={<FiMail />}
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
          />
          <FieldWithIcon
            icon={<FiLock />}
            type="password"
            placeholder="Password (min. 6 characters)"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating Account...' : <>Create Account <FiArrowRight /></>}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

function FieldWithIcon({ icon, type, placeholder, value, onChange, required }) {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-white/15 bg-transparent px-4 py-3 transition-colors focus-within:border-gold">
      <span className="text-muted">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-transparent text-sm text-ink placeholder:text-white/30 outline-none"
      />
    </div>
  )
}
