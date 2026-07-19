import { NavLink, Outlet, Link } from 'react-router-dom'
import { FiGrid, FiImage, FiTag, FiUsers, FiLogOut, FiExternalLink, FiCalendar, FiCreditCard } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Overview', icon: <FiGrid />, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: <FiCalendar /> },
  { to: '/admin/payments', label: 'Payments', icon: <FiCreditCard /> },
  { to: '/admin/images', label: 'Gallery Images', icon: <FiImage /> },
  { to: '/admin/categories', label: 'Categories', icon: <FiTag /> },
  { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-ink/10 bg-card md:flex">
        <div className="border-b border-ink/10 p-6">
          <Link to="/" className="font-display text-lg tracking-wide text-ink">
            SHRUTI<span className="text-gold"> FOTOGRAPHY</span>
          </Link>
          <p className="mt-1 text-[11px] uppercase tracking-widest text-muted">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-colors ${
                  isActive ? 'bg-gold/10 text-gold' : 'text-ink/70 hover:bg-ink/5 hover:text-gold'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-sm bg-ink/5 px-3 py-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs font-bold text-bg">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">{user?.name}</p>
              <p className="truncate text-[11px] text-muted">{user?.email}</p>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 hover:text-gold"
          >
            <FiExternalLink /> View Site
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-sm px-4 py-2.5 text-sm text-ink/70 hover:bg-ink/5 hover:text-red-400"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
