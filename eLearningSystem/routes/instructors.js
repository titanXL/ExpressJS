let express = require('express')
let router = express.Router()
let Class = require('../models/class')
let Instructor = require('../models/instructor')
let User = require('../models/user')

router.get('/classes', ensureAuthenticated, function (req, res, next) {
  Instructor.getInstructorByUsername(req.user.username, function (error, instructor) {
    if (error) {
      console.log(error)
      res.send(error)
    }else {
      res.render('instructors/classes', {'instructor': instructor})
    }
  })
})

router.post('/classes/register', function (req, res) {
  let info = []
  info['instructor_username'] = req.user.username
  info['class_id'] = req.body.class_id
  info['class_title'] = req.body.class_title

  Instructor.register(info, function (err, instructor) {
    if (err) throw err
    console.log(instructor)
  })

  req.flash('success', 'You are now registered')
  res.redirect('/instructors/classes')
})

router.get('/classes/:id/lessons/new', ensureAuthenticated, function (req, res, next) {
  res.render('instructors/newlesson', {'class_id': req.params.id})
})

router.post('/classes/:id/lessons/new', ensureAuthenticated, function (req, res, next) {
  let info = []
  info['class_id'] = req.params.id
  info['lesson_number'] = req.body.lesson_number
  info['lesson_title'] = req.body.lesson_title
  info['lesson_body'] = req.body.lesson_body

  Class.addLesson(info, function (err, lesson) {
    if (err) throw err
    console.log('lesson added')
  })
  req.flash('success', 'Lesson added')
  res.redirect('/instructors/classes')
})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = router
