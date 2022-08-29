const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
} = require('../../utils/response')
const { UserAddress } = require('../../models')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')
const validate = require('../../middlewares/validate')

const validationSchema = yup.object({
  params: yup.object({
    userId: yup.string().required(),
    addressId: yup.number().required(),
  }),
})

/**
 * @openapi
 * /users/{userId}/addresses/{addressId}:
 *   get:
 *     tags:
 *      - address
 *     description: Get one address by id and by specified userId
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
 *          description: Return user address
 *       404:
 *          description: Address not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user: authedUser, params: { userId, addressId } }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const address = await UserAddress.findOneByUserId(userId, addressId)

    return {
      address,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'get',
  path: '/users/:userId/addresses/:addressId',
}
