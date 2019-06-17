const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user')
  seedDB = require('./seeds');

// require routes
const commentRoutes = require('./routes/comments'),
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes = require('./routes/index');
       
// connect mongoose
mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// remove all campgrounds from the db and add new one
// seedDB(); //sedd the db

// Passport configuration
app.use(require('express-session')({
  secret: "Once again Jerry wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for every single route
app.use((req,res, next) => {
  // what is available inside the template
    res.locals.currentUser = req.user;
    next();
});

// using the following routes
app.use("/",indexRoutes);
// all routes that start with campgrounds ..
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// use port 3000 unless there exists a preconfigured port
const port = process.env.port || 3001;

app.listen(port, () => {
  console.log('The YelpCamp Server Has Started!');
});