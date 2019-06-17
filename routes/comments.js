const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Comments New
router.get('/new', isLoggedIn,  (req, res) => {
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

// Comments Create
router.post('/',isLoggedIn, (req,res) => {
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
          // add username and id to comment
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

// middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// export router
module.exports = router;