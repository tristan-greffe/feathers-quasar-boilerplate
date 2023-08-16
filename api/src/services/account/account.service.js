import { AuthenticationManagementService } from 'feathers-authentication-management'
import accountHooks from './account.hooks.js'
import emails from 'email-templates'
import path from 'path'
import makeDebug from 'debug'

const debug = makeDebug('account:service')

export const notifier = (app) => {
  return async (type, user, notifierOptions = {}) => {
    const mailerService = app.service('api/mailer')
    const domainPath = app.get('domain') + '/#/'
    const email = {
      from: app.get('mailer').auth.user,
      // When changing email send to the new one so that it can be verified
      to: (type === 'identityChange' ? user.verifyChanges.email : user.email),
      domainPath
    }
    // Build the subject to the app to perform the different actions
    switch (type) {
      case 'resendVerifySignup': // send another email with token for verifying user's email addr
        email.subject = 'Confirm your signup'
        break
      case 'verifySignup': // inform that user's email is now confirmed
        email.subject = 'Thank you, your email has been verified'
        break
      case 'sendResetPwd': // send email with token to reset password
        email.subject = 'Reset your password'
        break
      case 'resetPwd': // inform that user's password is now reset
        email.subject = 'Your password was reset'
        break
      case 'passwordChange': // inform that user's password is now changed
        email.subject = 'Your password was changed'
        break
      case 'identityChange': // inform that user's email has now changed
        email.subject = 'Your account information was changed'
        break
      case 'welcomeEmail': // inform that user's email has now changed
        email.subject = 'Welcome'
        break
    }
    const templateDir = path.join(app.get('mailer').templateDir, type)
    const template = new emails.EmailTemplate(templateDir)
    // Errors does not seem to be correctly catched by the caller
    // so we catch them here to avoid any problem
    try {
      const emailContent = await template.render({ email, user }, user.locale || 'en-us')
      // Update compiled content
      email.html = emailContent.html
      debug('Sending email ', email)
      return mailerService.create(email)
    } catch (error) {
      debug('Sending email failed', error)
      app.logger.error(error)
    }
  }
}

export const account = async (app) => {
  const accountPath = `${app.get('apiPath')}/account`
  const userPath = `${app.get('apiPath')}/users`

  app.use(accountPath, new AuthenticationManagementService(app, {
    // By default it is impossible to reset password if email is not verified
    // The problem is that if you loose your password before validating your email you are blocked,
    // as a consequence we release this constraint
    skipIsVerifiedCheck: true,
    service: userPath,
    path: accountPath,
    notifier: notifier(app),
    reuseResetToken: true
  }))

  app.service(accountPath).hooks(accountHooks)
}
