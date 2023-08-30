import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectToDB() {
  const password = process.env.PASSWORD as string;
  const user = process.env.USER as string;
  const uri = process.env.URI as string
  const databaseURI = uri.replace("<%%PASSWORD%%>", password).replace("<%%USER%%>", user);
  try {
    await mongoose.connect(databaseURI);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
}
