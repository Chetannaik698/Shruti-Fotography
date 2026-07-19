import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZoomIn, FiImage } from 'react-icons/fi'
import Reveal from './Reveal'
import Lightbox from './Lightbox'
import LikeButton from './LikeButton'
import ShareButton from './ShareButton'
import { useGallery } from '../context/GalleryContext'

export default function Portfolio() {
  const { categories, images, loading, fetchImages } = useGallery()
  const [active, setActive] = useState('all')
  const [lightboxImage, setLightboxImage] = useState(null)

  const allTabs = useMemo(() => [{ _id: 'all', name: 'All', slug: 'all' }, ...categories], [categories])

  const filtered = useMemo(
    () => (active === 'all' ? images : images.filter((img) => img.category?.slug === active)),
    [active, images]
  )

  const handleTab = async (slug) => {
    setActive(slug)
    await fetchImages(slug)
  }

  const currentImage = useMemo(() => {
    if (!lightboxImage) return null
    return images.find((img) => img.id === lightboxImage.id) || lightboxImage
  }, [lightboxImage, images])

  const currentIndex = currentImage ? filtered.findIndex((f) => f.id === currentImage.id) : -1

  const showAt = (delta) => {
    const next = (currentIndex + delta + filtered.length) % filtered.length
    setLightboxImage(filtered[next])
  }

  return (
    <section id="portfolio" className="relative bg-bg py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Selected Work</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">A Portfolio Built on Feeling</h2>
          <p className="mt-5 text-muted">
            Every frame is chosen for what it makes you feel, not just what it shows. Explore stories across weddings, portraits, fashion and events.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {allTabs.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleTab(cat.slug)}
              className={`relative rounded-full border px-5 py-2 text-xs uppercase tracking-widest transition-colors duration-300 ${
                active === cat.slug
                  ? 'border-gold text-gold'
                  : 'border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </Reveal>

        {loading && (
          <div className="mt-16 flex justify-center text-muted text-sm">Loading gallery...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 text-muted">
            <FiImage size={28} />
            <p className="text-sm">No images in this category yet. Check back soon.</p>
          </div>
        )}

        <motion.div layout className="mt-8 sm:mt-14 columns-3 gap-1 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.figure
                layout
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group relative mb-1 sm:mb-5 break-inside-avoid overflow-hidden rounded-[4px] sm:rounded-md bg-card cursor-pointer"
                onClick={() => setLightboxImage(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  loading="lazy"
                  className="h-auto w-full block transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-4 items-end justify-between p-2 sm:p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div>
                    <p className="text-[8px] sm:text-[10px] uppercase tracking-widest2 text-gold">{item.category?.name}</p>
                    <p className="mt-0.5 sm:mt-1 font-display text-[10px] sm:text-lg text-white leading-tight">{item.title}</p>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <LikeButton image={item} />
                    <ShareButton image={item} />
                    <span
                      className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FiZoomIn size={15} />
                    </span>
                  </div>
                </div>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Lightbox
        image={currentImage}
        onClose={() => setLightboxImage(null)}
        onPrev={() => showAt(-1)}
        onNext={() => showAt(1)}
      />
    </section>
  )
}
