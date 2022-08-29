const yup = require('yup')
const {
  HandlerWithResponse,
  NotFoundError,
  ValidationError,
} = require('../../utils/response')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { UserAddress, UserCart, Order, User } = require('../../models')
const { canManageUser } = require('../../utils/permissions')
const sqs = require('../../utils/sqs')

const validationSchema = yup.object({
  body: yup.object({
    addressId: yup.number().integer().required(),
  }),
})

/**
 * @openapi
 * /orders:
 *   create:
 *     tags:
 *      - order
 *     description: Create an order
 *     responses:
 *       200:
 *          description: Return created order
 *       404:
 *          description: Cart is empty
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user: authedUser, body: { addressId } }) => {
    const userAddress = await UserAddress.findById(addressId, {
      instance: true,
    })

    if (!userAddress || !(await canManageUser(authedUser, userAddress.UserId)))
      return NotFoundError('Address not found')

    const userCart = await UserCart.findOneByUserId(
      authedUser.id,
      {},
      { instance: true }
    )

    const products = await userCart.getProducts()

    if (!products.length) return NotFoundError('Cart is empty')

    const user = await User.findOneById(authedUser.id, {
      instance: true,
    })

    const quantityErrorsProductIds = products.filter(
      (product) => product.quantity < product.UserCartHasProducts.quantity
    )
    if (quantityErrorsProductIds.length)
      return ValidationError('Some product quantity is not enough')

    const order = await Order.create({
      user,
      address: userAddress,
      cart: userCart,
    })

    await sqs.sendEmail(user.email, 'd-6d35310b4b03464688b3c9e957c4dba8', {
      name: user.name,
    })

    return {
      order,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'post',
  path: '/orders',
}
