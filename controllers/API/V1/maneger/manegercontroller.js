const Register = require("../../../../models/maneger/manegerregistration");
const bcrypt = require('bcrypt');
const express = require('express');
const jwtdata = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
const fs  = require('fs');
const adminmodels = require('../../../../models/admin/registration')

 module.exports.addmaneger = async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    try {
        if (req.body.password == req.body.confirmassword) {

            let check = await Register.findOne({ email: req.body.email });
                
            if (check) {
                return res.status(200).json({ msg: 'Email alrady  Ragisted....', status: 1 });
            }
            else {
                var imgpath = "";
                if(req.file){
                    imgpath = await Register.manegerimgpath + "/" + req.file.filename;
                }
                req.body.manegerimages = imgpath;
                const manpassword=req.body.password;
                req.body.password = await bcrypt.hash(req.body.password, 10);

                let manegerdata = await Register.create(req.body);

                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                      // TODO: replace user and pass values from <https://forwardemail.net>
                      user: "jagatiyarupesh8@gmail.com",
                      pass: "tbxctqujrcuobtyv",
                    },
                  });
               
                    // send mail with defined transport object
                    const info = await transporter.sendMail({
                      from: 'jagatiyarupesh8@gmail.com', // sender address
                      to: `${req.body.email}`, // list of receivers
                      subject: "Hello ✔", // Subject line
                      text: "Hello world?", // plain text body
                      html:` <b>email:${req.body.email},password:${manpassword}</b>`, // html body
                    });
         
                    // req.body.password = await bcrypt.hash(req.body.password, 10);

                if (manegerdata) {
                    return res.status(200).json({ msg: 'Data Inserted Succ....', status: 1, rec: manegerdata });
                }
                else {
                    return res.status(400).json({ msg: 'Data not Inserted', status: 0, rec: data });
                }
            }
        }
        else {
            console.log('password not Match');
            return res.status(200).json({ msg: 'Confirm Password not Match', status: 0 });
        }
    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status:0});
    }
}

module.exports.login=async(req,res)=>{
     try {
        let checkemail = await Register.findOne({ email: req.body.email });
        if (checkemail) {
            if (await bcrypt.compare(req.body.password, checkemail.password)) {
                let token = await jwtdata.sign({ data: checkemail }, 'Manager', { expiresIn: '1h' });
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
}


module.exports.profile = async (req, res) => {
    // console.log(req.user);
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