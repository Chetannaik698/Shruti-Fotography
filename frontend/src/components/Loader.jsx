import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.span
            className="font-display text-2xl md:text-3xl tracking-widest2 text-ink text-center uppercase"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            SHRUTI <span className="text-gold">FOTOGRAPHY</span>
          </motion.span>
          <motion.div
            className="mt-6 h-px w-40 overflow-hidden bg-ink/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full w-full bg-gold-gradient"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
            />
          </motion.div>
          <motion.span
            className="mt-4 text-[10px] uppercase tracking-widest2 text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Photography
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
