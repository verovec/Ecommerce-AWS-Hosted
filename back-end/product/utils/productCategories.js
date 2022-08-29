const { ProductCategory } = require('../models')
const { NotFoundError } = require('./response')

const validateProductCategories = async (categories = []) => {
  const existingCategories = await ProductCategory.findByIds(
    categories.map(({ id }) => id),
    { instance: true }
  )

  if (
    !categories.every((category) =>
      existingCategories.some(({ id }) => category.id === id)
    )
  )
    return { valid: false }

  categories = existingCategories

  return { categories, valid: true }
}

module.exports = {
  validateProductCategories,
}
