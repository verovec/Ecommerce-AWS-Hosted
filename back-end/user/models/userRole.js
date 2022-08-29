const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('../utils/mysql')

const ROLES = {
  SELLER: 'SELLER',
  BUYER: 'BUYER',
  ADMIN: 'ADMIN',
}

class UserRole extends Model {}

UserRole.init(
  {
    name: {
      type: DataTypes.ENUM(Object.values(ROLES)),
      allowNull: false,
      unique: 'column',
    },
  },
  {
    sequelize,
  }
)

const responseFormat = (roles) => {
  const hasRole = (roleName) => roles.some(({ name }) => name === roleName)

  return {
    isSeller: hasRole(ROLES.SELLER),
    isAdmin: hasRole(ROLES.ADMIN),
    isBuyer: hasRole(ROLES.BUYER),
  }
}

const findByName = async (name) => UserRole.findOne({ where: { name } })

module.exports = { Model: UserRole, ROLES, findByName, responseFormat }
