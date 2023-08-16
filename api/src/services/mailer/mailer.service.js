import feathersMailer from 'feathers-mailer'
import mailerHooks from './mailer.hooks.js'

export const mailer = async (app) => {
  const mailerPath = `${app.get('apiPath')}/mailer`

  app.use(mailerPath, feathersMailer(app.get('mailer')))

  app.service(mailerPath).hooks(mailerHooks)
}