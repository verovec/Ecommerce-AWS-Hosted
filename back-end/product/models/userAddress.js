const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/mysql')
const User = require('./user')

class UserAddress extends Model {}

UserAddress.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    streetNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    streetName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    office: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
)

const formatted = (address) => {
  const { UserCartId, UserId, ...formattedAddress } = address

  return {
    ...formattedAddress,
    userId: UserId,
  }
}

const findById = async (addressId, { instance = false } = {}) => {
  const address = await UserAddress.findByPk(addressId)

  if (!address || instance) return address

  return formatted(address.toJSON())
}

const create = async (
  user,
  { name, streetNumber, office, postalCode, city, country, streetName }
) => {
  const address = await UserAddress.create({
    name,
    streetNumber,
    office,
    postalCode,
    city,
    country,
    streetName,
  })

  await user.addUserAddress(address)

  return findById(address.id)
}

const update = async (
  addressId,
  { name, streetNumber, office, postalCode, city, country, streetName }
) => {
  await UserAddress.update(
    {
      name,
      streetNumber,
      office,
      postalCode,
      city,
      country,
      streetName,
    },
    { where: { id: addressId } }
  )

  return findById(addressId)
}

const deleteById = async (addressId) => {
  await UserAddress.destroy({ where: { id: addressId } })
}

const findAllByUserId = async (userId, { offset, limit }) => {
  const addresses = await UserAddress.findAll({
    where: { userId },
    offset,
    limit,
    order: [['createdAt', 'DESC']],
  })

  return addresses.map((address) => formatted(address.toJSON()))
}

const findOneByUserId = async (userId, addressId) => {
  const address = await UserAddress.findOne({
    where: { userId, id: addressId },
  })

  if (!address) return null

  return formatted(address.toJSON())
}

module.exports = {
  Model: UserAddress,
  create,
  formatted,
  findById,
  update,
  deleteById,
  findAllByUserId,
  findOneByUserId,
}
