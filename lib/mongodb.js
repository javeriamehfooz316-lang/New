import { MongoClient } from "mongodb";

const options = {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  socketTimeoutMS: 15000,
};

let client;

async function getMongoClient() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it in your deployment environment variables.");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  client = new MongoClient(uri, options);
  return client.connect();
}

export default getMongoClient;