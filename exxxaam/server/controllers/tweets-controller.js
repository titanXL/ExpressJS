let Tweet = require('mongoose').model('Tweet')
let User = require('mongoose').model('User')
module.exports = {
  tags: (req, res) => {
    let tag = req.params.tagname
    Tweet.find({tags: tag}).sort({date: 'desc'}).limit(100).then(tweets => {
      res.render('tweet/tag', {tweets: tweets})
    })
  },
  deletetweet: (req, res) => {
  },
  showtweets: (req, res) => {
    let username = req.params.username
    Tweet.find({author: username}).sort({date: 'desc'}).limit(100).then(tweets => {
      console.log(tweets)
      res.render('users/tweets', {tweets: tweets})
    })
  },
  addtweet: (req, res) => {
    let tweet = {}
    tweet.message = req.body.textarea
    let textarr = tweet.message.split(/[\s,.!?]/g)
    textarr = textarr.filter(x => x)
    let tags = []
    let handles = []
    textarr.forEach(word => {
      if (word[0] == '#') {
        tags.push(word.slice(1, word.length))
      }
    })
    textarr.forEach(word => {
      if (word[0] == '@') {
        handles.push(word.slice(1, word.length))
      }
    })

    tweet.tags = tags
    tweet.authorId = res.locals.currentUser._id
    tweet.date = new Date()
    tweet.author = res.locals.currentUser.username
    console.log(tweet)
    Tweet.create(tweet).then(tweet => {
      if (handles.length > 0) {
        handles.forEach(user => {
          User.findOneAndUpdate({username: user},
            {$push: {'tweets': tweet}},
            {safe: true, upsert: true, 'new': true}).then(user => console.log(user)
          )
        })
      }
      res.locals.currentUser.tweets.push(tweet._id)
      res.locals.currentUser.save(err => {
        if (err) throw err
      })
      res.redirect('/')
    })
  },
  tweet: (req, res) => {
    res.render('tweet/tweet')
  }
}
