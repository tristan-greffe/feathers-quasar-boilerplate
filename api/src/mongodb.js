import { MongoClient } from 'mongodb'

export const mongodb = async (app) => {
  const connection = app.get('mongodb')
  const database = new URL(connection).pathname.substring(1)

  const mongoClient = await MongoClient.connect(connection)
  const db = mongoClient.db(database)

  app.set('mongodbClient', { client: mongoClient, db: db })
}
