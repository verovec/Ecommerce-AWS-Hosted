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
})

/**
 * @openapi
 * /users/{userId}/addresses/{addressId}:
 *   delete:
 *     tags:
 *      - address
 *     description: Delete an address by id for specified userId
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
 *          description: Return Deleted Address id
 *       404:
 *          description: User not found or address not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user: authedUser, params: { userId, addressId } }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const user = await User.findOneById(userId)

    if (!user) return NotFoundError()

    const address = await UserAddress.findById(addressId)

    if (!(await canManageUser(authedUser, address && address.userId)))
      return NotFoundError()

    await UserAddress.deleteById(address.id)

    return {
      address: {
        id: address.id,
      },
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'delete',
  path: '/users/:userId/addresses/:addressId',
}
