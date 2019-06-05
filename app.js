const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      Campground = require('./models/campground'),
      seedDB     = require('./seeds');

// connect mongoose
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

// remove all campgrounds from the db
seedDB();

// render the landing page from views landing template
app.get('/',(req,res) => {
  res.render('landing');
});

// INDEX campground route - showw all camp ground
app.get('/campgrounds', (req,res) => {
  //  Get alll campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
      if (err) {
        console.log(err);
      } else {
        // campgrounds (name - call wharever we want): campgrounds (data)
        res.render('index', {campgrounds: allCampgrounds});
      }
    })
});
// CREATE route- add new campground
app.post('/campgrounds', (req,res) => {
  // get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {name: name, image: image, description: desc};
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
app.get('/campgrounds/new', (req,res) => {
  res.render('new.ejs');
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err)
        }else{
          console.log(foundCampground);
            //render show template with that campground
             res.render("show",{campground: foundCampground}); 
        }
    });
});

// use port 3000 unless there exists a preconfigured port
const port = process.env.port || 3001;

app.listen(port,() => {
   console.log('The YelpCamp Server Has Started!');
});