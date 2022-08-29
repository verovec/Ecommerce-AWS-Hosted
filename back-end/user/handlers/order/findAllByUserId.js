const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
} = require('../../utils/response')
const { Order } = require('../../models')
const requireAuth = require('../../middlewares/requireAuth')
const validate = require('../../middlewares/validate')
const { getPagination } = require('../../utils/pagination')
const { canManageUser } = require('../../utils/permissions')

const validationSchema = yup.object({
  params: yup.object({
    userId: yup.string().required(),
  }),
  query: yup.object({
    page: yup.number().integer(),
    limit: yup.number().integer(),
  }),
})

/**
 * @openapi
 * /users/:userId/orders:
 *   get:
 *     tags:
 *      - order
 *     description: Get all orders by userId
 *     parameters:
 *     - in: path
 *       name: userId
 *     responses:
 *       200:
 *          description: Return orders
 */
const handler = HandlerWithResponse(
  async ({ user, params: { userId }, query: { page, limit } }) => {
    const pagination = getPagination({ page, limit })

    if (!(await canManageUser(user, userId))) return NotAuthorizedError()

    const orders = await Order.findAllByUserId(userId, pagination)

    return {
      orders,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'get',
  path: '/users/:userId/orders',
}
