import { user } from './users/users.service.js'
import { mailer } from './mailer/mailer.service.js'
import { account } from './account/account.service.js'
import makeDebug from 'debug'

const debug = makeDebug('services')

export const services = (app) => {
  app.configure(mailer)
  debug('\'mailer\' service created')
  app.configure(user)
  debug('\'users\' service created')
  app.configure(account)
  debug('\'account\' service created')
}
