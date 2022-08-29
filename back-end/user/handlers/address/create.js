const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
  NotFoundError,
} = require('../../utils/response')
const { UserAddress, User } = require('../../models')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')

const validationSchema = yup.object({
  params: yup.object({
    userId: yup.string().required(),
  }),
  body: yup.object({
    name: yup.string().required(),
    streetNumber: yup.number().required(),
    streetName: yup.string().required(),
    office: yup.string(),
    postalCode: yup.number().required(),
    city: yup.string().required(),
    country: yup.string().required(),
  }),
})

/**
 * @openapi
 * /users/{userId}/addresses:
 *   post:
 *     tags:
 *      - address
 *     description: Create an address for specified userId
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
 *          description: Return created Address
 *       404:
 *          description: User not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({
    user: authedUser,
    params: { userId },
    body: { name, streetNumber, streetName, office, postalCode, city, country },
  }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const user = await User.findOneById(userId, { instance: true })

    if (!user) return NotFoundError()

    const address = await UserAddress.create(user, {
      name,
      streetName,
      streetNumber,
      office,
      postalCode,
      city,
      country,
    })

    return {
      address,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'post',
  path: '/users/:userId/addresses',
}
