const mongoose = require('mongoose')
// schema setup
const commentSchema = new mongoose.Schema({
  text: String,
  author: String
});

// make a model 
module.exports = mongoose.model('Comment', commentSchema);