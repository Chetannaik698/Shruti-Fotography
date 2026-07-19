import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi'
import { useGallery } from '../../context/GalleryContext'

export default function AdminCategories() {
  const { categories, createCategory, updateCategory, deleteCategory } = useGallery()
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setError('')
    setBusy(true)
    try {
      await createCategory({ name: newName.trim(), description: newDesc.trim() })
      setNewName('')
      setNewDesc('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category')
    } finally {
      setBusy(false)
    }
  }

  const startEdit = (cat) => {
    setEditingId(cat.id || cat._id)
    setEditForm({ name: cat.name, description: cat.description || '' })
  }

  const saveEdit = async (id) => {
    setError('')
    try {
      await updateCategory(id, editForm)
      setEditingId(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update category')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? This only works if no images use it.')) return
    setError('')
    try {
      await deleteCategory(id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category')
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Categories</h1>
      <p className="mt-1 text-sm text-muted">Organize your gallery — e.g. Wedding, Pre-Wedding, Engagement, Baby Shoot.</p>

      <form onSubmit={handleCreate} className="mt-8 flex flex-col gap-3 rounded-md border border-white/10 bg-card p-6 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Category Name</label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Baby Shoot"
            className="w-full rounded-sm border border-white/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-white/30 outline-none focus:border-gold"
          />
        </div>
        <div className="flex-1">
          <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Description (optional)</label>
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Short description"
            className="w-full rounded-sm border border-white/15 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-white/30 outline-none focus:border-gold"
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={busy}
          className="btn-primary !py-3"
        >
          <FiPlus /> Add
        </motion.button>
      </form>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 overflow-hidden rounded-md border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Description</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const catId = cat.id || cat._id
              return (
                <tr key={catId} className="border-t border-white/10">
                  {editingId === catId ? (
                    <>
                      <td className="px-5 py-3">
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full rounded-sm border border-white/15 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full rounded-sm border border-white/15 bg-transparent px-3 py-2 text-sm text-ink outline-none focus:border-gold"
                        />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => saveEdit(catId)} className="mr-2 text-green-400 hover:text-green-300">
                          <FiCheck />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-white/50 hover:text-white">
                          <FiX />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3 text-ink">{cat.name}</td>
                      <td className="px-5 py-3 text-muted">{cat.description || '—'}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => startEdit(cat)} className="mr-3 text-white/60 hover:text-gold">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(catId)} className="text-white/60 hover:text-red-400">
                          <FiTrash2 />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted">
                  No categories yet — add your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
