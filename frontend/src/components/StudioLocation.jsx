import { FiMapPin, FiClock, FiNavigation } from 'react-icons/fi'
import { contactInfo, studioLocation } from '../data/content'
import Reveal from './Reveal'
import { useTheme } from '../context/ThemeContext'

export default function StudioLocation() {
  const { theme } = useTheme()

  return (
    <section id="location" className="relative bg-bg py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Visit Us</p>
          <div className="divider-gold mx-auto my-5" />
          <h2 className="section-heading text-balance">Find Our Studio</h2>
          <p className="mt-5 text-muted">
            Step into our light-filled studio in the heart of the city — book a walkthrough or drop by during open hours.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-5">
          <Reveal y={30} className="lg:col-span-3 overflow-hidden rounded-md border border-ink/10">
            <iframe
              title="Shruti Fotography map location"
              src={contactInfo.mapEmbed}
              width="100%"
              height="480"
              style={{ border: 0, filter: theme === 'dark' ? 'grayscale(1) invert(0.92) contrast(0.85)' : 'grayscale(0.15)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>

          <Reveal y={30} delay={0.15} className="lg:col-span-2">
            <div className="flex h-full flex-col justify-center gap-6 rounded-md border border-ink/10 bg-card p-8">
              <div>
                <p className="eyebrow">Address</p>
                <div className="mt-3 flex items-start gap-3">
                  <FiMapPin className="mt-1 shrink-0 text-gold" />
                  <p className="text-ink">{studioLocation.address}</p>
                </div>
              </div>

              <div>
                <p className="eyebrow">Studio Hours</p>
                <div className="mt-3 space-y-1.5">
                  {studioLocation.hours.map((h) => (
                    <div key={h.day} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-ink/70">
                        <FiClock className="text-gold" size={13} /> {h.day}
                      </span>
                      <span className="text-muted">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={studioLocation.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline mt-2 w-full justify-center"
              >
                <FiNavigation size={14} /> Get Directions
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
