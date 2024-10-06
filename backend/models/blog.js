const mongoose = require('mongoose')

const schema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // add list of users that liked the blog
  // for like button functionality
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})


schema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
    }
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', schema)

module.exports = Blog