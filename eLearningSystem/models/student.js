let mongoose = require('mongoose')

let studentSchema = mongoose.Schema({
  first_name: {type: String},
  last_name: {type: String},
  address: [{
    street_address: {type: String},
    city: {type: String},
    state: {type: String},
    zip: {type: String}
  }],
  username: {type: String},
  email: {type: String},
  classes: [{
    class_id: {type: [mongoose.Schema.Types.ObjectId]},
    class_title: {type: String}
  }]

})

let Student = module.exports = mongoose.model('Student', studentSchema)

module.exports.getStudentByUsername = function (username, callback) {
  let query = {username: username}

  Student.findOne(query, callback)
}

module.exports.register = function (info, callback) {
  let student_username = info['student_username']
  let nclass_id = info['class_id']
  let nclass_title = info['class_title']
 
  let query = {
    username: student_username
  }

  Student.findOneAndUpdate( 
    query,
    {$push: {'classes': {class_id: nclass_id, class_title: nclass_title}}},
    {safe: true, upsert: true, 'new': true},
    callback
  )
}
