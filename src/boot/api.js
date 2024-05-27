import io from 'socket.io-client'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import rest from '@feathersjs/rest-client'
import config from 'config'

function createClient (config) {
  // Create the client Feathers app
  const api = feathers()

  // Configure transport
  const origin = window.location.href
  if (config.transport === 'http') {
    api.transporter = rest(origin).fetch(window.fetch.bind(window))
    api.configure(api.transporter)
  } else {
    api.socket = io(origin, {
      transports: ['websocket']
    })
    api.transporter = socketio(api.socket, { timeout: config.apiTimeout || 10000 })
    api.configure(api.transporter)
  }

  // Configure authentification
  api.configure(auth({
    path: '/api/authentication'
  }))

  return api
}

export let api
function initializeApi (config) {
  api = createClient(config)
  return api
}

export default ({ app }) => {
  // Initiate the client
  const api = initializeApi(config)
  
  // Register api propertie to the the vue app
  app.config.globalProperties.$api = api

  // Register global propertie
  // FIXME: This is used for testing purpose
  global.$api = app.config.globalProperties.$api
}
