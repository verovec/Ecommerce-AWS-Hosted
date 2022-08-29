module.exports = {
  development: {
    url: process.env.MYSQL_URI,
    dialect: 'mysql',
    seederStorage: 'json',
  },
}
