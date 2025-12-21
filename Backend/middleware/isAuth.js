import Jwt from "jsonwebtoken"

const isAuth=async(req,res,next)=>{
 
    try{
        const token=req.cookies?.token //
        if(!token){
            return res.status(401).json({message:"token not found"})
        }
        const verifyToken= Jwt.verify(token,process.env.JWT_SECRET);
    
       req.userId=verifyToken.userId
       next()
    
    }catch(err){
        console.log(err);
        return res.status(401).json({message:"is Auth error"})
    }
}

export default isAuth;