import { MongoClient } from "mongodb";

export async function connectToCollection(
  dbName: string,
  collectionName: string
) {
  const mongoClient = new MongoClient(process.env.MONGODB_URI as string);
  await mongoClient.connect();

  return mongoClient.db(dbName).collection(collectionName);
}
