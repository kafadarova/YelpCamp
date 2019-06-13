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

// connect mongoose
mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
// remove all campgrounds from the db
seedDB();

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


// render the landing page from views landing template
app.get('/', (req, res) => {
  res.render('landing');
});

// INDEX campground route - showw all camp ground
app.get('/campgrounds', (req, res) => {
  //  Get alll campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      // campgrounds (name - call wharever we want): campgrounds (data)
      res.render('campgrounds/index', {
        campgrounds: allCampgrounds
      });
    }
  })
});
// CREATE route- add new campground
app.post('/campgrounds', (req, res) => {
  // get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {
    name: name,
    image: image,
    description: desc
  };
  // campgrounds.push(newCampground);
  // Create a new campground and save to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect('campgrounds');
    }
  });
});

// NEW route - show the form that will send data to the post campgrounds
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err)
    } else {
      console.log(foundCampground);
      //render show template with that campground
      res.render("campgrounds/show", {
        campground: foundCampground
      });
    }
  });
});

// ========
// Comments routers
// ========

app.get('/campgrounds/:id/comments/new', (req, res) => {
  // find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {
        campground: campground
      })
    }
  })
});

app.post('/campgrounds/:id/comments', (req,res) => {
  // loookup campground using Id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    } else {
      // create new comment 
      Comment.create(req.body.comment,(err, comment) => {
        if (err) {
          console.log(err);
        } else {
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // redirect to campground showpage
          res.redirect('/campgrounds/' + campground._id);
        }
      })
    }
  });
});

// ============
// AUTH ROUTES
// ============

// show register form
app.get('/register', (req,res) => {
  res.render('register');
})

// handle sign up logic
app.post('/register', (req,res) => {
  const newUser = new User({username : req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req,res, () => {
      res.redirect('/campgrounds');
    });
  })
});

// show login form
app.get('/login', (req,res) => {
  res.render('login');
})

// handling login logic
app.post('/login', passport.authenticate('local', 
    {
      successRedirect: '/campgrounds',  
      failureRedirect: '/login'
    }), (req,res) => {
      
});

// use port 3000 unless there exists a preconfigured port
const port = process.env.port || 3001;

app.listen(port, () => {
  console.log('The YelpCamp Server Has Started!');
});