const { Client } = require('@elastic/elasticsearch')
const { elasticsearch } = require('../config')
const logger = require('./logger')

const client = new Client({ node: elasticsearch.uri })

const index = async ({ index = 'products', document }) => {
  try {
    return await client.index({
      index,
      id: document.id,
      document,
    })
  } catch (err) {
    logger.error({ err })
  }
  return null
}

const search = async ({ index = 'products', match }) => {
  try {
    const response = await client.search({
      index,
      query: {
        match,
      },
    })
    return response.hits.hits || []
  } catch (err) {
    logger.error({ err })
  }
  return []
}

const deleteDocument = async ({ index = 'products', id }) => {
  try {
    return await client.delete({
      index,
      id,
    })
  } catch (err) {
    logger.error({ err })
  }
  return null
}

const updateDocument = async ({ index = 'products', id, document }) => {
  try {
    return await client.update({
      index,
      id,
      doc: document,
    })
  } catch (err) {
    logger.error({ err })
  }
  return null
}

module.exports = {
  index,
  search,
  deleteDocument,
  updateDocument,
}
