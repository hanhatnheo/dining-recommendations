const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /random_restaurant
const random_restaurant = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is false
  // const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Restaurants
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // If there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
      // return type you may need to return an empty array [] instead.
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      res.json({
        name: data[0].name,
        rating: data[0].stars,
      });
    }
  });
}

// Route 2: GET /attractions
const attractions = async function(req, res) {
  const type = req.query.type ?? '';

  if (type === '') {
    connection.query(`
      SELECT *
      FROM Attractions
      WHERE type = 'viewpoint' OR type = 'museum' OR type = 'park'
      OR type = 'theme_park' OR type = 'zoo' OR type = 'aquarium'
      OR type = 'art_gallery' OR type = 'gallery' OR type = 'artwork'
      OR type = 'attraction'
      `
      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`
      SELECT name, type, latitude, longitude
      FROM Attractions
      WHERE type = '${type}'
      `
      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 3: GET /restaurant_recommendations/:name
const restaurant_recommendations = async function(req, res) {
  const name = req.params.name;
  const distance = req.query.distance ?? 23;
  const rating = req.query.rating ?? 0;
  const drinkScore = req.query.drink_score ?? -25;
  const valueScore = req.query.value_score ?? -25;
  const foodScore = req.query.food_score ?? -25;
  const serviceScore = req.query.service_score ?? -25;
  
  connection.query(`
    SELECT R.name, R.stars, R.address, R.latitude, R.longitude
    FROM Attractions A JOIN Nearby N ON A.attraction_id = N.attraction_id
    JOIN Restaurants R ON N.business_id = R.business_id
    WHERE A.name = '${name}' AND R.stars >= '${rating}' AND 
    R.drink_score >= '${drinkScore}' AND R.value_score >= '${valueScore}' AND
    R.food_score >= '${foodScore}' AND R.service_score >= '${serviceScore}'
    AND distance <= '${distance}'
    ORDER BY distance
    LIMIT 20;
    `
    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 4: GET /all_restaurants
const all_restaurants = async function(req, res) {
  const name = req.query.name ?? '';
  const rating = req.query.rating ?? 0;
  const drinkScore = req.query.drink_score ?? -25;
  const valueScore = req.query.value_score ?? -25;
  const foodScore = req.query.food_score ?? -25;
  const serviceScore = req.query.service_score ?? -25;
  const category = req.query.category ?? 'NONE';

  if (name === '') {
    if (category === 'NONE') {
      connection.query(`
        WITH ReviewsWithTheirRestaurants AS (
        SELECT RES.business_id, REV.stars, REV.text
        FROM Restaurants RES
        JOIN Reviews REV ON RES.business_id = REV.business_id)
        
        SELECT R.business_id, R.name, R.address, R.latitude, R.longitude, R.stars,
              (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars >= 4
              LIMIT 1) as high_rating_review_text,
              (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars >= 2
                AND stars <= 3
              LIMIT 1) as mid_rating_review_text,
              (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars <= 1
              LIMIT 1) as mid_rating_review_text
        FROM Restaurants R
        WHERE R.stars >= '${rating}' AND R.drink_score >= '${drinkScore}' AND 
          R.value_score >= '${valueScore}' AND R.food_score >= '${foodScore}' AND 
          R.service_score >= '${serviceScore}';
        `
        , (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
          }
        });
      } else {
        connection.query(`
        WITH ReviewsWithTheirRestaurants AS (
        SELECT RES.business_id, REV.stars, REV.text
        FROM Restaurants RES
        JOIN Reviews REV ON RES.business_id = REV.business_id)
        
        SELECT R.business_id, R.name, R.address, R.latitude, R.longitude, R.stars,
              (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars >= 4
              LIMIT 1) as high_rating_review_text,
              (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars >= 2
                AND stars <= 3
              LIMIT 1) as mid_rating_review_text,
              (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars <= 1
              LIMIT 1) as mid_rating_review_text
        FROM Restaurants R
        WHERE R.stars >= '${rating}' AND R.drink_score >= '${drinkScore}' AND 
          R.value_score >= '${valueScore}' AND R.food_score >= '${foodScore}' AND 
          R.service_score >= '${serviceScore}' AND (R.cat_1 LIKE '%${category}%' OR 
          R.cat_2 LIKE '%${category}%' OR R.cat_3 LIKE '%${category}%');
        `
        , (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
          }
        });
      }
  } else {
    connection.query(`
      WITH ReviewsWithTheirRestaurants AS (
      SELECT RES.business_id, REV.stars, REV.text
      FROM Restaurants RES
      JOIN Reviews REV ON RES.business_id = REV.business_id)
    
      SELECT R.business_id, R.name, R.address, R.latitude, R.longitude, R.stars,
            (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars >= 4
              LIMIT 1) as high_rating_review_text,
              (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars >= 2
                AND stars <= 3
              LIMIT 1) as mid_rating_review_text,
              (SELECT RWR.text
              FROM ReviewsWithTheirRestaurants RWR
              WHERE R.business_id = RWR.business_id
                AND stars <= 1
              LIMIT 1) as mid_rating_review_text
      FROM Restaurants R
      WHERE R.name = '${name}';
      `
      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }
}

// Route 5: GET /restaurant_info/:name
const restaurant_info = async function(req, res) {
  const name = req.params.name;

  connection.query(`
    SELECT *
    FROM Restaurants RES JOIN Reviews REV ON RES.business_id = REV.business_id
    WHERE RES.name = '${name}'
    LIMIT 100;
    `
    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /attraction_info/:name
const attraction_info = async function(req, res) {
  const name = req.params.name;

  connection.query(`
    SELECT *
    FROM Attractions
    WHERE name = '${name}';
    `
    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// Route 7: GET /most_popular_restaurants
const most_popular_restaurants = async function(req, res) {
  connection.query(`
    WITH MostPopularRestaurants AS (
    SELECT RES.business_id, RES.name, RES.address, RES.stars, COUNT(*) AS review_count
    FROM Reviews REV JOIN Restaurants RES ON REV.business_id = RES.business_id
    GROUP BY RES.business_id
    ORDER BY review_count DESC
    LIMIT 100
    )

    SELECT MPR.business_id, MPR.name, MPR.address, MPR.stars, MPR.review_count,
        (SELECT R.text
        FROM MostPopularRestaurants MPR
        WHERE MPR.business_id = R.business_id AND R.stars >= 4
        LIMIT 1) as high_rating_review_text,
        (SELECT R.text
        FROM MostPopularRestaurants MPR
        WHERE MPR.business_id = R.business_id AND R.stars >= 2 AND R.stars <= 3
        LIMIT 1) as mid_rating_review_text,
        (SELECT R.text
        FROM MostPopularRestaurants MPR
        WHERE MPR.business_id = R.business_id AND R.stars <= 1
        LIMIT 1) as low_rating_review_text
    FROM Reviews R JOIN MostPopularRestaurants MPR ON MPR.business_id = R.business_id
    GROUP BY R.business_id;
    `
    , (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  random_restaurant,
  attractions,
  restaurant_recommendations,
  all_restaurants,
  restaurant_info,
  attraction_info,
  most_popular_restaurants,
}
