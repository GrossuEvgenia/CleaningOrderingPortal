const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
    destination(req,file,cb){
cb(null,'uploads/')
    },
    filename(req,file,cb){
      
        cb(null,'${file.originalname}')
    }
})
const fileFilter =(req,file,cb)=>{
    if(file.mimetype==='image/png'||
    file.mimetype==='image/jpeg'){
        cb(null,true)
    }
    else{
        cb(null,false)
    }
}
module.exports=multer({
storage: storage,
fileFilter: fileFilter
})