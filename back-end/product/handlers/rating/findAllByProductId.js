const yup = require('yup')
const { HandlerWithResponse, NotFoundError } = require('../../utils/response')
const { Product, ProductRating } = require('../../models')
const validate = require('../../middlewares/validate')
const { getPagination } = require('../../utils/pagination')

const validationSchema = yup.object({
  params: yup.object({
    productId: yup.string().required(),
  }),
})

/**
 * @openapi
 * /products/{productId}/ratings:
 *   get:
 *     tags:
 *      - product
 *     description: Get ratings by productId
 *     parameters:
 *     - in: path
 *       name: productId
 *       schema:
 *          type: string
 *       required: true
 *     responses:
 *       200:
 *          description: Return product ratings
 *       404:
 *          description: Product not found
 */
const handler = HandlerWithResponse(
  async ({ params: { productId }, query: { page, limit } }) => {
    const product = Product.findOneById(productId)

    if (!product) return NotFoundError('Product not found')

    const pagination = getPagination({ page, limit })

    const ratings = await ProductRating.findAllByProductId(
      productId,
      pagination
    )

    return {
      ratings,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema)],
  handler,
  method: 'get',
  path: '/products/:productId/ratings',
}
