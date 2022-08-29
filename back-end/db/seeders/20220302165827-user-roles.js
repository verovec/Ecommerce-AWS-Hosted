module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('UserRoles', [
      {
        name: 'SELLER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'BUYER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('UserRoles', null)
  },
}
