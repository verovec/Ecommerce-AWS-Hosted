const yup = require('yup')
const {
  HandlerWithResponse,
  NotAuthorizedError,
  NotFoundError,
  ValidationError,
} = require('../../utils/response')
const { Product, User } = require('../../models')
const validate = require('../../middlewares/validate')
const requireAuth = require('../../middlewares/requireAuth')
const { isAdmin, isSeller } = require('../../utils/permissions')
const { validateProductCategories } = require('../../utils/productCategories')

const validationSchema = yup.object({
  body: yup.object({
    name: yup.string().required(),
    state: yup.mixed().oneOf(Object.values(Product.STATES)),
    price: yup.number().integer().required(),
    description: yup.string().required(),
    quantity: yup.number(),
    mark: yup.string().required(),
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
 * /products:
 *   post:
 *     tags:
 *      - product
 *     description: Create a product
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *          description: Return created Product
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
  }) => {
    // if (!(await isSeller(authedUser)) && !(await isAdmin(authedUser)))
    //   return NotAuthorizedError('Only sellers can create a product')

    const user = await User.findOneById(authedUser.id, { instance: true })

    if (!user) return NotFoundError('User not found')

    const { valid, categories: validCategories } =
      await validateProductCategories(categories)
    if (!valid) return ValidationError('Invalid category ids')

    const product = await Product.create(
      { user, tags, categories: validCategories },
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

    return {
      product,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema), requireAuth],
  handler,
  method: 'post',
  path: '/products',
}
