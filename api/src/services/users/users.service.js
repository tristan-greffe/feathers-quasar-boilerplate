import { UserService, getOptions } from './users.mongodb.js'
import userHooks from './users.hooks.js'

export const user = (app) => {
  const userPath = `${app.get('apiPath')}/users`

  app.use(userPath, new UserService(getOptions(app)), {
    methods: ['find', 'create', 'patch', 'remove'],
    events: []
  })
  
  app.service(userPath).hooks(userHooks)
}