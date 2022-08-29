const {
  create,
  delete: deleteHandler,
  findOne,
  update,
  findAll,
} = require('../handlers/product')

module.exports = [create, deleteHandler, findOne, update, findAll]
