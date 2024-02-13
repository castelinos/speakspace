import mongoose from "mongoose";

let isConnected = false;

export const connectToDb = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    console.log("MongoDB URL not found!!!");
    return;
  }

  if (isConnected) {
    console.log("Connection to MongoDB exists");
    return;
  }

  try {
    let c = await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting MongoDB", error);
  }
};
