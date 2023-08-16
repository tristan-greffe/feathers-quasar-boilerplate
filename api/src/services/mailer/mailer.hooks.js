import { disallow } from 'feathers-hooks-common'

export default {
  around: {
    all: []
  },
  before: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [],
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