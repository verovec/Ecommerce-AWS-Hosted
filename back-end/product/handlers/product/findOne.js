const yup = require('yup')
const { HandlerWithResponse, NotFoundError } = require('../../utils/response')
const { Product } = require('../../models')
const validate = require('../../middlewares/validate')

const validationSchema = yup.object({
  params: yup.object({
    productId: yup.number().required(),
  }),
})

/**
 * @openapi
 * /products/{productId}:
 *   get:
 *     tags:
 *      - product
 *     description: Get a product by id
 *     parameters:
 *     - in: path
 *       name: productId
 *     responses:
 *       200:
 *          description: Return product
 *       404:
 *          description: Address not found
 */
const handler = HandlerWithResponse(async ({ params: { productId } }) => {
  const product = await Product.findOneById(productId, { includeUser: true })

  if (!product) return NotFoundError()

  return {
    product,
  }
})

module.exports = {
  middlewares: [validate(validationSchema)],
  handler,
  method: 'get',
  path: '/products/:productId',
}
