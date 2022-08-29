const { HandlerWithResponse } = require('../../utils/response')
const { ProductCategory } = require('../../models')

/**
 * @openapi
 * /categories:
 *   get:
 *     tags:
 *      - category
 *     description: Get all categories
 *     responses:
 *       200:
 *          description: Return all categories
 */
const handler = HandlerWithResponse(async () => {
  const categories = await ProductCategory.findAll()

  return {
    categories,
  }
})

module.exports = {
  middlewares: [],
  handler,
  method: 'get',
  path: '/categories',
}
