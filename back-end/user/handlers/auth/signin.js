const yup = require('yup')
const { HandlerWithResponse, NotFoundError } = require('../../utils/response')
const { User, UserRole } = require('../../models')
const validate = require('../../middlewares/validate')
const { generateAuthToken } = require('../../utils/commons')

const validationSchema = yup.object({
  body: yup.object({
    email: yup.string().email().max(255).required(),
    password: yup.string().max(255).required(),
  }),
})

/**
 * @openapix
 * /auth/signin:
 *   post:
 *     tags:
 *      - auth
 *     description: User signin
 *     responses:
 *       200:
 *          description: Return created user account with session token
 *       400:
 *          description: Invalid credentials
 */
const handler = HandlerWithResponse(async ({ body: { email, password } }) => {
  const user = await User.findOneByEmail(email, {
    fields: { password: true, birthDate: true, enabled: true },
  })

  if (
    !user ||
    !user.enabled ||
    !(await User.comparePassword(password, user.password))
  )
    return NotFoundError('Invalid email or password')

  const { name, id, birthDate, roles } = user

  return {
    user: {
      name,
      id,
      email,
      birthDate,
      roles: {
        ...UserRole.responseFormat(roles),
      },
    },
    token: await generateAuthToken({ id, roles }),
  }
})

module.exports = {
  middlewares: [validate(validationSchema)],
  handler,
  method: 'post',
  path: '/auth/signin',
}
