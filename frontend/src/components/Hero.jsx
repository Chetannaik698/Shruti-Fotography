import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { FiArrowDown } from 'react-icons/fi'
import { heroImage } from '../data/content'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '60%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 50, damping: 20 })
  const py = useSpring(my, { stiffness: 50, damping: 20 })
  const parallaxX = useTransform(px, [-0.5, 0.5], [-14, 14])
  const parallaxY = useTransform(py, [-0.5, 0.5], [-14, 14])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center overflow-hidden bg-bg "
    >
      <motion.div className="absolute inset-0" style={{ y: bgY, x: parallaxX }}>
        <motion.img
          src={heroImage}
          alt="Bride and groom silhouetted at golden hour"
          className="h-[112%] w-full object-cover"
          style={{ y: parallaxY }}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Dynamic gradients for perfect readability and beautiful blending */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent lg:via-bg/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      <div className="absolute inset-0 dark:bg-black/20" />

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-36 pb-16 lg:px-10 lg:pt-44 lg:pb-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="eyebrow mb-6"
        >
          Since 2020 • Bhatkal, Karnataka
        </motion.p>

        <h1 className="max-w-4xl font-display text-[13vw] leading-[0.98] text-ink sm:text-6xl md:text-7xl lg:text-[5.6rem] text-balance">
          {['Capturing', 'Stories That', 'Last Forever'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.15 * i + 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-7 max-w-md font-body text-base text-ink/70 dark:text-white/70 md:text-lg"
        >
          Luxury Wedding, Portrait &amp; Event Photography — crafted with cinematic precision for those who don&rsquo;t forget a moment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#portfolio" className="btn-primary">
            View Portfolio
          </a>
          <a href="#contact" className="btn-outline">
            Book a Session
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#portfolio"
        aria-label="Scroll to portfolio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-ink/60 dark:text-white/60"
      >
        <span className="text-[10px] uppercase tracking-widest2">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FiArrowDown />
        </motion.span>
      </motion.a>
    </section>
  )
}
