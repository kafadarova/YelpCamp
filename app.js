const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

// render the landing page from views landing template
app.get('/',(req,res) => {
  res.render('landing');
});

// camp ground route
app.get('/campgrounds', (req,res) => {
  let campgrounds = [
    {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}   
  ]
  // campgrounds (name - call wharever we want): campgrounds (data)
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.post('/campgrounds', (req,res) => {
  res.send('You hit the post route');
  // get data from form and add to campground array
  // redirect back to campgrounds page
});

// use port 3000 unless there exists a preconfigured port
const port = process.env.port || 3001;

app.listen(port,() => {
   console.log('The YelpCamp Server Has Started!');
});