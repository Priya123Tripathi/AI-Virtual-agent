//Yeh code ek special key (token) banata hai jisse
//  backend ko pata chal jaata hai ki kaun user request kar raha hai — bina har baar login karaye.
//JWT_SECRET ek chabi (key) hai jisse tum token ko lock/unlock karte ho.
//Iske bina JWT kaam nahi karega.
import jwt from "jsonwebtoken"
const genToken=(userId)=>{
    try{
    const token = jwt.sign(
      {userId},
      process.env.JWT_SECRET,
      {expiresIn:"10d"}
    );
 
    return token

}catch(error){
  console.log(error);
    }
}
export default genToken;