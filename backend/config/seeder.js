import Category from '../models/Category.js'
import User from '../models/User.js'
import Image from '../models/Image.js'

export const seedDefaults = async () => {
  try {
    const targetCategories = [
      'Engagement/Wedding',
      'Pre_post Wedding',
      'Birthday and Party',
      'Stage functions',
      'Brahmapadesham',
      'Haldi',
      'Outdoor Photography',
      'Candid Photography',
      'Baby Shoot',
      'Maternity',
      'Portrait',
      'Fashion',
      'Corporate Shoots',
      'Family Shoot'
    ]

    const migrationMap = {
      'Wedding': 'Engagement/Wedding',
      'Weddings': 'Engagement/Wedding',
      'Wedding Shoots': 'Engagement/Wedding',
      'Engagement': 'Engagement/Wedding',
      'Pre-Wedding': 'Pre_post Wedding',
      'Birthday Parties': 'Birthday and Party',
      'Birthaday and Party': 'Birthday and Party',
      'Events': 'Stage functions',
      'outdoor Fotography': 'Outdoor Photography',
      'Candid Fotography': 'Candid Photography',
      'Portraits': 'Portrait'
    }

    // Migration: Map old categories to new ones, update associated images, and delete old category
    for (const [oldName, newName] of Object.entries(migrationMap)) {
      const oldCat = await Category.findOne({ name: oldName })
      if (oldCat) {
        let newCat = await Category.findOne({ name: newName })
        if (!newCat) {
          const index = targetCategories.indexOf(newName)
          newCat = await Category.create({ name: newName, order: index !== -1 ? index : 99 })
          console.log(`Created new target category during migration: ${newName}`)
        }

        const result = await Image.updateMany({ category: oldCat._id }, { category: newCat._id })
        if (result.modifiedCount > 0) {
          console.log(`Migrated ${result.modifiedCount} images from '${oldName}' to '${newName}'`)
        }

        await oldCat.deleteOne()
        console.log(`Deleted deprecated category: ${oldName}`)
      }
    }

    // Seed target categories
    for (let i = 0; i < targetCategories.length; i++) {
      const name = targetCategories[i]
      const exists = await Category.findOne({ name })
      if (!exists) {
        await Category.create({ name, order: i })
        console.log(`Auto-seeded category: ${name}`)
      } else {
        exists.order = i
        await exists.save()
      }
    }

    const adminExists = await User.findOne({ role: 'admin' })
    if (!adminExists && process.env.ADMIN_EMAIL) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Studio Owner',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
        role: 'admin',
      })
      console.log(`Auto-created admin account: ${process.env.ADMIN_EMAIL}`)
    }
  } catch (err) {
    console.error('Auto-seeding failed:', err.message)
  }
}
