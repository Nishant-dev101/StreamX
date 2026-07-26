import mongoose from "mongoose";
import DB_NAME from "../constants.js";

export const connectDB = async () => {
 
  try {
    console.log("before mongoose connection");
    
    const connectionResponse = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("mongodb connected", connectionResponse.connection.host);
    console.log(process.env.PORT);
    
    // console.log(connectionResponse );
    
  } catch (error) {
    console.error("err", error);
    process.exit(1);
  }
} ;
