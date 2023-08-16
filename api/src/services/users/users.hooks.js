import { authenticate } from '@feathersjs/authentication'
import { passwordHash } from '@feathersjs/authentication-local'
import { resolve } from '@feathersjs/schema'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { validateUniqueEmail, enforcePasswordPolicy, removeVerification, addVerification, sendWelcomeEmail } from '../../hooks/hooks.users.js'

export default {
  around: {
    all: [schemaHooks.resolveExternal(resolve({ password: async () => undefined }))],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
  },
  before: {
    all: [],
    find: [],
    get: [],
    create: [addVerification, enforcePasswordPolicy(), validateUniqueEmail(), schemaHooks.resolveData(resolve({ password: passwordHash({ strategy: 'local' })}))],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [sendWelcomeEmail],
    update: [removeVerification],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}