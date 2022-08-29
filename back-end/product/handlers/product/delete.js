const yup = require('yup')
const { HandlerWithResponse, NotFoundError } = require('../../utils/response')
const { Product } = require('../../models')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')
const elasticsearch = require('../../utils/elasticsearch')

const validationSchema = yup.object({
  params: yup.object({
    productId: yup.number().required(),
  }),
})

/**
 * @openapi
 * /products/{productId}:
 *   delete:
 *     tags:
 *      - product
 *     description: Delete a product
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *          description: Return delete Product id
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({ user: authedUser, params: { productId } }) => {
    const product = await Product.findOneById(productId)

    if (!(await canManageUser(authedUser, product && product.userId)))
      return NotFoundError()

    await Product.deleteById(product.id)

    await elasticsearch.deleteDocument({
      id: product.id,
    })

    return {
      product: {
        id: product.id,
      },
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'delete',
  path: '/products/:productId',
}
