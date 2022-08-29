const yup = require('yup')
const {
  HandlerWithResponse,
  NotFoundError,
  NotAuthorizedError,
} = require('../../utils/response')
const { Product, User, UserWishlist } = require('../../models')
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
 * /users/{userId}/wishlist/products/{productId}:
 *   put:
 *     tags:
 *      - wishlist
 *     description: Delete product from wishlist
 *     parameters:
 *     - in: path
 *       name: userId
 *       schema:
 *          type: string
 *       required: true
 *     responses:
 *       200:
 *          description: Return wishlist
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

    const wishlist = await UserWishlist.deleteProduct({ user, product })

    return {
      wishlist,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'delete',
  path: '/users/:userId/wishlist/products/:productId',
}
