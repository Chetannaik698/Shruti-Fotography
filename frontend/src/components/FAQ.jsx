import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus } from 'react-icons/fi'
import { faqs } from '../data/content'
import Reveal from './Reveal'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="relative bg-bg py-28 lg:py-36">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Good to Know</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">Frequently Asked Questions</h2>
        </Reveal>

        <div className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={item.q} delay={i * 0.05} y={16}>
                <div>
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-lg text-ink md:text-xl">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold"
                    >
                      <FiPlus />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-14 leading-relaxed text-muted">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
