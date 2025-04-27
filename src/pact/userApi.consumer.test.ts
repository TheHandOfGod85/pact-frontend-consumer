import { PactV4, MatchersV3, SpecificationVersion } from '@pact-foundation/pact'
import getUser from '../app/actions/getUser'
import path from 'path'

const provider = new PactV4({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'NextJS-Client',
  provider: 'DotNet-API',
  spec: SpecificationVersion.SPECIFICATION_VERSION_V4,
})

const expectedUser = { id: 1, name: 'John Doe'}
// const expectedUser = { id: 1, name: 'John Doe', gender: 'M' }
const EXPECTED_BODY = MatchersV3.equal(expectedUser)
console.log('EXPECTED_BODY', EXPECTED_BODY)

describe('GET /user', () => {
  it('returns an http 200 and a user', () => {
    return provider
      .addInteraction()
      .given('there is a user')
      .uponReceiving('a request for the user by id')
      .withRequest('GET', '/user', (builder) => {
        builder.query({ id: MatchersV3.number(1) })
        builder.headers({ Accept: 'application/json' })
      })
      .willRespondWith(200, (builder) => {
        builder.headers({ 'Content-Type': 'application/json' })
        builder.jsonBody(EXPECTED_BODY)
      })
      .executeTest(async (mockserver) => {
        const response = await getUser(mockserver.url, 1)
        expect(response).toEqual(expectedUser)
      })
  })
})
