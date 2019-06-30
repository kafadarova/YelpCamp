const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// INDEX campground route - show all campground
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
  // get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = {
    name: name,
    image: image,
    description: desc,
    author: author
  };
  // campgrounds.push(newCampground);
  // Create a new campground and save to DB
  Campground.create(newCampground, middleware.isLoggedIn, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect('campgrounds');
    }
  });
});

// NEW route - show the form that will send data to the post campgrounds
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if (err) {
      console.log(err)
    } else {
      // console.log(foundCampground);
      //render show template with that campground
      res.render("campgrounds/show", {
        campground: foundCampground
      });
    }
  });
});

// edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  // is user logged in 
  // if not, redirect
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', {
      campground: foundCampground
    });
  });
});

// update campground route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  // find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
  // redirect somewhere (show page)
});

// destroy campground route
router.delete('/:id', middleware. checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  })
});

// export router
module.exports = router;