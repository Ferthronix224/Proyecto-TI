const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  name: {type: String, required: true},
  lastName: {type: String, required: true},
  dateBirth: {type: String, required: true},
  address: {type: String, required: true},
  number: {type: String, required: true},
  generation: {type: String, required: true},
  average: {type: String, required: true},
  disability: {type: String, required: true},
  reports: {type: String, required: true},
  imagePath: {type: String, required: true}
})

module.exports = mongoose.model('Post', postSchema)
