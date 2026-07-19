import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Loader from './components/Loader'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import BackToTop from './components/BackToTop'
import WhatsAppButton from './components/WhatsAppButton'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Favorites from './pages/Favorites'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOverview from './pages/admin/AdminOverview'
import AdminImages from './pages/admin/AdminImages'
import AdminCategories from './pages/admin/AdminCategories'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'
import AdminPayments from './pages/admin/AdminPayments'
import Payment from './pages/Payment'

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1700)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      {!isAdminRoute && <Loader show={loading} />}
      {!isAdminRoute && <ScrollProgress />}
      {!isAdminRoute && <Navbar />}

      <AnimatePresence mode="wait">
        {(isAdminRoute || !loading) && (
          <motion.main
            key={isAdminRoute ? 'admin' : 'site'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/payment" element={<Payment />} />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="images" element={<AdminImages />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>
          </motion.main>
        )}
      </AnimatePresence>

      {!isAdminRoute && <BackToTop />}
      {!isAdminRoute && <WhatsAppButton />}
    </>
  )
}
