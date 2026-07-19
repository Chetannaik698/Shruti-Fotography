import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import { useAuth } from './AuthContext'

const GalleryContext = createContext(null)

// The list endpoint (GET /gallery) returns a flattened shape: { id, category: { id, name, slug }, ... }.
// The create/update endpoints return the raw populated Mongoose doc: { _id, category: { _id, name, slug }, ... }.
// Normalize both to the same flattened shape so components never have to special-case either source.
function normalizeImage(raw, loggedIn = false) {
  let likedByMe = false
  if (loggedIn) {
    likedByMe = raw.likedByMe ?? false
  } else {
    try {
      const guestLikes = JSON.parse(localStorage.getItem('guest_likes') || '[]')
      likedByMe = guestLikes.includes(raw.id || raw._id)
    } catch (e) {
      likedByMe = false
    }
  }

  return {
    id: raw.id || raw._id,
    title: raw.title,
    description: raw.description,
    imageUrl: raw.imageUrl,
    tall: raw.tall,
    featured: raw.featured,
    likesCount: raw.likesCount,
    likedByMe,
    category: raw.category
      ? { id: raw.category.id || raw.category._id, name: raw.category.name, slug: raw.category.slug }
      : null,
    createdAt: raw.createdAt,
  }
}

export function GalleryProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    const { data } = await api.get('/categories')
    setCategories(data.categories)
    return data.categories
  }, [])

  const fetchImages = useCallback(async (categorySlug = 'all') => {
    const { data } = await api.get('/gallery', { params: { category: categorySlug, limit: 100 } })
    const normalized = data.images.map((img) => normalizeImage(img, isAuthenticated))
    setImages(normalized)
    return normalized
  }, [isAuthenticated])

  const refreshAll = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all([fetchCategories(), fetchImages('all')])
    } catch (err) {
      // Backend may not be reachable yet — components fall back to empty state
      console.error('Gallery load failed:', err.message)
    } finally {
      setLoading(false)
    }
  }, [fetchCategories, fetchImages])

  useEffect(() => {
    refreshAll()
    // Re-fetch when auth state changes so `likedByMe` flags stay accurate
  }, [isAuthenticated, refreshAll])

  // ---- Admin CRUD — each mutates local state immediately for instant reflection ----

  const createCategory = async (payload) => {
    const { data } = await api.post('/categories', payload)
    setCategories((prev) => [...prev, data.category])
    return data.category
  }

  const updateCategory = async (id, payload) => {
    const { data } = await api.put(`/categories/${id}`, payload)
    setCategories((prev) => prev.map((c) => ((c.id || c._id) === id ? data.category : c)))
    return data.category
  }

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`)
    setCategories((prev) => prev.filter((c) => (c.id || c._id) !== id))
  }

  const createImage = async (formData) => {
    const { data } = await api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const normalized = normalizeImage(data.image, isAuthenticated)
    setImages((prev) => [normalized, ...prev])
    return normalized
  }

  const updateImage = async (id, formData) => {
    const { data } = await api.put(`/gallery/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const normalized = normalizeImage(data.image, isAuthenticated)
    setImages((prev) => prev.map((img) => (img.id === id ? normalized : img)))
    return normalized
  }

  const deleteImage = async (id) => {
    await api.delete(`/gallery/${id}`)
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const toggleLike = async (imageId) => {
    let action = 'like'
    let liked = true
    if (!isAuthenticated) {
      let guestLikes = []
      try {
        guestLikes = JSON.parse(localStorage.getItem('guest_likes') || '[]')
      } catch (e) {
        guestLikes = []
      }
      if (guestLikes.includes(imageId)) {
        action = 'unlike'
        guestLikes = guestLikes.filter((id) => id !== imageId)
        liked = false
      } else {
        action = 'like'
        guestLikes.push(imageId)
        liked = true
      }
      localStorage.setItem('guest_likes', JSON.stringify(guestLikes))
    }

    const { data } = await api.post(`/likes/${imageId}`, { action })
    const resolvedLiked = isAuthenticated ? data.liked : liked

    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, likesCount: data.likesCount, likedByMe: resolvedLiked } : img
      )
    )
    return data
  }

  const value = {
    categories,
    images,
    loading,
    refreshAll,
    fetchImages,
    createCategory,
    updateCategory,
    deleteCategory,
    createImage,
    updateImage,
    deleteImage,
    toggleLike,
  }

  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>
}

export function useGallery() {
  const ctx = useContext(GalleryContext)
  if (!ctx) throw new Error('useGallery must be used within a GalleryProvider')
  return ctx
}
