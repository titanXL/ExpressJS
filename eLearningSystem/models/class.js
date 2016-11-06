let mongoose = require('mongoose')

let classSchema = mongoose.Schema({
  title: {type: String},
  description: {type: String},
  instructor: {type: String},
  lessons: [{
    lesson_number: {type: Number},
    lesson_title: {type: String},
    lesson_body: {type: String}
  }]
})

let Class = module.exports = mongoose.model('Class', classSchema)

module.exports.getClasses = function (callback, limit) {
  Class.find(callback).limit(limit)
}

module.exports.getClassById = function (id, callback) {
  Class.findById(id, callback)
}

module.exports.addLesson = function (info, callback) {
  let class_id = info['class_id']
  let nlesson_number = info['lesson_number']
  let nlesson_title = info['lesson_title']
  let nlesson_body = info['lesson_body']

  Class.findByIdAndUpdate(
    class_id,
    {
      $push: {'lessons': {lesson_number: nlesson_number, lesson_title: nlesson_title, lesson_body: nlesson_body}}
    },
    {
      save: true, upsert: true
    },
    callback
  )
}
module.exports.removeLesson = function (info, callback) {
  let class_id = info['class_id']
  let nlesson_number = info['lesson_number']
  Class.findByIdAndRemove()
}
