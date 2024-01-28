import { feathers } from '@feathersjs/feathers'
import express, { rest } from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import _ from 'lodash'
import { mongodb } from '../src/mongodb.js'
import { authentication } from '../src/authentication.js'
import { services } from '../src/services/index.js'

import assert from 'assert'
import request from 'superagent'
import chai from 'chai'
import chailint from 'chai-lint'

const { util, expect } = chai

describe('core:services', () => {
  let app, server, port, userService, baseUrl, accessToken, userObject

  before(async () => {
    chailint(chai, util)
    app = express(feathers())
    app.configure(configuration())
    const bodyParserConfig = app.get('bodyParser')
    app.use(express.json(_.get(bodyParserConfig, 'json')))
    app.configure(rest())
    await mongodb(app)
    app.configure(authentication)
    port = app.get('port')
    baseUrl = `http://localhost:${port}${app.get('apiPath')}`
  })
  it('registers the services', async () => {
    await app.configure(services)
    userService = app.service('api/users')
    expect(userService).toExist()
    expect(app.service('api/authentication')).toExist()
    expect(app.service('api/mailer')).toExist()
    expect(app.service('api/account')).toExist()
    // Now app is configured launch the server
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(10000)

  it('cannot create a user with a weak password', async () => {
    await assert.rejects(() => userService.create({
      email: 'test@test.org',
      password: 'weak;',
      name: 'test-user'
    }), error => {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
      expect(error.data.translationKey).to.deep.equal('WEAK_PASSWORD_MIN')
      return true
    })

    await assert.rejects(() => userService.create({
      email: 'test@test.org',
      password: '12345678',
      name: 'test-user'
    }), error => {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
      expect(error.data.translationKey).to.deep.equal('WEAK_PASSWORD_UPPERCASE')
      return true
    })

    await assert.rejects(() => userService.create({
      email: 'test@test.org',
      password: 'PASSWORDTOTO',
      name: 'test-user'
    }), error => {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
      expect(error.data.translationKey).to.deep.equal('WEAK_PASSWORD_LOWERCASE')
      return true
    })

    await assert.rejects(() => userService.create({
      email: 'test@test.org',
      password: 'PasswordToto',
      name: 'test-user'
    }), error => {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
      expect(error.data.translationKey).to.deep.equal('WEAK_PASSWORD_DIGITS')
      return true
    })

    await assert.rejects(() => userService.create({
      email: 'test@test.org',
      password: 'PasswordToto1',
      name: 'test-user'
    }), error => {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
      expect(error.data.translationKey).to.deep.equal('WEAK_PASSWORD_SYMBOLS')
      return true
    })
  })
  // Let enough time to process
    .timeout(20000)

  it('creates a user', async () => {
    function sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
    userService.create({
      email: 'test@test.org',
      password: 'Pass;word1',
      name: 'test-user'
    })
    const users = await userService.find({ query: { email: 'test@test.org' } })
    await sleep(2000)
    console.log(users.data)
    userObject = users.data[0]
    expect(users.data.length > 0).beTrue()
    expect(users.data[0].name).toExist()
    expect(users.data[0].name).to.equal('test-user')
    expect(users.data[0].isVerified).to.equal(false)
    expect(users.data[0].email).toExist()
    expect(users.data[0].email).to.equal('test@test.org')
  })
  // Let enough time to process
    .timeout(20000)

  it('authenticates a user', () => {
    return request
      .post(`${baseUrl}/authentication`)
      .send({ email: 'test@test.org', password: 'Pass;word1', strategy: 'local' })
      .then(response => {
        accessToken = response.body.accessToken
        expect(accessToken).toExist()
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('authenticated user can access services', () => {
    return userService.find({ query: {}, params: { user: userObject } })
      .then(users => {
        expect(users.data.length === 1).beTrue()
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('unauthenticates a user', () => {
    return request
      .del(`${baseUrl}/authentication`)
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken)
      .then(response => {
        expect(response.status).to.equal(200)
      })
  })

  it('removes a user', () => {
    return userService.remove(userObject._id, { user: userObject })
      .then(user => {
        return userService.find({ query: { name: 'test-user' } })
      })
      .then(users => {
        expect(users.data.length === 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  // Cleanup
  after(async () => {
    const mongoClient = app.get('mongodbClient')

    if (mongoClient) {
      await mongoClient.client.close()
    }
    if (server) await server.close()
  })
})
