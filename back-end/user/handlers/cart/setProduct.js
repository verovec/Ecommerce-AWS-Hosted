const yup = require('yup')
const {
  HandlerWithResponse,
  NotFoundError,
  NotAuthorizedError,
  ValidationError,
} = require('../../utils/response')
const { Product, User, UserCart } = require('../../models')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')

const validationSchema = yup.object({
  params: yup.object({
    userId: yup.string().required(),
    productId: yup.number().integer().required(),
  }),
  body: yup.object({
    quantity: yup.number().integer().min(1).required(),
  }),
})

/**
 * @openapi
 * /users/{userId}/cart/products:
 *   put:
 *     tags:
 *      - cart
 *     description: Set product into cart
 *     parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *          type: string
 *       required: true
 *     responses:
 *       200:
 *          description: Return cart id
 *       404:
 *          description: Product not found
 *       403:
 *          description: Authorization needed or product is out of stock
 */
const handler = HandlerWithResponse(
  async ({
    user: authedUser,
    params: { productId, userId },
    body: { quantity },
  }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const user = await User.findOneById(userId, { instance: true })
    if (!user) return NotFoundError('User not found')

    const product = await Product.findOneById(productId, { instance: true })
    if (!product) return NotFoundError('Product not found')

    if (!product.forSale) return ValidationError('Product is not for sale')
    if (product.quantity < quantity)
      return ValidationError('Not enough product quantity')

    const cart = await UserCart.setProduct({ user, product }, { quantity })

    return {
      cart,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'put',
  path: '/users/:userId/cart/products/:productId',
}
