import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
  var _mongooseConn: typeof mongoose | null; // eslint-disable-line no-var
}

let cached = global._mongooseConn;

if (!cached) {
  global._mongooseConn = null;
  cached = null;
}

export async function connectDB() {
  if (cached) return cached;

  cached = await mongoose.connect(MONGODB_URI);
  global._mongooseConn = cached;
  return cached;
}
