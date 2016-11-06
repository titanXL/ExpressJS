const controllers = require('../controllers')
const auth = require('../config/auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)

  app.get('/users/register', controllers.users.register)
  app.post('/users/create', controllers.users.create)
  app.get('/users/login', controllers.users.login)
  app.post('/users/authenticate', controllers.users.authenticate)
  app.post('/users/logout', controllers.users.logout)

  app.get('/profile/:username', auth.isAuthenticated, controllers.tweets.showtweets)
  app.get('/tweet', auth.isAuthenticated, controllers.tweets.tweet)
  app.post('/tweet', auth.isAuthenticated, controllers.tweets.addtweet)
  app.get('/tag/:tagname', auth.isAuthenticated, controllers.tweets.tags)

  app.get('/admins/all', auth.isInRole('Admin'), controllers.admins.all)
  app.get('/admins/add', auth.isInRole('Admin'), controllers.admins.add)
  app.post('/admins/add', auth.isInRole('Admin'), controllers.admins.create)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('Not Found')
    res.end()
  })
}
