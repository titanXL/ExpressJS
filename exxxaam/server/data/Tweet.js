const mongoose = require('mongoose')

let requiredValidationMessage = '{PATH} is required'

let tweetSchema = mongoose.Schema({
  message: {type: String, requiredValidationMessage, minlength: 0, maxlength: 140},
  authorId: {type: mongoose.Schema.Types.ObjectId},
  author: {type: String},
  date: {type: Date, default: Date.now()},
  tags: [String]
})

let Tweet = mongoose.model('Tweet', tweetSchema)
module.exports = Tweet
