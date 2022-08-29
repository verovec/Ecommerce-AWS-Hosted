const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
} = require('../../utils/response')
const { UserAddress } = require('../../models')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')
const validate = require('../../middlewares/validate')
const { getPagination } = require('../../utils/pagination')

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
 * /users/{userId}/addresses:
 *   get:
 *     tags:
 *      - address
 *     description: Get all address by specified userId
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *          type: string
 *       required: true
 *     - in: query
 *       name: page
 *       schema:
 *          type: integer
 *     - in: query
 *       name: limit
 *       schema:
 *          type: integer
 *     responses:
 *       200:
 *          description: Return user addresses
 *       404:
 *          description: User not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user: authedUser, params: { userId }, query: { page, limit } }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const pagination = getPagination({ page, limit })

    const addresses = await UserAddress.findAllByUserId(userId, pagination)

    return {
      addresses,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'get',
  path: '/users/:userId/addresses',
}
