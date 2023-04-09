// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { ObjectIdSchema } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'
import { userSchema } from '../users/users.schema.js'

// Main data model schema
export const messageSchema = {
  $id: 'Message',
  type: 'object',
  additionalProperties: false,
  required: ['_id', 'text'],
  properties: {
    _id: ObjectIdSchema(),
    text: { type: 'string' },
    createdAt: {type: 'number'}
  }
}
export const messageValidator = getValidator(messageSchema, dataValidator)
export const messageResolver = resolve({})

export const messageExternalResolver = resolve({})

// Schema for creating new data
export const messageDataSchema = {
  $id: 'MessageData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...messageSchema.properties
  }
}
export const messageDataValidator = getValidator(messageDataSchema, dataValidator)
export const messageDataResolver = resolve({})

// Schema for updating existing data
export const messagePatchSchema = {
  $id: 'MessagePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...messageSchema.properties
  }
}
export const messagePatchValidator = getValidator(messagePatchSchema, dataValidator)
export const messagePatchResolver = resolve({})

// Schema for allowed query properties
export const messageQuerySchema = {
  $id: 'MessageQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(messageSchema.properties)
  }
}
export const messageQueryValidator = getValidator(messageQuerySchema, queryValidator)
export const messageQueryResolver = resolve({})
