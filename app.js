const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose');

// connect mongoose
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

// schema setup
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

// make a model 
const Campground = mongoose.model('Campground', campgroundSchema);

let campgrounds = [
  {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
  {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},   
  {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
  {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
  {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}   

]

// render the landing page from views landing template
app.get('/',(req,res) => {
  res.render('landing');
});

// camp ground route
app.get('/campgrounds', (req,res) => {
  // campgrounds (name - call wharever we want): campgrounds (data)
  res.render('campgrounds', {campgrounds: campgrounds});
});

// show the form that will send data to the post campgrounds
app.get('/campgrounds/new', (req,res) => {
  res.render('new.ejs');
});

app.post('/campgrounds', (req,res) => {
  // get data from form and add to campground array
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = {name: name, image: image};
  campgrounds.push(newCampground);
  // redirect back to campgrounds page
  res.redirect('campgrounds');
});

// use port 3000 unless there exists a preconfigured port
const port = process.env.port || 3001;

app.listen(port,() => {
   console.log('The YelpCamp Server Has Started!');
});