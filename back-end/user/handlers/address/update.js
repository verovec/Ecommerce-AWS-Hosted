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
    addressId: yup.number().required(),
  }),
  body: yup.object({
    name: yup.string(),
    streetNumber: yup.number(),
    streetName: yup.string(),
    office: yup.string(),
    postalCode: yup.number(),
    city: yup.string(),
    country: yup.string(),
  }),
})

/**
 * @openapi
 * /users/{userId}/addresses/{addressId}:
 *   put:
 *     tags:
 *      - address
 *     description: Update an address by id for specified userId
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *          type: string
 *       required: true
 *     - in: path
 *       name: addressId
 *       schema:
 *          type: integer
 *       required: true
 *     responses:
 *       200:
 *          description: Return Updated Address
 *       404:
 *          description: User not found or address not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({
    user: authedUser,
    params: { userId, addressId },
    body: { name, streetNumber, streetName, office, postalCode, city, country },
  }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const user = await User.findOneById(userId)

    if (!user) return NotFoundError()

    const address = await UserAddress.findById(addressId)

    if (!address || !(await canManageUser(user, address.userId)))
      return NotFoundError()

    const updatedAddress = await UserAddress.update(address.id, {
      name,
      streetName,
      streetNumber,
      office,
      postalCode,
      city,
      country,
    })

    return {
      address: updatedAddress,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'put',
  path: '/users/:userId/addresses/:addressId',
}
