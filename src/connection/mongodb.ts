import { connect } from "mongoose";
import { throwServerError } from "../helpers";

const connectDB = async (callback: any) => {
  try {
    const connectionString = process.env.MONGODB_URI;
    if (connectionString) {
      console.log("Connecting to the database...");
      let connection = await connect(connectionString);
      console.log("Connected to the database");
      if (callback) callback();
    } else {
      throwServerError("No connection string provided");
    }
  } catch (error: any) {
    console.log("An error occured during db connection");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
