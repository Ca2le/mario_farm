import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

function generateDatabaseURI(): string {
  const password = process.env.PASSWORD as string;
  const user = process.env.USER as string;
  const uri = process.env.URI as string
  return uri.replace("<%%PASSWORD%%>", password).replace("<%%USER%%>", user);
}

async function connectToDatabase() {
  const databaseURI = generateDatabaseURI();
  try {
    const connection = await mongoose.connect(databaseURI);
    console.log("Connected to the database:", connection);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

connectToDatabase();