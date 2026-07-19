import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { stats } from '../data/content'
import rajImage from '../assets/Raj.png'
import Reveal from './Reveal'
import Counter from './Counter'

export default function About() {
  const targetRef = useRef(null)
  
  // Set up scrolling container relative scroll position for parallax effect
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  })
  
  // Translate Y from -30 to 30 for smooth parallax
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30])

  return (
    <section id="about" className="relative overflow-hidden bg-bg py-28 lg:py-36">
      {/* Background aesthetic touches */}
      <div className="absolute top-1/4 left-10 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
        
        {/* Left Side: Founder Image */}
        <div ref={targetRef} className="relative">
          <Reveal y={50} className="relative z-10">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-md border border-gold/15 bg-card">
              {/* Subtle gold glow behind image */}
              <div className="absolute -inset-8 bg-gold/10 blur-3xl rounded-full opacity-60" />
              
              <div className="relative h-full w-full overflow-hidden rounded-md">
                <motion.img
                  style={{ y }}
                  src={rajImage}
                  alt="Raj Gudigar - Founder of Shruti Photography"
                  loading="lazy"
                  className="h-[120%] w-full object-cover object-center scale-110 filter sepia-[0.15] contrast-[1.05] saturate-[1.05] brightness-[0.97] transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent mix-blend-multiply" />
                <div className="absolute inset-0 ring-1 ring-inset ring-gold/20 rounded-md" />
              </div>
            </div>
            
            {/* Floating Experience Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="absolute -bottom-8 -left-6 hidden w-56 rounded-md border border-gold/30 bg-black/75 p-6 backdrop-blur-lg shadow-[0_15px_35px_rgba(0,0,0,0.6)] md:block cursor-pointer transition-all duration-300"
            >
              <p className="font-display text-4xl font-semibold bg-gold-gradient bg-clip-text text-transparent">40+</p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-widest text-gold/80 leading-relaxed">
                Years Behind<br />the Lens
              </p>
            </motion.div>
          </Reveal>
        </div>

        {/* Right Side: Content */}
        <div>
          <Reveal>
            <p className="eyebrow">THE FOUNDER</p>
            <div className="divider-gold my-5" />
            <h2 className="section-heading text-balance font-display text-3xl md:text-4xl lg:text-5xl font-medium text-ink leading-tight">
              Four Decades Behind the Lens.<br />
              <span className="text-gold">A Lifetime Dedicated to Visual Storytelling.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 space-y-6 text-muted leading-relaxed font-body text-sm md:text-base">
              <p>
                Raj Gudigar is the creative force behind Shruti Photography, bringing over 40 years of experience behind the lens. Throughout his remarkable career, he has worked across photography, film productions, television serials, documentaries, weddings, commercial campaigns, and countless memorable events. His journey has been driven by passion, precision, creativity, and a deep understanding of visual storytelling.
              </p>
              <p>
                In 2020, he founded Shruti Photography with a simple vision—to create timeless photographs and cinematic films that families can cherish for generations. Since its inception, the studio has built a strong reputation for capturing authentic emotions, meaningful moments, and unforgettable celebrations with exceptional attention to detail.
              </p>
              <p>
                Today, Shruti Photography blends four decades of professional expertise with modern creativity, delivering wedding photography, cinematic films, portraits, commercial photography, and visual stories that feel natural, elegant, and timeless.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <a href="#portfolio" className="btn-primary mt-10 inline-flex">
              VIEW OUR JOURNEY
            </a>
          </Reveal>

          {/* Statistics Grid */}
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-ink/10 pt-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={0.1 * i}>
                <p className="font-display text-3xl text-ink md:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-widest text-muted font-body font-medium">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  )
}
