import multer from "multer";

const storage =multer.diskStorage({//destination tells Multer where to save uploaded files.
    destination:(req,file,cb)=>{ //cb is callback
        cb(null,"./public") //null is error and //puclic folder
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)//file.originalname → uses the same name that user uploaded.
    }
})
const upload=multer({storage})
export default upload;