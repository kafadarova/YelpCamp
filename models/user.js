const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});
User.plugin(passportLocalMongoose);
module.export = mongoose.model('User', UserSchema);