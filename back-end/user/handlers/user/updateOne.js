const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
  NotFoundError,
  ValidationError,
} = require('../../utils/response')
const { User, UserRole } = require('../../models')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')

const validationSchema = yup.object({
  params: yup.object({
    userId: yup.string().required(),
  }),
  body: yup.object({
    name: yup.string().max(255),
    email: yup.string().email().max(255),
    birthDate: yup.date(),
  }),
})

/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     tags:
 *      - user
 *     description: Update a user by id
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
 *          description: Return Updated user id
 *       404:
 *          description: User not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user, params: { userId }, body: { name, email, birthDate } }) => {
    if (!(await canManageUser(user, userId))) return NotAuthorizedError()

    if (email) {
      const userWithEmail = await User.findOneByEmail(email)
      if (userWithEmail) return ValidationError('Email already used')
    }

    const updatedUser = await User.updateOne(userId, {
      name,
      email,
      birthDate,
    })

    if (!updatedUser) return NotFoundError()

    return {
      user: {
        ...updatedUser,
        roles: {
          ...UserRole.responseFormat(updatedUser.roles),
        },
      },
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'put',
  path: '/users/:userId',
}
