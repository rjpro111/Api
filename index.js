const express = require('express');
const db = require("./confing/mongoose");
const port = 8001;
const app = express();
const session =require('express-session')
const passport = require('passport');
const path = require('path');
const passportjwt = require('./confing/passport_jwt_strategy');
const register = require('./models/admin/registration');
app.use(express.urlencoded());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    name:'JWTSESSION',
    secret: 'batch',
    resave: true,
    saveUninitialized: false,
    cookie: { 
        maxAge : 1000*60*100
    }
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/userrouts',require("./routes/API/V1/user/user"));
app.use('/admin',require('./routes/API/V1/admi/admin'));
app.listen(port,(err)=>{
    if(err)
    {
        console.log('someting is worng');
    }
    console.log('server is runming');
});

