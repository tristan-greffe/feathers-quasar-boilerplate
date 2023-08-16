import _ from 'lodash'
import makeDebug from 'debug'
import errors from '@feathersjs/errors'
import authManagement from 'feathers-authentication-management'

const { BadRequest } = errors
const debug = makeDebug('users:hooks')
const verifyHooks = authManagement.hooks

export function validateUniqueEmail () {
  return async function (context) {
    if (context.type !== 'before') {
      throw new Error('The \'enforePasswordPolicy\' hook should only be used as a \'before\' hook.')
    }

    const app = context.app
    const email = context.data.email || context.data.value.email
    const user = await app.service('api/users').find({ paginate: false, query: { email } })

    debug('Check email is not already in use')
    if (!_.isEmpty(user)) throw new BadRequest('A user with this email address seems to be already registered', { translationKey: 'EMAIL_ALREADY_TAKEN' })
    return context
  }
}

export function enforcePasswordPolicy () {
  return async function (context) {
    if (context.type !== 'before') {
      throw new Error('The \'enforePasswordPolicy\' hook should only be used as a \'before\' hook.')
    }

    const app = context.app
    const password = context.data.password || context.data.value.password
    const passwordPolicy = app.get('passwordPolicy')

    debug('Check minimum password length')
    if (password.length < passwordPolicy.minLength) throw new BadRequest('The provided password does not comply to the password policy', { translationKey: 'WEAK_PASSWORD_MIN' })
    debug('Check maximum password length')
    if (password.length > passwordPolicy.maxLength) throw new BadRequest('The provided password does not comply to the password policy', { translationKey: 'WEAK_PASSWORD_MAX' })
    debug('CCheck that the password contains a capital letter')
    if (passwordPolicy.uppercase && !/[A-Z]/.test(password)) throw new BadRequest('The provided password does not comply to the password policy', { translationKey: 'WEAK_PASSWORD_UPPERCASE' })
    debug('Check that the password contains a lowercase letter')
    if (passwordPolicy.lowercase && !/[a-z]/.test(password)) throw new BadRequest('The provided password does not comply to the password policy', { translationKey: 'WEAK_PASSWORD_LOWERCASE' })
    debug('Check that the password contains a number')
    if (passwordPolicy.digits && !/\d/.test(password)) throw new BadRequest('The provided password does not comply to the password policy', { translationKey: 'WEAK_PASSWORD_DIGITS' })
    debug('Check that the password contains a symbol')
    if (passwordPolicy.symbols && !/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password)) throw new BadRequest('The provided password does not comply to the password policy', { translationKey: 'WEAK_PASSWORD_SYMBOLS' })
    debug('Check if the password is prohibited')
    _.forEach(passwordPolicy.prohibited, passwordProhibited => {
      if (passwordProhibited === password) throw new BadRequest('The provided password does not comply to the password policy', { translationKey: 'WEAK_PASSWORD_ONEOF' })
    })
    return context
  }
}

export function addVerification (context) {
  return verifyHooks.addVerification('api/account')(context)
}

export function removeVerification (context) {
  return verifyHooks.removeVerification()(context)
}

export async function sendWelcomeEmail (context) {
  if (context.type !== 'after') {
    throw new Error('The \'sendVerificationEmail\' hook should only be used as a \'after\' hook.')
  }

  const accountService = context.app.service('api/account')
  debug('Send welcome email')
  await accountService.options.notifier('welcomeEmail', context.data)

  return context
}
