import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { contactInfo } from '../data/content'

export function buildWhatsAppLink(message) {
  const phoneDigits = contactInfo.whatsapp.match(/\d+/g)?.join('') || ''
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
}

export default function WhatsAppButton({ message = "Hi Shruti Fotography! I'd love to enquire about a photography session.", floating = true }) {
  const href = buildWhatsAppLink(message)

  if (!floating) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-bg transition-transform duration-300 hover:scale-[1.03]"
      >
        <FaWhatsapp size={18} /> Chat on WhatsApp
      </a>
    )
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4, type: 'spring' }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-[0_8px_30px_rgba(37,211,102,0.5)]"
    >
      <FaWhatsapp />
    </motion.a>
  )
}
