import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
       type:String,
       required:true,
       unique:true
    },
    password:{
        type:String,
        required:true
    },
    resetOtp: {
   type: String,
   },
 otpExpire: {
   type: Date,
 },

 
      AssistantName: {
        type: String,
        default: ""
    },

    // Assistant Image URL (cloudinary URL store)
    AssistantImage: {
        type: String,
        default: ""
    },
    history:  {
  type: [String],
  default: [],
},

},{timestamps:true})//time stamps time batayega whenever new data enter

const User=mongoose.model("User",userSchema);
export default User;