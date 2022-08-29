const yup = require('yup')
const {
  HandlerWithResponse,
  NotFoundError,
  NotAuthorizedError,
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
})

/**
 * @openapi
 * /users/{userId}/cart/products/{productId}:
 *   put:
 *     tags:
 *      - cart
 *     description: Delete product from cart
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
  async ({ user: authedUser, params: { productId, userId } }) => {
    if (!(await canManageUser(authedUser, userId))) return NotAuthorizedError()

    const user = await User.findOneById(userId, { instance: true })
    if (!user) return NotFoundError('User not found')

    const product = await Product.findOneById(productId, { instance: true })
    if (!product) return NotFoundError('Product not found')

    const cart = await UserCart.deleteProduct({ user, product })

    return {
      cart,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'delete',
  path: '/users/:userId/cart/products/:productId',
}
