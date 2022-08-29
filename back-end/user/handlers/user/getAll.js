const yup = require('yup')
const { HandlerWithResponse } = require('../../utils/response')
const { User } = require('../../models')
const { isAdmin } = require('../../utils/permissions')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { getPagination } = require('../../utils/pagination')

const validationSchema = yup.object({
  query: yup.object({
    page: yup.number().integer(),
    limit: yup.number().integer(),
    seller: yup.boolean(),
  }),
})

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *      - user
 *     description: Get all users
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     responses:
 *       200:
 *          description: Return all users
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user, query: { page, limit, seller } }) => {
    const pagination = getPagination({ page, limit })
    const hasAdminPermissions = await isAdmin(user)

    seller = !hasAdminPermissions ? true : !!seller

    const users = await User.getAll(
      { pagination, seller },
      {
        fields: {
          email: hasAdminPermissions,
          birthDate: hasAdminPermissions,
          enabled: hasAdminPermissions,
        },
      }
    )

    return {
      users,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'get',
  path: '/users',
}
