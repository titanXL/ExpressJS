let Tweet = require('mongoose').model('Tweet')

module.exports = {
  index: (req, res) => {
    Tweet.find({}).sort({date: 'desc'}).limit(100).then(tweets => {

      res.render('home/index', {tweets: tweets, count: tweets.length})
    })
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
