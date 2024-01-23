const mongoose=require('mongoose');
const multer = require('multer');
const imagepart = "/uploades/admin";
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
    // mangerIds:{
    //     type:Array,
    //     ref:'maneger'
    // }
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
registerSchema.statics.imagepart = imagepart;


// let Register = mongoose.model('maneger',registerSchema)
const Register = mongoose.model('Register',registerSchema);
module.exports = Register;