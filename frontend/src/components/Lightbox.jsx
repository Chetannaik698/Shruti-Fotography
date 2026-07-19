import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import LikeButton from './LikeButton'
import ShareButton from './ShareButton'
import { buildWhatsAppLink } from './WhatsAppButton'

export default function Lightbox({ image, onClose, onPrev, onNext }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-bg/95 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.button
            aria-label="Close preview"
            onClick={onClose}
            className="absolute right-6 top-6 z-10 text-2xl text-ink/70 hover:text-gold transition-colors"
            whileHover={{ rotate: 90 }}
          >
            <FiX />
          </motion.button>

          <button
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-3 md:left-8 z-10 text-3xl text-ink/60 hover:text-gold transition-colors"
          >
            <FiChevronLeft />
          </button>

          <motion.div
            key={image.id}
            className="relative max-h-[82vh] max-w-4xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.imageUrl}
              alt={image.title}
              className="max-h-[82vh] w-auto rounded-sm object-contain shadow-card"
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg text-ink">{image.title}</p>
                <span className="eyebrow">{image.category?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <LikeButton image={image} />
                <ShareButton image={image} />
                <a
                  href={buildWhatsAppLink(
                    `Hi Shruti Fotography! I'm interested in a session like "${image.title}"${image.category?.name ? ` (${image.category.name})` : ''}. Could you share availability and pricing?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-bg transition-transform hover:scale-105"
                >
                  <FaWhatsapp /> Enquire
                </a>
              </div>
            </div>
          </motion.div>

          <button
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-3 md:right-8 z-10 text-3xl text-ink/60 hover:text-gold transition-colors"
          >
            <FiChevronRight />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
