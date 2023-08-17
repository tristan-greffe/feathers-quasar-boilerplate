import _ from 'lodash'
import makeDebug from 'debug'
import request from 'superagent'
import feathers from '@feathersjs/client'
import auth from '@feathersjs/authentication-client'

const debug = makeDebug('test:api')

export class Api {
  constructor () {
    // Compute helper default options
    const defaultPort = process.env.PORT || process.env.HTTPS_PORT || 8081
    let domain = `http://localhost:${defaultPort}`
    // Set the runner options using default and overrrident options
    this.options = {
      baseUrl: domain,
      apiPrefix: process.env.API_PREFIX || '/api',
      appName: 'boilerplate'
    }
  }

  createClient () {
    const client = feathers()
    client.configure(feathers.rest(this.options.baseUrl).superagent(request))
      .configure(auth({ path: `${this.options.apiPrefix}/authentication` }))
    // Display the API options
    debug('API access created with the following options: ', this.options)

    client.login = async (user) => {
      const response = await client.authenticate({
        strategy: 'local', email: user.email, password: user.password
      })
      return response.accessToken
    }

    return client
  }
}
