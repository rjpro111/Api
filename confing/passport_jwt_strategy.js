const passport = require('passport');
const passportjwt = require('passport-jwt')
const jwtStrategy = require ('passport-jwt').Strategy;
const jwtExtract = require('passport-jwt').ExtractJwt;
const register = require('../models/admin/registration');
const manegermodel = require('../models/maneger/manegerregistration');
const usertypemodel = require('../models/user/userregistration');
var opts = {
    jwtFromRequest : jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey:'batch',
}

var opts1 = {
    jwtFromRequest :jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey :'Manager'
}

var opts2 = {
    jwtFromRequest :jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey :'User'
}



passport.use(
    new jwtStrategy(opts,async(aashish,done)=>{
        let data = await register.findById(aashish.data._id);
        // data ? done(null,data):done(null,false);
        if(data){
            return done(null,data)
        }
        else{
            return done(null,false);
        }
    })
)

passport.use("Manager",new jwtStrategy( opts1, async function(record , done){
    let checkAdmin1 = await manegermodel.findById(record.data._id);
   
    if(checkAdmin1){
        return done(null,checkAdmin1)
    }
    else{
        return done(null,false);
    }
}))


passport.use("User",new jwtStrategy( opts2, async function(record , done){
    let checkAdmin1 = await usertypemodel.findById(record.userdata._id);
   
    if(checkAdmin1){
        return done(null,checkAdmin1)
    }
    else{
        return done(null,false);
    }
}))


passport.serializeUser(function(user,done){
    return done(null,user.id)
})
passport.deserializeUser(async function(id,done){
    let rechek = await register.findById(id);
    if(rechek)
    {
        return done(null,rechek);
    }
    else
    {
        return done(null,false);
    }
});