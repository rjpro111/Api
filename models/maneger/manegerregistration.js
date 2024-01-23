const mongoose=require('mongoose');
const multer = require('multer');
const imagepart = ("/uploades/maneger");
const path = require('path');

const registerSchema=mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    image:{
        type:String,
    },
    // adminIds:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Register',
    //     required : true
    // },
});

const imagestorage = multer.diskStorage({
    destination: function(req,file,cb)
    {
        cb(null,path.join(__dirname,"../..",imagepart));
    },
    filename: function(req,file,cb)
    {
        cb(null,file.fieldname+"-"+Date.now());
    }
}); 


registerSchema.statics.uploadimage = multer({storage:imagestorage}).single('image');
registerSchema.statics.manegerimgpath = imagepart;
// let maneger = mongoose.model('Register',registerSchema);
const maneger = mongoose.model('maneger',registerSchema);
module.exports = maneger;