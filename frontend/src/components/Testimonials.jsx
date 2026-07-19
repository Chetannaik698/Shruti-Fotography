import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { testimonials } from '../data/content'
import Reveal from './Reveal'

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)

  const go = useCallback((dir) => {
    setDirection(dir)
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => go(1), 6000)
    return () => clearInterval(t)
  }, [paused, go])

  const t = testimonials[index]

  return (
    <section className="relative overflow-hidden bg-bg py-28 lg:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gold/5 blur-[140px]" />

      <div className="relative mx-auto max-w-4xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Client Stories</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">Words From Those We&rsquo;ve Photographed</h2>
        </Reveal>

        <div
          className="relative mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={t.name}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-md border border-ink/10 bg-ink/[0.03] p-10 backdrop-blur-xl md:p-14"
            >
              <FaQuoteLeft className="text-gold/40" size={30} />
              <p className="mt-6 font-display text-xl leading-relaxed text-ink md:text-2xl text-balance">
                {t.quote}
              </p>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-gold/30"
                  />
                  <div>
                    <p className="font-display text-base text-ink">{t.name}</p>
                    <p className="text-xs uppercase tracking-widest text-muted">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FaStar key={i} size={14} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-colors hover:border-gold hover:text-gold"
            >
              <FiChevronLeft />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-7 bg-gold' : 'w-1.5 bg-ink/20'
                  }`}
                />
              ))}
            </div>
            <button
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-colors hover:border-gold hover:text-gold"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
