import { when } from 'feathers-hooks-common'
import { validateUniqueEmail, enforcePasswordPolicy  } from '../../hooks/hooks.users.js'

export default {
  around: {
    all: []
  },
  before: {
    all: [],
    find: [],
    get: [],
    create: [when(hook => hook.data.action === 'resetPwdShort' || hook.data.action === 'passwordChange', enforcePasswordPolicy()),
             when(hook => hook.data.action === 'sendChangeIdentity', validateUniqueEmail())],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
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