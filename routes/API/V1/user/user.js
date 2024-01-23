const express=require('express');
const routs=express.Router();
const usermodel=require("../../../../models/user/userregistration");
const usercontroller=require("../../../../controllers/API/V1/user/usercontroller");
const passport = require('passport');

routs.post('/adduser',usermodel.uploadimg,usercontroller.adduser);
routs.get('/userlogin',usercontroller.userlogin);
routs.get('/userprofile',passport.authenticate('User', { failureRedirect: "/userrouts/faillogin" }),usercontroller.userprofile);
routs.put('/useredit/:id',passport.authenticate('User',{failureRedirect:"/faillogin"}),usermodel.uploadimg,usercontroller.useredit);

routs.get("/faillogin", async (req, res) => {
    return res.status(400).json({ msg: 'invalid Login', status: 0 });
});
module.exports=routs;