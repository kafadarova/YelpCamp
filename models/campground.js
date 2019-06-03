const mongoose = require('mongoose')

// schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// make a model 
module.exports = mongoose.model('Campground', campgroundSchema);