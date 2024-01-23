const express = require('express');
const routes = express.Router();
const Register = require('../../../../models/admin/registration');
const admincontroller = require('../../../../controllers/API/V1/admin/admincontroller');
const manegercontroller = require('../../../../controllers/API/V1/maneger/manegercontroller')
const passport = require('passport');


routes.post('/register',Register.uploadimage,admincontroller.register);
routes.post('/login',admincontroller.login);
routes.get('/profile',passport.authenticate('jwt',{failureRedirect:'/admin/faillogin'}),admincontroller.profile);
routes.put('/profileEdit/:id',passport.authenticate('jwt',{failureRedirect:'/admin/faillogin'}),Register.uploadimage,admincontroller.profileEdit);
routes.get("/faillogin", async (req, res) => {
    return res.status(400).json({ msg: 'invalid Login', status: 0 });
});
routes.get('/viewallAdmin', passport.authenticate('jwt', { failureRedirect: "/admin/faillogin" }), admincontroller.viewalladmin);

routes.use('/maneger',require('../maneger/maneger'));
module.exports = routes;
