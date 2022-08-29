const yup = require('yup')
const {
  HandlerWithResponse,
  NotFoundError,
  ValidationError,
} = require('../../utils/response')
const { Product, UserWishlist } = require('../../models')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { canManageUser } = require('../../utils/permissions')
const { validateProductCategories } = require('../../utils/productCategories')
const elasticsearch = require('../../utils/elasticsearch')
const rabbitmq = require('../../utils/rabbitmq')
const sqs = require('../../utils/sqs')

const validationSchema = yup.object({
  body: yup.object({
    name: yup.string(),
    state: yup.mixed().oneOf(Object.values(Product.STATES)),
    price: yup.number().integer(),
    description: yup.string(),
    quantity: yup.number(),
    mark: yup.string(),
    forSale: yup.boolean(),
    tags: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string().required(),
        })
      )
      .max(20),
    categories: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.number().required(),
        })
      )
      .max(20),
  }),
})

/**
 * @openapi
 * /products/{productId}:
 *   put:
 *     tags:
 *      - product
 *     description: Update a product by id
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *          description: Return updated Product
 *       404:
 *          description: Product not found
 *       403:
 *          description: Authorization needed
 */
const handler = HandlerWithResponse(
  async ({
    user: authedUser,
    body: {
      name,
      state,
      price,
      description,
      quantity,
      forSale,
      tags,
      mark,
      categories,
    },
    params: { productId },
  }) => {
    const product = await Product.findOneById(productId)

    if (!(await canManageUser(authedUser, product && product.userId)))
      return NotFoundError()

    const { valid, categories: validCategories } =
      await validateProductCategories(categories)
    if (!valid) return ValidationError('Invalid category ids')

    const updatedProduct = await Product.update(
      productId,
      { tags, categories: validCategories },
      {
        name,
        state,
        price,
        description,
        quantity,
        forSale,
        mark,
      }
    )

    await elasticsearch.updateDocument({
      id: productId,
      document: {
        name,
        state,
        price,
        description,
        quantity,
        forSale,
        mark,
      },
    })

    const userIds = await UserWishlist.findUserIdByProductQuantity(
      productId,
      updatedProduct.quantity
    )

    await Promise.all(
      userIds.map(async (userId) => {
        const user = await rabbitmq.publish('user:findUserById', {
          id: userId,
        })

        await sqs.sendEmail(user.email, 'd-f4f36e0ddd4e427e9237a46dc3a5d4bc', {
          name: user.name,
          title: updatedProduct.name,
        })
      })
    )

    return {
      product: updatedProduct,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'put',
  path: '/products/:productId',
}
