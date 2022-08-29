const {
  disable,
  findOneById,
  enable,
  updateOne,
  getAll,
} = require('../handlers/user')

module.exports = [disable, findOneById, enable, updateOne, getAll]
