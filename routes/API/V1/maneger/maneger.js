const express = require('express');
const routes = express.Router();
const manegerregistration = require('../../../../models/maneger/manegerregistration');
const manegercontroller = require('../../../../controllers/API/V1/maneger/manegercontroller');
const passport = require('passport');
const route = require('../admi/admin');


routes.post('/addmaneger',passport.authenticate('jwt', { failureRedirect: "/admin/manegerrouts/faillogin" }),manegerregistration.uploadimage,manegercontroller.addmaneger);

routes.get("/faillogin" ,async (req,res) =>{
    return res.status(400).json({msg:'invalid Login  111',status:0});
});


routes.post('/login',manegercontroller.login);
routes.get('/profile',passport.authenticate('Manager',{failureRedirect:'/admin/maneger/faillogin'}),manegercontroller.profile);
routes.get("faillogin" ,async (req,res) =>{
    return res.status(400).json({msg:'invalid Login  111',status:0});
});
  
routes.put('/profileEdit/:id',passport.authenticate('Manager',{failureRedirect:'/admin/maneger/faillogin'}),manegerregistration.uploadimage,manegercontroller.profileEdit);
routes.get("/faillogin" ,async (req,res) =>{
    return res.status(400).json({msg:'invalid Login  111',status:0});
});

module.exports=routes;