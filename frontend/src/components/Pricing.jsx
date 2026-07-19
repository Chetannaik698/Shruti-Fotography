import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { pricingPlans } from '../data/content'
import Reveal from './Reveal'

export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-bg py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Investment</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">Packages Designed Around Your Story</h2>
          <p className="mt-5 text-muted">Every package includes a complimentary consultation and a private online gallery.</p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center">
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.12} y={plan.highlighted ? 0 : 30}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={`relative flex h-full flex-col rounded-md p-9 ${
                  plan.highlighted
                    ? 'border border-gold bg-gradient-to-b from-gold/10 to-card shadow-gold lg:scale-[1.06]'
                    : 'border border-ink/10 bg-card'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-gradient px-4 py-1 text-[10px] font-semibold uppercase tracking-widest text-bg">
                    Most Popular
                  </span>
                )}

                <h3 className="font-display text-2xl text-ink">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted">{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-lg text-gold">₹</span>
                  <span className="font-display text-5xl text-ink">{plan.price}</span>
                </div>

                <ul className="mt-8 flex-1 space-y-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ink/80">
                      <FiCheck className="mt-0.5 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-9 w-full text-center ${plan.highlighted ? 'btn-primary' : 'btn-outline'}`}
                >
                  Choose {plan.name}
                </a>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
