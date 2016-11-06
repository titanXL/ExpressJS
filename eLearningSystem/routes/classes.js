let express = require('express')
let router = express.Router()
let Class = require('../models/class')
/* GET home page. */
router.get('/', function (req, res, next) {
  Class.getClasses(function (error, classes) {
    if (error) {
      console.log(error)
      res.send(error)
    }else {
      res.render('classes/index', {'classes': classes})
    }
  }, 3)
})

router.get('/:id/details', function (req, res, next) {
  Class.getClassById([req.params.id], function (error, classname) {
    if (error) {
      console.log(error)
      res.send(error)
    } else {
      res.render('classes/details', {'class': classname})
    }
  })
})

router.get('/:id/lessons', function (req, res, next) {
  Class.getClassById([req.params.id], function (error, classname) {
    if (error) {
      console.log(error)
      res.send(error)
    } else {
      res.render('classes/lessons', {'class': classname})
    }
  })
})

router.get('/:id/lessons/:lesson_id', ensureAuthenticated, function (req, res, next) {
  Class.getClassById([req.params.id], function (error, classname) {
    let lesson
    if (error) {
      console.log(error)
      res.send(error)
    } else {
      for (let i = 0; i < classname.lessons.length; i++) {
        if (classname.lessons[i].lesson_number == req.params.lesson_id) {
          lesson = classname.lessons[i]
        }
      }
      res.render('classes/lesson', {'class': classname, 'lesson': lesson})
    }
  })
})

router.post('/:id/lessons/:lesson_id/delete', function (req, res, next) {
  Class.getClassById([req.params.id], function (error, classname) {
    if (error) throw error

    classname.lessons = classname.lessons.filter(lesson => {
      return lesson.number != req.params.lesson_id
    })
    res.redirect('/:id/lessons')
  })
})

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = router
