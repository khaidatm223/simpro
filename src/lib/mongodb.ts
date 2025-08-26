import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("❌ Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDB() {
  const client = await clientPromise;
  return client.db("simpro");
}

// 👇 thêm dòng này để Turbopack dễ hiểu
export default connectToDB;
