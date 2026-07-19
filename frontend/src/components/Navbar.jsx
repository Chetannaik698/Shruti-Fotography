import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiUser, FiShield, FiLogOut, FiHeart, FiSun, FiMoon } from 'react-icons/fi'
import { navLinks } from '../data/content'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import logo from '../assets/logo.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (location.pathname === '/payment') {
      setActive('/payment')
    } else {
      setActive(location.hash || '#home')
    }
  }, [location])

  useEffect(() => {
    if (location.pathname !== '/') return

    const sections = navLinks
      .filter((l) => l.isHash)
      .map((l) => document.querySelector(l.href))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [location.pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-ink/10 py-3' : 'bg-transparent py-6'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Shruti Fotography" className="h-14 md:h-16 w-auto dark:invert transition-transform duration-300 hover:scale-105" />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => {
              const isCurrentActive = active === link.href
              return (
                <li key={link.href}>
                  {link.isHash ? (
                    <a
                      href={location.pathname === '/' ? link.href : `/${link.href}`}
                      className={`relative text-[13px] uppercase tracking-widest transition-colors duration-300 ${
                        isCurrentActive ? 'text-gold' : 'text-ink/70 hover:text-ink'
                      }`}
                    >
                      {link.label}
                      {isCurrentActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-1.5 left-0 h-px w-full bg-gold"
                        />
                      )}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className={`relative text-[13px] uppercase tracking-widest transition-colors duration-300 ${
                        isCurrentActive ? 'text-gold' : 'text-ink/70 hover:text-ink'
                      }`}
                    >
                      {link.label}
                      {isCurrentActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-1.5 left-0 h-px w-full bg-gold"
                        />
                      )}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink/70 hover:border-gold hover:text-gold transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
            </button>

            <a href="#contact" className="btn-outline !px-6 !py-2.5 !text-[11px]">
              Book a Session
            </a>

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
                  aria-label="Account menu"
                >
                  {user?.name?.[0]?.toUpperCase() || <FiUser />}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-56 overflow-hidden rounded-sm border border-ink/10 bg-card shadow-card"
                    >
                      <div className="border-b border-ink/10 px-4 py-3">
                        <p className="truncate text-sm text-ink">{user?.name}</p>
                        <p className="truncate text-xs text-muted">{user?.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-ink/80 hover:bg-ink/5 hover:text-gold"
                        >
                          <FiShield /> Admin
                        </Link>
                      )}
                      <Link
                        to="/favorites"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-ink/80 hover:bg-ink/5 hover:text-gold"
                      >
                        <FiHeart /> My Favorites
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-ink/80 hover:bg-ink/5 hover:text-red-400"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors hover:border-gold hover:text-gold"
                aria-label="Login"
              >
                <FiUser />
              </Link>
            )}
          </div>

          <button
            className="text-2xl text-ink lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen(true)}
          >
            <FiMenu />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-bg/98 backdrop-blur-lg lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="flex items-center justify-between px-6 py-6">
              <span className="flex items-center gap-2">
                <img src={logo} alt="Shruti Fotography" className="h-14 w-auto dark:invert" />
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink/70 hover:border-gold hover:text-gold transition-colors duration-300"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
                </button>
                <button aria-label="Close menu" className="text-2xl text-ink" onClick={() => setOpen(false)}>
                  <FiX />
                </button>
              </div>
            </div>
            <ul className="flex flex-1 flex-col items-center justify-center gap-8">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  {link.isHash ? (
                    <a
                      href={location.pathname === '/' ? link.href : `/${link.href}`}
                      onClick={() => setOpen(false)}
                      className="font-display text-3xl text-ink hover:text-gold transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display text-3xl text-ink hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.li>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn-primary mt-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                Book a Session
              </motion.a>

              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.4 }}
                  className="flex flex-col items-center gap-4"
                >
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-gold">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/favorites" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-ink/70">
                    My Favorites
                  </Link>
                  <button
                    onClick={() => { setOpen(false); handleLogout() }}
                    className="text-sm uppercase tracking-widest text-ink/50"
                  >
                    Logout
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.42, duration: 0.4 }}
                  className="flex items-center gap-6"
                >
                  <Link to="/login" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-ink/70">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest text-gold">
                    Sign Up
                  </Link>
                </motion.div>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
