import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import makeDebug from 'debug'
import { Api } from './api.mjs'
import { Runner } from './runner.mjs'
import { clickAction, type, click } from './utils.mjs'

const debug = makeDebug('test:account')

describe('suite:account', () => {
  let runner, page, api, client
  const user = {
    name: 'Test',
    email: 'test@example.com',
    password: 'Pass;word1',
    newPassword: 'Pass;word2'
  }

  before(async () => {
    chailint(chai, util)

    api = new Api()
    client = api.createClient()
    runner = new Runner()
    page = await runner.start()
  })

  beforeEach(() => {
    runner.clearErrors()
  })

  afterEach(() => {
    expect(runner.hasError()).beFalse()
  })

  it('create account', async () => {
    await Promise.all([
      page.waitForNavigation(),
      clickAction(page, 'register-link')
    ])
    debug('Register screen ready')
    await type(page, '#username-field', user.name)
    await type(page, '#email-field', user.email)
    await type(page, '#password-field', user.password)
    await type(page, '#passwordConfirmation-field', user.password)
    await clickAction(page, 'register-button', 1500)
  })

  it('logout session', async () => {
    await clickAction(page, 'fab')
    await clickAction(page, 'logout')
  })

  it('login session', async () => {
    await type(page, '#email-field', user.email)
    await type(page, '#password-field', user.password)
    await clickAction(page, 'login-button', 5000)
  })

  it('update profile', async () => {
    await clickAction(page, 'fab')
    await clickAction(page, 'manage-account')
    await clickAction(page, 'change-password-manager')
    await type(page, '#oldPassword-field', user.password)
    await type(page, '#newPassword-field', user.newPassword)
    await type(page, '#passwordConfirmation-field', user.newPassword)
    await clickAction(page, 'change-password', 5000)
  })
  
  it('delete account', async () => {
    await clickAction(page, 'delete-account-manager')
    await clickAction(page, 'delete-account')
    await type(page, '.q-dialog-plugin input', user.email)
    await click(page, '.q-dialog-plugin button:nth-child(2)')
    await page.waitForTimeout(5000)
  })

  after(async () => {
    await runner.stop()
  })
})
