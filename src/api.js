import io from 'socket.io-client'
import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import rest from '@feathersjs/rest-client'

export function createClient (config) {
  // Create the client Feathers app
  const api = feathers()

  // Configure transport
  const origin = config.origin
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
    storage: window.localStorage,
    storageKey: config.apiJwt || 'feathers-jwt',
    jwtStrategy: 'jwt'
  }))

  return api
}

export let api
export function initializeApi (config) {
  api = createClient(config)
  return api
}