var express = require('express')
var router = express.Router()
let fs = require('fs')
let path = require('path')

router.get('/', function (req, res, next) {
  res.render('create')
})

router.post('/', function (req, res, next) {
  req.checkBody('name', 'Name should not be empty!').notEmpty()
  req.checkBody('username', 'Name should not be empty!').notEmpty()
  req.checkBody('email', 'Email should not be empty!').notEmpty()

  let errors = req.validationErrors()

  if (errors) {
    res.render('index', {
      errors: errors
    })
  } else {
    let filepath = path.join(__dirname, '../public/users.txt')
    let wstream = fs.createWriteStream(filepath, {'flags': 'a'})
    let name = req.body.name
    let username = req.body.username
    let email = req.body.email
    let input = `\n Name: ${name} Username: ${username} Email: ${email} \n`
    wstream.write(input)
    wstream.end()
    res.render('create')
  }
})

module.exports = router
