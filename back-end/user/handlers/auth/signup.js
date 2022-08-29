const yup = require('yup')
const {
  HandlerWithResponse,
  ValidationError,
  NotAuthorizedError,
} = require('../../utils/response')
const validate = require('../../middlewares/validate')
const { User, UserRole } = require('../../models')
const { canCreateAccountWithRole } = require('../../utils/permissions')
const { generateAuthToken } = require('../../utils/commons')

const validationSchema = yup.object({
  body: yup.object({
    name: yup.string().max(255).required(),
    email: yup.string().email().max(255).required(),
    birthDate: yup.date().required(),
    password: yup.string().max(255).required(),
    role: yup.mixed().oneOf(Object.values(UserRole.ROLES)),
  }),
})

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags:
 *      - auth
 *     description: User Signup
 *     responses:
 *       200:
 *          description: Return created user account with session token
 *       400:
 *          description: There is some invalid inputs
 *       403:
 *          description: Authorization needed (can be returned only if role is specified)
 */
const handler = HandlerWithResponse(
  async ({
    body: { name, email, birthDate, password, role = UserRole.ROLES.BUYER },
    user,
  }) => {
    const userWithEmail = await User.findOneByEmail(email)

    if (!(await canCreateAccountWithRole(user, role)))
      return NotAuthorizedError('You need an admin account to do that')

    if (userWithEmail) return ValidationError('Email already used')

    const { id, roles } = await User.create(
      { name, email, birthDate, password },
      UserRole.ROLES.ADMIN
    )

    return {
      user: {
        id,
        name,
        email,
        birthDate,
        roles: {
          ...UserRole.responseFormat(roles),
        },
      },
      token: await generateAuthToken({ id, roles }),
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema)],
  handler,
  method: 'post',
  path: '/auth/signup',
}
