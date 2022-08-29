const create = require('./create')
const deleteHandler = require('./delete')
const findOne = require('./findOne')
const update = require('./update')
const findAll = require('./findAll')

module.exports = {
  create,
  delete: deleteHandler,
  findOne,
  update,
  findAll,
}
