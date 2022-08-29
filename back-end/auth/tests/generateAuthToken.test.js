require('dotenv').config()
const {
  handler: generateAuthTokenHandler,
} = require('../handlers/generateAuthToken')

describe('Generate Auth token', () => {
  it('Should generate and return jwt token', async () => {
    const response = await generateAuthTokenHandler({
      user: {
        id: 1,
        username: 'test',
        roles: [
          {
            id: 1,
            name: 'SELLER',
          },
        ],
      },
    })

    expect(response).toBeDefined()
    expect(response.success).toBeTruthy()
    expect(response.status).toEqual(200)
    expect(response.data).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    )
  })
  it('Should return an error with empty user', async () => {
    const response = await generateAuthTokenHandler({
      user: {},
    })

    expect(response).toBeDefined()
    expect(response.success).toBeFalsy()
    expect(response.status).toEqual(403)
    expect(response.error).toEqual(
      expect.objectContaining({
        message: 'Please specify a valid user',
        code: 'AUTH:INVALID_USER',
      })
    )
  })
})
