const usermodel = require('../../../../models/user/userregistration');
const bcrypt = require('bcrypt')
const express = require('express');
const path = require('path')
const jwtdata = require("jsonwebtoken");
const fs = require('fs');

module.exports.adduser = async (req, res) => {
    try {
        if (req.body.password == req.body.confirm_pass) {

            let check = await usermodel.findOne({ email: req.body.email });
            if (check) {
                return res.status(200).json({ msg: 'Email alrady  Ragisted....', status: 1 });
            }
            else {
                var imgpath = '';

                if (req.file) {
                    imgpath = usermodel.userimgpath + "/" + req.file.filename;
                }
                req.body.userimg = imgpath;
                req.body.password = await bcrypt.hash(req.body.password, 10);

                let data = await usermodel.create(req.body);
                if (data) {
                    return res.status(200).json({ msg: "data insert successfully", status: 1, rec: data });
                }
                else {
                    return res.status(400).json({ msg: "data not insert", status: 0 });
                }
            }
        }

    }
    catch (err) {
        console.log("something went wronge");
        return res.status(200).json({ msg: "something went wronge", status: 0 })
    }
}

module.exports.userlogin = async (req, res) => {
    console.log(req.body);
    try {
        let check = await usermodel.findOne({ email: req.body.email });
        if (check) {
            if (await bcrypt.compare(req.body.password, check.password)) {
                let token = jwtdata.sign({ userdata: check }, 'User', { expiresIn: '1h' });
                return res.status(200).json({ msg: 'Login Succ.. & token granted Succ....', status: 1, rec: token });
            }
            else {
                return res.status(200).json({ msg: 'Password not match', status: 0 });
            }
        }
        else {
            console.log(' invalid email ');
            return res.status(200).json({ msg: 'invalid email', status: 0 });
        }
    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}

module.exports.userprofile = async (req, res) => {
    try {
        if (req.body) {
            let userdata = await usermodel.find({});
            if (userdata) {
                return res.status(200).json({ msg: "profile data get successfully", status: 1, rec: userdata });
            }
            else {
                return res.status(400).json({ msg: "profile data not get", status: 0 });
            }
        }
    }
    catch (err) {
        console.log("something wronge with userprofile");
        return res.status(400).json({ msg: "something wronge with userprofile", status: 0 })
    }
}


module.exports.useredit = async (req, res) => {
    try {
        if (req.file) {
            const oldimgData = await usermodel.findById(req.params.id);

            if (oldimgData.userimg) {
                let FullPath = path.join(__dirname, "../../../..", oldimgData.userimg);
                // console.log(FullPath);
                // console.log(req.body);
                try {
                    await fs.unlinkSync(FullPath);
                }
                catch {
                    return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
                }
            }
            var imgpath = "";
            imgpath = usermodel.userimgpath + "/" + req.file.filename;
            req.body.userimg = imgpath;
        }
        else {
            let olddata = await usermodel.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.userimg;
            }
            req.body.userimg = imgpath;
        }
        let userupdate = await usermodel.findByIdAndUpdate(req.params.id, req.body);

        if (userupdate) {
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: userupdate });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    }
    catch {
        console.log("something wronge");
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}
