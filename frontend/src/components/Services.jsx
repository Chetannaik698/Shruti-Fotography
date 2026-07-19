import { motion } from 'framer-motion'
import {
  GiDiamondRing, GiFilmProjector,
} from 'react-icons/gi'
import { FaHeart, FaBaby, FaBriefcase, FaCamera, FaBook, FaIdCard } from 'react-icons/fa'
import { TbDrone } from 'react-icons/tb'
import { FiImage, FiLayers, FiCopy, FiPrinter, FiCoffee } from 'react-icons/fi'
import { services } from '../data/content'
import Reveal from './Reveal'

const iconMap = {
  ring: GiDiamondRing,
  film: GiFilmProjector,
  drone: TbDrone,
  heart: FaHeart,
  baby: FaBaby,
  briefcase: FaBriefcase,
  camera: FaCamera,
  book: FaBook,
  frame: FiImage,
  layers: FiLayers,
  copy: FiCopy,
  printer: FiPrinter,
  idcard: FaIdCard,
  coffee: FiCoffee,
}

export default function Services() {
  return (
    <section id="services" className="relative bg-bg py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">What We Offer</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">Services Crafted for Every Chapter</h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = iconMap[s.icon]
            return (
              <Reveal key={s.title} delay={(i % 4) * 0.08}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="group relative h-full overflow-hidden rounded-sm border border-ink/10 bg-card p-8 transition-colors duration-300 hover:border-gold/40"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/0 blur-2xl transition-all duration-500 group-hover:bg-gold/10" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-bg">
                    <Icon size={22} />
                  </div>
                  <h3 className="relative mt-6 font-display text-xl text-ink">{s.title}</h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
