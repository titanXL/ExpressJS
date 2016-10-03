var express = require('express')
var router = express.Router()
let nodemailer = require('nodemailer')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('contact', { title: 'Contact' })
})

router.post('/send', (req, res, next) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'emildavidkov88@gmail.com',
      pass: '123'
    }
  })

  let mailOptions = {
    from: 'John Doe <johndoe@outlook.com>',
    to: 'emildavidkov88@gmail.com',
    subject: 'Website Submition',
    text: 'You have a new submition with the following details: Name:' + req.body.name + ' Email: ' + req.body.email + ' Message: ' + req.body.message,
    html: '<p> You got a new submition with the following details</p><ul><li>' + req.body.name + '</li><li>' + req.body.email + '</li><li>' + req.body.message + '</li></ul>'
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
      res.redirect('/')
    } else {
      console.log('Message Send:' + info.response)
      res.redirect('/')
    }
  })
})
module.exports = router
