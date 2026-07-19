import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShare2, FiLink, FiCheck } from 'react-icons/fi'
import { FaWhatsapp, FaFacebookF, FaTwitter } from 'react-icons/fa'

export default function ShareButton({ image, size = 16, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef(null)

  const imageUrl = image.imageUrl || image.src || ''
  const shareTitle = image.title || 'Studio Photography'
  const shareText = `Check out this beautiful photo "${shareTitle}" from Shruti Fotography!\n\nWebsite: ${window.location.origin}\nPhoto: ${imageUrl}`

  // Click outside to close dropdown
  useEffect(() => {
    if (!isOpen) return
    const handleClose = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClose)
    return () => document.removeEventListener('mousedown', handleClose)
  }, [isOpen])

  const handleShareClick = (e) => {
    e.stopPropagation()
    // If Web Share API is available on mobile/device, try it first
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: `Check out this beautiful photo "${shareTitle}" from Shruti Fotography!`,
        url: window.location.origin,
      })
      .catch(() => {
        // Fallback to custom menu if sharing cancelled or fails
        setIsOpen(!isOpen)
      })
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setIsOpen(false)
    }, 2000)
  }

  const getWhatsAppUrl = () => {
    return `https://wa.me/?text=${encodeURIComponent(shareText)}`
  }

  const getFacebookUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`
  }

  const getTwitterUrl = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
  }

  return (
    <div className="relative inline-block" ref={menuRef}>
      <motion.button
        onClick={handleShareClick}
        whileTap={{ scale: 0.85 }}
        aria-label="Share image"
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:border-gold hover:text-gold ${className}`}
      >
        <FiShare2 size={size} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-11 right-0 z-50 w-44 overflow-hidden rounded-sm border border-ink/10 bg-card/95 backdrop-blur-md p-1.5 shadow-gold"
          >
            <div className="flex flex-col gap-0.5">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs text-ink/80 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-colors"
              >
                <FaWhatsapp size={14} className="shrink-0" />
                WhatsApp
              </a>
              <a
                href={getFacebookUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs text-ink/80 hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-colors"
              >
                <FaFacebookF size={14} className="shrink-0" />
                Facebook
              </a>
              <a
                href={getTwitterUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs text-ink/80 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-colors"
              >
                <FaTwitter size={14} className="shrink-0" />
                Twitter / X
              </a>
              <button
                onClick={handleCopy}
                className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-xs text-ink/80 hover:bg-gold/10 hover:text-gold transition-colors"
              >
                {copied ? (
                  <>
                    <FiCheck size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <FiLink size={14} className="shrink-0" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
