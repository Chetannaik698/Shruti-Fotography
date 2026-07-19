import { motion } from 'framer-motion'
import { FaInstagram } from 'react-icons/fa'
import { instagramImages } from '../data/content'
import Reveal from './Reveal'

export default function InstagramGallery() {
  return (
    <section className="relative bg-bg py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Follow Along</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">@shrutifotography</h2>
          <p className="mt-5 text-muted">Behind-the-scenes moments and fresh galleries, shared daily.</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {instagramImages.map((src, i) => (
            <Reveal key={src} delay={i * 0.06} y={20}>
              <motion.a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="group relative block aspect-square overflow-hidden rounded-sm bg-card"
                whileHover="hover"
              >
                <motion.img
                  src={src}
                  alt="Shruti Fotography Instagram post"
                  loading="lazy"
                  variants={{ hover: { scale: 1.12 } }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full w-full object-cover"
                />
                <motion.div
                  variants={{ hover: { opacity: 1 } }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center bg-bg/60"
                >
                  <FaInstagram className="text-gold" size={22} />
                </motion.div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
