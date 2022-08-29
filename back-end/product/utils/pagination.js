const getPagination = ({ page = 1, limit = 20 }) => {
  page = parseInt(page, 10)
  limit = parseInt(limit, 10)
  page -= 1
  if (page < 0) {
    page = 0
  }

  return {
    offset: page * limit,
    limit: limit <= 100 ? limit : 100,
  }
}

module.exports = { getPagination }
