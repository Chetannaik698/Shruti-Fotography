import { motion } from 'framer-motion'
import { FiEye, FiSliders, FiZap, FiUsers, FiAperture, FiShield } from 'react-icons/fi'
import { whyChooseUs, img } from '../data/content'
import Reveal from './Reveal'

const iconMap = { eye: FiEye, sliders: FiSliders, zap: FiZap, users: FiUsers, aperture: FiAperture, shield: FiShield }

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-bg py-28 lg:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <img src={img('photo-1493863641943-9b68992a8d07', 2000, 60)} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Why Shruti Fotography</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">The Difference Is in the Detail</h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((f, i) => {
            const Icon = iconMap[f.icon]
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.08} y={24}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(212,175,55,0.04)' }}
                  className="flex h-full flex-col gap-4 bg-bg p-9"
                >
                  <Icon className="text-gold" size={26} />
                  <h3 className="font-display text-lg text-ink">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
                </motion.div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
