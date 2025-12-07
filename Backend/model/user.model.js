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
 
      AssistantName: {
        type: String,
        default: ""
    },

    // ✅ Assistant Image URL (cloudinary URL store)
    AssistantImage: {
        type: String,
        default: ""
    },
    history:[
        {type:String}
    ]

},{timestamps:true})//time stamps time batayega whenever new data enter

const User=mongoose.model("User",userSchema);
export default User;