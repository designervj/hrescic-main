import { MongoClient } from "mongodb";

let cachedClient: { conn: MongoClient | null; promise: Promise<MongoClient> | null } = (global as any).mongoClient;

if (!cachedClient) {
  cachedClient = (global as any).mongoClient = { conn: null, promise: null };
}

function getConfig() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const TENANT_DB_NAME = process.env.TENANT_DB_NAME;
  return { MONGODB_URI, TENANT_DB_NAME };
}

export async function connectClient(): Promise<MongoClient> {
  const { MONGODB_URI, TENANT_DB_NAME } = getConfig();

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env");
  }
  if (!TENANT_DB_NAME) {
    throw new Error("Please define the TENANT_DB_NAME environment variable inside .env");
  }

  if (cachedClient.conn) return cachedClient.conn;

  let uri = MONGODB_URI;
  if (
    uri?.startsWith("mongodb+srv://") &&
    uri.includes("@kalpcluster.mr8bacs.mongodb.net")
  ) {
    uri = uri
      .replace(
        "@kalpcluster.mr8bacs.mongodb.net/",
        "@ac-zxbieql-shard-00-00.mr8bacs.mongodb.net:27017,ac-zxbieql-shard-00-01.mr8bacs.mongodb.net:27017,ac-zxbieql-shard-00-02.mr8bacs.mongodb.net:27017/?ssl=true&replicaSet=atlas-vw7phq-shard-0&authSource=admin&retryWrites=true&w=majority",
      )
      .replace("mongodb+srv://", "mongodb://");
  }

  if (!cachedClient.promise) {
    cachedClient.promise = MongoClient.connect(uri);
  }

  try {
    cachedClient.conn = await cachedClient.promise;
  } catch (e) {
    cachedClient.promise = null;
    throw e;
  }

  return cachedClient.conn;
}

export async function connectMasterDB() {
  const client = await connectClient();
  return client.db("kalp_master");
}

export async function connectTenantDB() {
  const client = await connectClient();
  return client.db(process.env.TENANT_DB_NAME || "hrescic_tenant");
}
