import mongoose from "mongoose";

export async function connectToDB() {
  console.log('server module loaded')
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
