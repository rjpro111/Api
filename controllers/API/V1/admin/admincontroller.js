const Register = require("../../../../models/admin/registration");
const bcrypt = require('bcrypt');
const express = require('express');
const jwtdata = require('jsonwebtoken');
const path = require('path');
const fs  = require('fs');
const { log } = require("console");
module.exports.register = async (req, res) => {
    try {
        let checkemail = await Register.findOne({ email: req.body.email });
        if (checkemail) {
            return res.status(400).json({ msg: "email is already enist", status: 0 })
        }
        else {
            let cpass = req.body.confirm_pass;
            if (cpass == req.body.password) {
                var imagepath = "";

                if (req.file) {
                    imagepath = Register.imagepart + '/' + req.file.filename;
                }
                req.body.image = imagepath;
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let redata = await Register.create(req.body);
                if (redata) {
                    return res.status(200).json({ msg: "record is insert", status: 1 });
                }
                else {
                    return res.status(200).json({ msg: "record is not insert", status: 0 })
                }
            }
            else {
                return res.status(200).json({ msg: "confirm password is not match", status: 0 })
            }
        }
    }
    catch (err) {
        return res.status(200).json({ msg: "record is not found", status: 0 })
    }
}


module.exports.login = async (req, res) => {
    console.log(req.body);
    try {
        let checkemail = await Register.findOne({ email: req.body.email });
        if (checkemail) {
            if (await bcrypt.compare(req.body.password, checkemail.password)) {
                let token = await jwtdata.sign({ data: checkemail }, 'batch', { expiresIn: '1h' });
                return res.status(200).json({ msg: "login is success", status: 1, record: token });
            }
            else {
                return res.status(200).json({ msg: "password is not match", status: 0 });
            }
        }
        else {
            return res.status(200).json({ msg: "invalid email ", status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ msg: "record is not found", status: 0 })
    }
};

module.exports.viewalladmin = async (req, res) => {
    console.log(req.user);
    try {
        let admin = await Register.findOne({});
        console.log(admin);
        if (admin) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, record: admin });
        }
        else {
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
};


module.exports.profile = async (req, res) => {
    console.log(req.body);
    try {
        let admin = await req.user;
        if (admin) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: admin });
        }
        else {
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
};


module.exports.profileEdit = async (req, res) => {
    console.log(req.body);
    try {
        if (req.file) {
            const oldimgData = await Register.findById(req.params.id);

            if (oldimgData.image) {
                let FullPath = path.join(__dirname, "../../../..", oldimgData.image);
                console.log(FullPath);
                console.log(req.body);
                 try{
                    await fs.unlinkSync(FullPath);
                 }
                 catch(err){
                    return res.status(200).json({ msg: 'Data o=not Update', status: 0 , rec: adminupdated });
                 }
            }
            var imgpath = "";
            imgpath = Register.imagepart + "/" + req.file.filename;
            req.body.image = imgpath;
        }
        else {
            let olddata = await Register.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.image;
            }
            req.body.image = imgpath;
        }
        let adminupdated = await Register.findByIdAndUpdate(req.params.id, req.body);

        if (adminupdated) {
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: adminupdated });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    }
    catch {
        console.log("something wronge");
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
};