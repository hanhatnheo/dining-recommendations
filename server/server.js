const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/random_restaurant', routes.random_restaurant);
app.get('/attractions', routes.attractions);
app.get('/restaurant_recommendations/:name', routes.restaurant_recommendations);
app.get('/all_restaurants', routes.all_restaurants);
app.get('/restaurant_info/:name', routes.restaurant_info);
app.get('/attraction_info/:name', routes.attraction_info);
app.get('/most_popular_restaurants', routes.most_popular_restaurants);
app.get('/outstanding_restaurants', routes.outstanding_restaurants);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
