const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose');

// connect mongoose
mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

// schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

// make a model 
const Campground = mongoose.model('Campground', campgroundSchema);
// Campground.create(
//   {
//     name: "Granite Hill", 
//     image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"
//   }, function(err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('newly created campground');
//       console.log(campground);
//     }
//   });

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
        res.render('campgrounds', {campgrounds: allCampgrounds});
      }
    })
});

// NEW route - show the form that will send data to the post campgrounds
app.get('/campgrounds/new', (req,res) => {
  res.render('new.ejs');
});

// CREATE route- add new campground
app.post('/campgrounds', (req,res) => {
  // get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image};
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

// use port 3000 unless there exists a preconfigured port
const port = process.env.port || 3001;

app.listen(port,() => {
   console.log('The YelpCamp Server Has Started!');
});