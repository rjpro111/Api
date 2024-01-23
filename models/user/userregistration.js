const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const imgpath = ("/uploades/user");

const usershema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
    },
    userimg: {
        type: String,
    },
    hobby: {
        type: Array,
    }
});

const imagestoreg = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../..", imgpath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    }
});

usershema.statics.uploadimg = multer({ storage: imagestoreg }).single('userimg');
usershema.statics.userimgpath=imgpath;

const usertypemodel = mongoose.model('usermodel', usershema);
module.exports = usertypemodel;



