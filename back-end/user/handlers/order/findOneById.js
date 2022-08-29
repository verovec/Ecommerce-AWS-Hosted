const yup = require('yup')
const { HandlerWithResponse, NotFoundError } = require('../../utils/response')
const { Product, Order } = require('../../models')
const requireAuth = require('../../middlewares/requireAuth')
const validate = require('../../middlewares/validate')
const { canManageUser } = require('../../utils/permissions')

const validationSchema = yup.object({
  params: yup.object({
    orderId: yup.number().required(),
  }),
})

/**
 * @openapi
 * /orders/{orderId}:
 *   get:
 *     tags:
 *      - order
 *     description: Get an order by id
 *     parameters:
 *     - in: path
 *       name: orderId
 *     responses:
 *       200:
 *          description: Return order
 *       404:
 *          description: order not found
 */
const handler = HandlerWithResponse(async ({ user, params: { orderId } }) => {
  const product = await Order.findOneById(orderId)

  if (!product || !(await canManageUser(user, product.userId)))
    return NotFoundError()

  return {
    product,
  }
})

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'get',
  path: '/orders/:orderId',
}
