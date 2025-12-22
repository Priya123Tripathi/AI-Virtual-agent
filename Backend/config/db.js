// import mongoose from "mongoose"
// const connectDb=async()=>{

//     try{  //code ko database se connect karaya hai
//         await mongoose.connect(process.env.MONGODB_URL)
//       console.log("db connected");
//        console.log(` MongoDB connected to host: ${conn.connection.host}`);
//     console.log(`Database name in use: ${conn.connection.name}`);
//     }catch(err){
//         console.log(err);
//     }

// }
// export default connectDb;

import mongoose from "mongoose";

const connectDb = async () => {
  try {
    //  Store the connection object in a variable
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("mongodb connected");
   
  } catch (err) {
    console.error(" MongoDB Connection Error:", err.message);
  }
};

export default connectDb;
