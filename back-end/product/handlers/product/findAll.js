const yup = require('yup')
const { HandlerWithResponse } = require('../../utils/response')
const { Product } = require('../../models')
const validate = require('../../middlewares/validate')
const { getPagination } = require('../../utils/pagination')
const elasticsearch = require('../../utils/elasticsearch')

const validationSchema = yup.object({
  query: yup.object({
    page: yup.number().integer(),
    limit: yup.number().integer(),
    name: yup.string(),
    tagNames: yup.string(),
    categoryIds: yup.string(),
    states: yup.string(),
    userIds: yup.string(),
    fromPrice: yup.number().integer(),
    toPrice: yup.number().integer(),
  }),
})

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *      - product
 *     description: Search for some products
 *     parameters:
 *     - in: path
 *       name: productId
 *     - in: query
 *       name: page
 *       schema:
 *          type: integer
 *     - in: query
 *       name: limit
 *       schema:
 *          type: integer
 *     responses:
 *       200:
 *          description: Return products
 *       404:
 *          description: Address not found
 */
const handler = HandlerWithResponse(
  async ({
    query: {
      page,
      limit,
      name,
      categoryIds,
      userIds,
      tagNames,
      states,
      fromPrice,
      toPrice,
    },
  }) => {
    let productIdsFromElasticsearch = []
    const pagination = getPagination({ page, limit })

    const shouldBeSplitted = {
      userIds,
      categoryIds,
      states,
      tagNames,
    }

    const splittedItems = Object.keys(shouldBeSplitted).reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: shouldBeSplitted[curr]
          ? shouldBeSplitted[curr].split(',')
          : undefined,
      }),
      {}
    )

    if (name) {
      productIdsFromElasticsearch = (
        await elasticsearch.search({
          match: {
            name,
          },
        })
      ).map(({ _source }) => _source.id)
    }

    const products = await Product.findAll(pagination, {
      ids: productIdsFromElasticsearch,
      fromPrice,
      toPrice,
      ...splittedItems,
    })

    return {
      products,
    }
  }
)

module.exports = {
  middlewares: [validate(validationSchema)],
  handler,
  method: 'get',
  path: '/products',
}
