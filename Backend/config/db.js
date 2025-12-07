import mongoose from "mongoose"
const connectDb=async()=>{

    try{  //code ko database se connect karaya hai
        await mongoose.connect(process.env.MONGODB_URL)
      console.log("db connected");
    }catch(err){
        console.log(err);
    }

}
export default connectDb;