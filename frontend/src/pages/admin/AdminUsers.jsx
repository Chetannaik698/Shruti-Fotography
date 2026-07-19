import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api
      .get('/admin/users')
      .then(({ data }) => setUsers(data.users))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change ${u.name}'s role to ${nextRole}?`)) return
    try {
      await api.put(`/admin/users/${u.id}/role`, { role: nextRole })
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: nextRole } : x)))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role')
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Users</h1>
      <p className="mt-1 text-sm text-muted">Manage who has access to the admin panel.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 overflow-hidden rounded-md border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="px-5 py-3 text-ink">{u.name}</td>
                <td className="px-5 py-3 text-muted">{u.email}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase tracking-widest ${
                      u.role === 'admin' ? 'bg-gold/15 text-gold' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => toggleRole(u)}
                    disabled={u.id === currentUser?.id}
                    className="text-xs text-white/60 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
