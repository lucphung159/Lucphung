import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached: typeof mongoose | null = null;

export async function connectDB() {
  if (cached) return cached;
  cached = await mongoose.connect(MONGODB_URI);
  return cached;
}
