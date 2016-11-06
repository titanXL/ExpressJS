let express = require('express')
let router = express.Router()
let Class = require('../models/class')
let Student = require('../models/student')
let User = require('../models/user')

router.get('/classes', ensureAuthenticated, function (req, res, next) {
  Student.getStudentByUsername(req.user.username, function (error, student) {
    if (error) {
      console.log(error)
      res.send(error)
    }else {
      res.render('students/classes', {'student': student})
    }
  })
})

router.post('/classes/register', function (req, res) {
  let info = []
  info['student_username'] = req.user.username
  info['class_id'] = req.body.class_id
  info['class_title'] = req.body.class_title

  Student.register(info, function (err, student) {
    if (err) throw err
    console.log(student)
  })

  req.flash('success', 'You are now registered')
  res.redirect('/students/classes')
})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = router
