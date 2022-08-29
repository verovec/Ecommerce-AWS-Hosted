const { DataTypes, Model } = require('sequelize')
const bcrypt = require('bcrypt')
const { sequelize } = require('../utils/mysql')
const UserRole = require('./userRole')

class User extends Model {}

User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'email',
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
)

const formatted = (
  user,
  {
    password: includePassword = false,
    email: includeEmail = false,
    birthDate: includeBirthDate = false,
    enabled: includeEnabled = false,
  } = {}
) => {
  const { password, email, UserRoles, birthDate, enabled, ...formattedUser } =
    user

  return {
    ...formattedUser,
    password: includePassword ? password : undefined,
    email: includeEmail ? email : undefined,
    birthDate: includeBirthDate ? birthDate : undefined,
    enabled: includeEnabled ? enabled : undefined,
    roles: UserRoles
      ? UserRoles.map(({ id, name }) => ({ id, name }))
      : undefined,
  }
}

const comparePassword = async (plainTextPassword, hash) =>
  bcrypt.compare(plainTextPassword, hash)

const hashPassword = (password) => bcrypt.hash(password, 10)

const create = async ({ name, email, password, birthDate }, roleName) => {
  const hashedPassword = await hashPassword(password)

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    birthDate,
  })

  const userRole = await UserRole.findByName(roleName)

  if (userRole) {
    await user.addUserRole(userRole)
  }
  await user.createUserCart()
  await user.createUserWishlist()

  return formatted({ ...user.toJSON(), UserRoles: [userRole] })
}

const findOneByEmail = async (email, { fields } = {}) => {
  const user = await User.findOne({ where: { email }, include: UserRole.Model })

  if (!user) return null

  return formatted(user.toJSON(), fields)
}

const findOneById = async (id, { instance = false, fields } = {}) => {
  const user = await User.findByPk(id, { include: UserRole.Model })

  if (!user) return null

  if (instance) return user

  return formatted(user.toJSON(), fields)
}

const updateOne = async (id, { email, birthDate, name }) => {
  await User.update({ email, birthDate, name }, { where: { id } })

  return findOneById(id)
}

const disableById = async (id) =>
  User.update({ enabled: false }, { where: { id } })

const enableById = async (id) =>
  User.update({ enabled: true }, { where: { id } })

const getAll = async (
  { pagination: { limit, offset }, seller },
  { fields } = {}
) => {
  const users = await User.findAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: UserRole.Model,
        where: seller
          ? {
              name: UserRole.ROLES.SELLER,
            }
          : undefined,
      },
    ],
  })

  return users.map((user) => {
    const formattedUser = formatted(user.toJSON(), fields)

    return {
      ...formattedUser,
      roles: {
        ...UserRole.responseFormat(formattedUser.roles),
      },
    }
  })
}

module.exports = {
  Model: User,
  findOneByEmail,
  create,
  hashPassword,
  comparePassword,
  findOneById,
  disableById,
  enableById,
  formatted,
  updateOne,
  getAll,
}
