import asyncHandler from 'express-async-handler'
import Category from '../models/Category.js'
import Image from '../models/Image.js'

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, createdAt: 1 })
  res.status(200).json({ success: true, count: categories.length, categories })
})

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, order } = req.body

  if (!name || !name.trim()) {
    res.status(400)
    throw new Error('Category name is required')
  }

  const category = await Category.create({ name: name.trim(), description, order })
  res.status(201).json({ success: true, message: 'Category created', category })
})

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }

  const { name, description, order } = req.body
  if (name) category.name = name.trim()
  if (description !== undefined) category.description = description
  if (order !== undefined) category.order = order

  await category.save()
  res.status(200).json({ success: true, message: 'Category updated', category })
})

// @desc    Delete a category (blocked if images still reference it)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) {
    res.status(404)
    throw new Error('Category not found')
  }

  const imageCount = await Image.countDocuments({ category: category._id })
  if (imageCount > 0) {
    res.status(409)
    throw new Error(
      `Cannot delete — ${imageCount} image(s) still belong to this category. Move or delete them first.`
    )
  }

  await category.deleteOne()
  res.status(200).json({ success: true, message: 'Category deleted' })
})
