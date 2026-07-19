import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUploadCloud, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import { useGallery } from '../../context/GalleryContext'

const emptyForm = { title: '', category: '', description: '', tall: false, featured: false }

export default function AdminImages() {
  const { categories, images, createImage, updateImage, deleteImage } = useGallery()
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    setFile(f || null)
    setPreview(f ? URL.createObjectURL(f) : null)
  }

  const resetForm = () => {
    setForm(emptyForm)
    setFile(null)
    setPreview(null)
    setEditingId(null)
  }

  const startEdit = (img) => {
    setEditingId(img.id)
    setForm({
      title: img.title,
      category: img.category?.id || '',
      description: img.description || '',
      tall: img.tall,
      featured: img.featured,
    })
    setFile(null)
    setPreview(img.imageUrl)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim() || !form.category) {
      setError('Title and category are required')
      return
    }
    if (!editingId && !file) {
      setError('Please select an image file to upload')
      return
    }

    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('category', form.category)
    fd.append('description', form.description)
    fd.append('tall', form.tall)
    fd.append('featured', form.featured)
    if (file) fd.append('image', file)

    setBusy(true)
    try {
      if (editingId) {
        await updateImage(editingId, fd)
      } else {
        await createImage(fd)
      }
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save image')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this image permanently?')) return
    try {
      await deleteImage(id)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete image')
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Gallery Images</h1>
      <p className="mt-1 text-sm text-muted">Upload and manage every image shown in the public portfolio.</p>

      <form onSubmit={handleSubmit} className="mt-8 rounded-md border border-white/10 bg-card p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <label className="flex h-48 w-full shrink-0 cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-white/20 text-center transition-colors hover:border-gold md:w-56">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full rounded-sm object-cover" />
            ) : (
              <>
                <FiUploadCloud className="text-3xl text-muted" />
                <span className="mt-2 px-4 text-xs text-muted">Click to select an image</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-sm border border-white/15 bg-transparent px-4 py-3 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-sm border border-white/15 bg-bg px-4 py-3 text-sm text-ink outline-none focus:border-gold"
              >
                <option value="">Select category</option>
                {categories.map((c) => {
                  const catId = c.id || c._id
                  return (
                    <option key={catId} value={catId}>
                      {c.name}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-widest text-muted">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full resize-none rounded-sm border border-white/15 bg-transparent px-4 py-3 text-sm text-ink outline-none focus:border-gold"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.tall}
                onChange={(e) => setForm({ ...form, tall: e.target.checked })}
                className="accent-gold"
              />
              Tall aspect ratio
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-gold"
              />
              Featured
            </label>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex gap-3">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={busy}
            className="btn-primary"
          >
            {busy ? 'Saving...' : editingId ? 'Update Image' : 'Upload Image'}
          </motion.button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-outline">
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {images.map((img) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group overflow-hidden rounded-sm border border-white/10 bg-card flex flex-col justify-between"
            >
              <div className="relative overflow-hidden">
                <img src={img.imageUrl} alt={img.title} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {(img.featured || img.tall) && (
                  <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                    {img.featured && (
                      <span className="rounded bg-gold/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-bg">
                        Featured
                      </span>
                    )}
                    {img.tall && (
                      <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-bg">
                        Tall
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-ink truncate" title={img.title}>{img.title}</p>
                  <p className="text-[10px] uppercase tracking-widest text-gold mt-1 font-semibold">
                    {img.category?.name || 'Uncategorized'}
                  </p>
                  {img.description && (
                    <p className="text-xs text-muted mt-2 line-clamp-2" title={img.description}>
                      {img.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex gap-2 border-t border-white/5 pt-3">
                  <button
                    onClick={() => startEdit(img)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-white/5 py-2 text-xs text-ink transition-colors hover:bg-gold/15 hover:text-gold"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-red-500/10 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {images.length === 0 && (
          <p className="col-span-full py-8 text-center text-muted">No images uploaded yet.</p>
        )}
      </div>
    </div>
  )
}
