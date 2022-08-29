require('dotenv').config()
const {
  handler: generateAuthTokenHandler,
} = require('../handlers/generateAuthToken')
const { handler: getAuthHandler } = require('../handlers/getAuth')

describe('Get Auth from token', () => {
  it('Should return auth user', async () => {
    const response1 = await generateAuthTokenHandler({
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

    const response2 = await getAuthHandler({
      headers: {
        authorization: `Bearer ${response1.data.token}`,
      },
    })

    expect(response2).toEqual(
      expect.objectContaining({
        success: true,
        status: 200,
        data: expect.objectContaining({
          user: expect.objectContaining({
            id: 1,
            roles: expect.any(Array),
          }),
          exp: expect.any(Number),
          iat: expect.any(Number),
        }),
      })
    )
  })
  it('Should return an error with empty user', async () => {})
})
