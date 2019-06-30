const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');


// Comments New
router.get('/new', middleware.isLoggedIn,  (req, res) => {
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
router.post('/',middleware.isLoggedIn, (req,res) => {
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
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // connect new comment to campground
          campground.comments.push(comment);
          campground.save();
          // console.log(comment);
          // redirect to campground showpage
          res.redirect('/campgrounds/' + campground._id);
        }
      })
    }
  });
});

// Edit comment route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req,res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render('comments/edit', {
        campground_id: req.params.id,
        comment: foundComment
      });
    }
  })
});

// Update comment route
router.put('/:comment_id', middleware.checkCommentOwnership, (req,res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      // send the user back
      res.redirect("back");
    } else {
      // send the user to the show page
      res.redirect('/campgrounds/' + req.params.id);
    }
  })
});

// Comment Destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req,res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
     res.redirect("back");
    } else {
     res.redirect('/campgrounds/' + req.params.id);
    }
  })
});

// export router
module.exports = router;