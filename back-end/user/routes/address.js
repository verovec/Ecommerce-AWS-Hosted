const {
  create,
  update,
  delete: deleteHandler,
  findAllByUserId,
  findOneByUserId,
} = require('../handlers/address')

module.exports = [
  create,
  update,
  deleteHandler,
  findOneByUserId,
  findAllByUserId,
]
