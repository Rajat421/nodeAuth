var express = require('express');
var router = express.Router();
var User = require('../models/user')
var passport= require('passport');
var LocalStrategy=require('passport-local').Strategy;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register',{
    title:'Register'
    
  });
});
router.get('/login', function(req, res, next) {
  res.render('login',{
    title:'Login'

  });
});

router.post('/register',function(req, res, next) {
  console.log(req, '------------>',res);
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;
  var username = req.body.username;

  req.checkBody('name', 'Name feild is Required').notEmpty();
  req.checkBody('username', 'UserName feild is Required').notEmpty();
  req.checkBody('email', 'Email feild is Required').notEmpty();
  req.checkBody('email', 'Email not valid').isEmail();
  req.checkBody('password', 'Password feild is Required').notEmpty();
  req.checkBody('password2', 'Password do not match').equals(req.body.password);

  //set Errors
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors, 'ppopop')
    res.render('register',{
      errors:errors,
      name:name,
      email:email,
      username:username,
      password:password,
      password2:password2,

    })
  }
  else{
    var newUser =new User({
      name:name,
      email:email,
      username:username,
      password:password,

    });

    User.createUser(newUser,function(err,user){
      if(err) throw err;
      console.log(user)
    });

    req.flash('success',"you are now registered and may log in");
    res.location('/');
    res.redirect('/');
  }
});

//Login

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
    function (username,password,done) {
    User.getUserByUsername(username,function (err,user) {
      if(err) throw err;
      if(!user){
        console.log('unknown User')
        return done(null,false,{message:'Unknown User'})
      }
      User.comparePassword(password,user.password,function (err,isMatch) {
        if(err) throw err;
        if(isMatch){
          return done(null,user);

        }
        else{
          console.log('Invalid Password')
          return done(null,false,{message:'Invalid Password'})
        }

      })

    })
  }
))

router.post('/login',
    passport.authenticate('local',{faliureRedirect:'/users/login',faliureFlash:"Invalid username or password"}),
    function (req,res) {
    console.log("Authentication Successfull");
      req.flash('success',"You are logged in");
      res.redirect('/');


});
router.get('/logout' ,function (req,res) {
  req.logout();
  req.flash('Success',"you are logged out");
  res.redirect('/users/login')

})


  module.exports = router;
