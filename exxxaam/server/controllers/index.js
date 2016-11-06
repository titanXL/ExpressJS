let homeController = require('./home-controller')
let usersController = require('./users-controller')
let tweetsController = require('./tweets-controller')
let adminsController = require('./admins-controller')
module.exports = {
  home: homeController,
  users: usersController,
  tweets: tweetsController,
  admins: adminsController
}
