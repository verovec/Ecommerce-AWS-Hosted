const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
  NotFoundError,
} = require('../../utils/response')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { Order, OrderHasProducts, User } = require('../../models')
const { canManageUser } = require('../../utils/permissions')
const sqs = require('../../utils/sqs')

const validationSchema = yup.object({
  params: yup.object({
    orderId: yup.number().integer().required(),
    productId: yup.number().integer().required(),
  }),
})

/**
 * @openapi
 * /orders/:orderId/products/:productId/dispatch:
 *   dispatch:
 *     tags:
 *      - order
 *     description: Dispatch a product
 *     responses:
 *       200:
 *          description: Return dispatched product
 *       404:
 *          description: Order or product not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user: authedUser, params: { productId, orderId } }) => {
    const order = await Order.findOneByProductId(orderId, productId)

    if (!order) return NotFoundError('Order or product not found')

    const product = order.products[0]

    if (!(await canManageUser(authedUser, product.userId)))
      return NotAuthorizedError()

    if (
      order.status !== Order.STATUS.PENDING ||
      product.orderStatus !== OrderHasProducts.STATUS.PENDING
    )
      return NotAuthorizedError('Product already dispatched')

    const updatedOrder = await Order.dispatchByProductId(orderId, productId)

    const user = await User.findOneById(authedUser.id, {
      fields: {
        email: true,
      },
    })

    await sqs.sendEmail(user.email, 'd-0bbaa0f7df42497ab7348cce9ab90cfb', {
      name: user.name,
    })

    return {
      order: updatedOrder,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'put',
  path: '/orders/:orderId/products/:productId/dispatch',
}
