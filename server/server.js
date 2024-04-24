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
app.get('/random_attraction', routes.random_attraction);
app.get('/attractions', routes.attractions);
app.get('/restaurant_recommendations/:name', routes.restaurant_recommendations);
app.get('/all_restaurants', routes.all_restaurants);
app.get('/restaurant_info/:name', routes.restaurant_info);
app.get('/attraction_info/:name', routes.attraction_info);
app.get('/most_popular_restaurants', routes.most_popular_restaurants);
app.get('/outstanding_restaurants', routes.outstanding_restaurants);
app.get('/best_restaurants_per_category', routes.best_restaurants_per_category);
app.get('/recommended_restaurants', routes.recommended_restaurants);
app.get('/zipcode_ranking', routes.zipcode_ranking);
app.get('/attractions/current', routes.attractions_within_bounds);
app.get('/all_restaurants/current', routes.restaurants_within_bounds);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
