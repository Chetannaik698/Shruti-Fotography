import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

export default function Counter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration, bounce: 0 })

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  const spanRef = useRef(null)

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = Math.floor(latest).toLocaleString()
      }
    })
    return unsubscribe
  }, [springValue])

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <span ref={spanRef}>0</span>
      <span>{suffix}</span>
    </span>
  )
}
