const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
  NotFoundError,
} = require('../../utils/response')
const { User, UserRole } = require('../../models')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')
const validate = require('../../middlewares/validate')

const validationSchema = yup.object({
  params: yup.object({
    userId: yup.string().required(),
  }),
})

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags:
 *      - user
 *     description: Get a user by is id
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *          type: string
 *       required: true
 *     responses:
 *       200:
 *          description: Return a user by id
 *       404:
 *          description: User not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user: authedUser, params: { userId } }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const user = await User.findOneById(userId, {
      fields: { email: true, enabled: true },
    })
    if (!user) return NotFoundError()

    return {
      user: {
        ...user,
        roles: {
          ...UserRole.responseFormat(user.roles),
        },
      },
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'get',
  path: '/users/:userId',
}
