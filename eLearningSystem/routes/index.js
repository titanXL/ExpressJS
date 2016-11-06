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
      res.render('index', {'classes': classes})
    }
  }, 3)
})

module.exports = router
