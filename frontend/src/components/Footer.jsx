import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter } from 'react-icons/fa'
import { navLinks, socialLinks, contactInfo } from '../data/content'
import logo from '../assets/logo.png'

const iconMap = { instagram: FaInstagram, facebook: FaFacebookF, pinterest: FaPinterestP, twitter: FaTwitter }

export default function Footer() {
  return (
    <footer className="relative border-t border-ink/10 bg-bg pt-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 pb-16 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="#home" className="inline-block">
              <img src={logo} alt="Shruti Fotography" className="h-10 w-auto dark:invert" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Luxury wedding, portrait and event photography studio, crafting cinematic
              stories worth remembering.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((s) => {
                const Icon = iconMap[s.platform]
                return (
                  <a
                    key={s.platform}
                    href={s.href}
                    aria-label={s.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-all duration-300 hover:border-gold hover:text-gold"
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Quick Links</p>
            <ul className="mt-5 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Studio</p>
            <ul className="mt-5 space-y-3 text-sm text-muted">
              <li>{contactInfo.email}</li>
              <li>{contactInfo.phone} (Mob)</li>
              <li>{contactInfo.landline} (Tel)</li>
              <li>{contactInfo.address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-ink/10 py-7 text-xs text-muted md:flex-row">
          <p>&copy; {new Date().getFullYear()} Shruti Fotography. All rights reserved.</p>
          <p>Crafted with care for a demo experience.</p>
        </div>
      </div>
    </footer>
  )
}
