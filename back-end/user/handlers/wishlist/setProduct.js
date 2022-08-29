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
    productId: yup.number().integer().required(),
  }),
  body: yup.object({
    quantity: yup.number().integer().min(1).required(),
  }),
})

/**
 * @openapi
 * /wishlist/products/{productId}:
 *   put:
 *     tags:
 *      - wishlist
 *     description: Set product into wishlist
 *     responses:
 *       200:
 *          description: Return wishlist
 *       404:
 *          description: Product not found
 *       403:
 *          description: Authorization needed
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

    const wishlist = await UserWishlist.setProduct(
      { user, product },
      { quantity }
    )

    return {
      wishlist,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'put',
  path: '/users/:userId/whishlist/products/:productId',
}
