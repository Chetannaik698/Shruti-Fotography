import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { contactInfo } from '../data/content'
import Reveal from './Reveal'
import { useGallery } from '../context/GalleryContext'
import { useTheme } from '../context/ThemeContext'
import api from '../api/axios'

export default function Contact() {
  const { categories } = useGallery()
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    bookingDate: '',
    description: '',
  })
  const [status, setStatus] = useState('idle') // idle, sending, sent, error
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category) {
      setStatus('error')
      setFeedbackMsg('Please select a Session Type.')
      return
    }

    setStatus('sending')
    setFeedbackMsg('')

    try {
      await api.post('/bookings', formData)
      setStatus('sent')
      setFeedbackMsg('Your session booking request has been sent! We will contact you soon.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        bookingDate: '',
        description: '',
      })
    } catch (err) {
      setStatus('error')
      setFeedbackMsg(err.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="relative bg-bg py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Get in Touch</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">Let&rsquo;s Tell Your Story</h2>
          <p className="mt-5 text-muted">Tell us a little about your date and vision — we typically respond within 24 hours.</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-10">
          <Reveal y={30} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6">
              <ContactRow icon={<FiPhone />} label="Phone" value={contactInfo.phone} href={`tel:${contactInfo.phone.replace(/[^+\d]/g, '')}`} />
              <ContactRow icon={<FiPhone />} label="Landline" value={contactInfo.landline} href={`tel:${contactInfo.landline.replace(/[^\d]/g, '')}`} />
              <ContactRow icon={<FiMail />} label="Email" value={contactInfo.email} href={`mailto:${contactInfo.email}`} />
              <ContactRow icon={<FiMapPin />} label="Studio" value={contactInfo.address} />

              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-bg transition-transform duration-300 hover:scale-[1.03]"
              >
                <FaWhatsapp size={18} /> Chat on WhatsApp
              </a>

              <div className="mt-4 overflow-hidden rounded-sm border border-ink/10">
                <iframe
                  title="Shruti Fotography location"
                  src={contactInfo.mapEmbed}
                  width="100%"
                  height="240"
                  style={{ border: 0, filter: theme === 'dark' ? 'grayscale(1) invert(0.92) contrast(0.85)' : 'grayscale(0.15)' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          <Reveal y={30} delay={0.15} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-md border border-ink/10 bg-card p-8 md:p-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Field label="Full Name" id="name" placeholder="Pooja Kamath" value={formData.name} onChange={handleChange} required />
                <Field label="Email" id="email" type="email" placeholder="pooja@gmail.com" value={formData.email} onChange={handleChange} required />
                <Field label="Phone" id="phone" placeholder="+91 81052 05660" value={formData.phone} onChange={handleChange} required />
                
                <div>
                  <label htmlFor="category" className="mb-2 block text-xs uppercase tracking-widest text-muted">
                    Session Type (Category)
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-ink/15 bg-card px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                    style={{ colorScheme: theme }}
                  >
                    <option value="" disabled className="text-ink/30 bg-card">Select a Category...</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat._id || cat.id} className="text-ink bg-card">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Field 
                  label="Booking Date" 
                  id="bookingDate" 
                  type="date" 
                  value={formData.bookingDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="mt-6">
                <label htmlFor="description" className="mb-2 block text-xs uppercase tracking-widest text-muted">
                  Your Story / Vision
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your date, venue and vision..."
                  className="w-full resize-none rounded-sm border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold"
                />
              </div>

              {feedbackMsg && (
                <div className={`mt-6 text-sm ${status === 'sent' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {feedbackMsg}
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === 'sending'}
                className="btn-primary mt-8 w-full sm:w-auto"
              >
                {status === 'idle' && (<><FiSend /> Book Session</>)}
                {status === 'sending' && 'Sending Request...'}
                {status === 'sent' && 'Sent Successfully ✓'}
                {status === 'error' && 'Try Again'}
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactRow({ icon, label, value, href }) {
  const content = (
    <div className="flex items-start gap-4 rounded-sm border border-ink/10 bg-card p-5 transition-colors hover:border-gold/40">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-widest text-muted">{label}</p>
        <p className="mt-1 text-sm text-ink">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href}>{content}</a> : content
}

function Field({ label, id, type = 'text', placeholder, value, onChange, required = false }) {
  const { theme } = useTheme()
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs uppercase tracking-widest text-muted">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-sm border border-ink/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors focus:border-gold"
        style={{ colorScheme: theme }}
      />
    </div>
  )
}
