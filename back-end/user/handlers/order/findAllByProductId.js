const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
  NotFoundError,
} = require('../../utils/response')
const { Order, Product } = require('../../models')
const requireAuth = require('../../middlewares/requireAuth')
const validate = require('../../middlewares/validate')
const { getPagination } = require('../../utils/pagination')
const { canManageUser } = require('../../utils/permissions')

const validationSchema = yup.object({
  params: yup.object({
    productId: yup.number().required(),
  }),
  query: yup.object({
    page: yup.number().integer(),
    limit: yup.number().integer(),
  }),
})

/**
 * @openapi
 * /products/:productId/orders:
 *   get:
 *     tags:
 *      - order
 *     description: Get all orders by productId
 *     parameters:
 *     - in: path
 *       name: productId
 *     responses:
 *       200:
 *          description: Return orders
 */
const handler = HandlerWithResponse(
  async ({ user, params: { productId }, query: { page, limit } }) => {
    const pagination = getPagination({ page, limit })
    const product = await Product.findOneById(productId)

    if (!product) return NotFoundError('Product not found')
    if (!(await canManageUser(user, product.userId)))
      return NotAuthorizedError()

    const orders = await Order.findAllByProductId(productId, pagination)

    return {
      product,
      orders,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'get',
  path: '/products/:productId/orders',
}
