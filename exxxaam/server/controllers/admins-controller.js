let encryption = require('../utilities/encryption')

let User = require('mongoose').model('User')
module.exports = {
  all: (req, res) => {
    User.find({}).then(users => {
      res.render('admins/all', {users: users})
    })
  },
  add: (req, res) => {
    res.render('admins/add')
  },
  create: (req, res) => {
    let user = req.body
    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, user.password)

    User.create({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      salt: salt,
      hashedPass: hashedPass,
      roles: ['Admin']
    }).then(user => {
      res.redirect('/')
    })
  }


}
