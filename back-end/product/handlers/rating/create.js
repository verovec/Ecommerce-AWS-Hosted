const yup = require('yup')
const {
  HandlerWithResponse,
  NotFoundError,
  NotAuthorizedError,
} = require('../../utils/response')
const { Product, ProductRating, User } = require('../../models')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')

const validationSchema = yup.object({
  params: yup.object({
    productId: yup.string().required(),
  }),
  body: yup.object({
    count: yup.number().integer().min(1).max(5).required(),
    message: yup.string(),
  }),
})

/**
 * @openapi
 * /products/{productId}/ratings:
 *   put:
 *     tags:
 *      - product
 *     description: Add rating on product
 *     parameters:
 *     - in: path
 *       name: productId
 *       schema:
 *          type: string
 *       required: true
 *     responses:
 *       200:
 *          description: Return rating
 *       404:
 *          description: Product not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({
    user: authedUser,
    params: { productId },
    body: { count, message },
  }) => {
    const product = await Product.findOneById(productId, { instance: true })
    if (!product) return NotFoundError('Product not found')

    const userRating = await ProductRating.findOneByUserAndProductId(
      productId,
      authedUser.id
    )

    if (userRating)
      return NotAuthorizedError(
        'Only one rating by user is allowed for each product'
      )

    const user = await User.findOneById(authedUser.id, { instance: true })

    const rating = await ProductRating.create(
      { product, user },
      { count, message }
    )

    return {
      rating,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'post',
  path: '/products/:productId/ratings',
}
