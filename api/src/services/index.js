import { user } from './users/users.js'

import { message } from './messages/messages.js'

export const services = (app) => {
  app.configure(user)

  app.configure(message)

  // All services will be registered here
}
