export const messagePath = 'messages'

export const messageMethods = ['find', 'get', 'create', 'patch', 'remove']

export const messageClient = (client) => {
  const connection = client.get('connection')

  client.use(messagePath, connection.service(messagePath), {
    methods: messageMethods
  })
}
