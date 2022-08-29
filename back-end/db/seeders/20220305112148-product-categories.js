module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('ProductCategories', [
      {
        name: 'CAR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'BOAT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'WATCH',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ProductCategories', null)
  },
}
