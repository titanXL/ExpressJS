let express = require('express')
let router = express.Router()
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let User = require('../models/user')
let Student = require('../models/student')
let Instructor = require('../models/instructor')

/* GET users listing. */
router.get('/signup', function (req, res, next) {
  res.render('users/signup')
})

router.post('/signup', function (req, res, next) {
  let first_name = req.body.first_name
  let last_name = req.body.last_name
  let street_address = req.body.street_address
  let city = req.body.city
  let state = req.body.state
  let zip = req.body.zip
  let email = req.body.email
  let username = req.body.username
  let password = req.body.password
  let password2 = req.body.password2
  let type = req.body.type

  req.checkBody('first_name', 'First name field should not be empty').notEmpty()
  req.checkBody('last_name', 'Last name field should not be empty').notEmpty()
  req.checkBody('email', 'Email name field should not be empty').notEmpty()
  req.checkBody('email', 'Email address should be valid').isEmail()
  req.checkBody('username', 'Username name is required').notEmpty()
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  let errors = req.validationErrors()
  if (errors) {
    res.render('users/signup', {
      errors: errors,
      first_name: first_name,
      last_name: last_name,
      street_address: street_address,
      city: city,
      state: state,
      zip: zip,
      email: email,
      username: username,
      password: password,
      password2: password2
    })
  } else {
    let newUser = new User({
      email: email,
      username: username,
      password: password,
      type: type
    })
    let newStudent = new Student({
      first_name: first_name,
      last_name: last_name,
      address: [{
        street_address: street_address,
        city: city,
        state: state,
        zip: zip
      }],
      email: email,
      username: username
    })

    let newInstructor = new Instructor({
      first_name: first_name,
      last_name: last_name,
      address: [{
        street_address: street_address,
        city: city,
        state: state,
        zip: zip
      }],
      email: email,
      username: username
    })
    if (type === 'student') {
      User.saveStudent(newUser, newStudent, function (err, user) {
        if (err) console.log(err)
        console.log('Student created')
      })
    } else {
      User.saveInstructor(newUser, newInstructor, function (err, user) {
        if (err) console.log(err)
        console.log('Instructor created')
      })
    }
    req.flash('success', 'User added')
    res.redirect('/')
  }
})

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user)
  })
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/', failureFlash: true}), function (req, res) {
  req.flash('success', 'You are now logged in')
  let usertype = req.user.type
  res.redirect('/' + usertype + 's/classes')
})

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getUserByUsername(username, function (err, user) {
      if (err) { return done(err) }
      if (!user) {
        return done(null, false, {message: 'Wrong username or password'})
      }
      User.comparePassword(password, user.password, function (err, isMatch) {
        if (err) return done(err)
        if (isMatch) {
          return done(null, user)
        } else {
          console.log('invalid passowrd')
          return done(null, false, {message: 'Wrong username or password'})
        }
      })
    })
  }
))

router.get('/logout', function (req, res) {
  req.logout()
  req.flash('success', 'You have logged out')
  res.redirect('/')
})
function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/users/login')
}
module.exports = router
