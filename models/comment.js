const mongoose = require('mongoose')
// schema setup
const commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

// make a model 
module.exports = mongoose.model('Comment', commentSchema);