const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
  NotFoundError,
} = require('../../utils/response')
const { UserWishlist, User } = require('../../models')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')
const validate = require('../../middlewares/validate')
const { getPagination } = require('../../utils/pagination')

const validationSchema = yup.object({
  params: yup.object({
    userId: yup.string().required(),
  }),
})

/**
 * @openapi
 * /users/:userId/wishlist:
 *   get:
 *     tags:
 *      - wishlist
 *     description: Get user wishlist
 *     parameters:
 *     - in: path
 *       name: userId
 *     responses:
 *       200:
 *          description: Return user wishlist
 *       404:
 *          description: user not found
 */
const handler = HandlerWithResponse(
  async ({ user: authedUser, params: { userId }, query: { page, limit } }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const user = await User.findOneById(userId)

    if (!user) return NotFoundError('User not found')

    const pagination = getPagination({ page, limit })

    const wishlist = await UserWishlist.findOneByUserId(userId, pagination)

    return {
      wishlist,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'get',
  path: '/users/:userId/wishlist',
}
