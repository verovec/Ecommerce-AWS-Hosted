const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
  NotFoundError,
} = require('../../utils/response')
const { User } = require('../../models')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')

const validationSchema = yup.object({
  params: yup.object({
    userId: yup.string().required(),
  }),
})

/**
 * @openapi
 * /users/{userId}/disable:
 *   put:
 *     tags:
 *      - user
 *     description: Disable a user by id
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
 *          description: Return disabled user id
 *       404:
 *          description: User not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(async ({ user, params: { userId } }) => {
  if (!(await canManageUser(user, userId))) return NotAuthorizedError()

  const disabledUser = await User.disableById(userId)

  if (!disabledUser) return NotFoundError()

  return {
    user: {
      id: userId,
    },
  }
})

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'put',
  path: '/users/:userId/disable',
}
