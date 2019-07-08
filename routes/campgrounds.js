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
  let price = req.body.price;
  let image = req.body.image;
  let desc = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = {
    name: name,
    price: price,
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
router.get("/:slug", (req, res) => {
  //find the campground with provided ID
  Campground.findOne({
    slug: req.params.slug
  }).populate("comments").exec((err, foundCampground) => {
    if (err || !foundCampground) {
      req.flash("error", "Campground not found");
      res.redirect("back");
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
router.get('/:slug/edit', middleware.checkCampgroundOwnership, (req, res) => {
  // is user logged in 
  // if not, redirect
  Campground.findOne({
    slug: req.params.slug
  }, (err, foundCampground) => {
    res.render('campgrounds/edit', {
      campground: foundCampground
    });
  });
});

// update campground route
router.put("/:slug", middleware.checkCampgroundOwnership, function(req, res) {
  // find and update the correct campground
  Campground.findOne({
    slug: req.params.slug
  }, function(err, campground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      campground.name = req.body.campground.name;
      campground.description = req.body.campground.description;
      campground.image = req.body.campground.image;
      campground.save(function(err) {
        if (err) {
          console.log(err);
          res.redirect("/campgrounds");
        } else {
          res.redirect("/campgrounds/" + campground.slug);
        }
      });
    }
  });
});
// destroy campground route
router.delete('/:slug', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findOneAndRemove({
    slug: req.params.slug
  }, (err) => {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  })
});

// export router
module.exports = router;