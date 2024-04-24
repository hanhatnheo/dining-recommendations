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

  const sizeRestaurants = 9963;
  const seed = Math.floor(Math.random() * sizeRestaurants);

  connection.query(`
    SELECT *
    FROM Restaurants
    LIMIT 1 OFFSET ${seed}
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

// Route 2: GET /random_attraction
const random_attraction = async function(req, res) {

  const sizeAttractions = 46875;
  const seed = Math.floor(Math.random() * sizeAttractions);

  connection.query(`
    SELECT *
    FROM Attractions
    WHERE type = 'viewpoint' OR type = 'museum' OR type = 'park'
      OR type = 'theme_park' OR type = 'zoo' OR type = 'aquarium'
      OR type = 'art_gallery' OR type = 'gallery' OR type = 'artwork'
      OR type = 'attraction'
    LIMIT 1 OFFSET ${seed}

  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        name: data[0].name,
        longitude: data[0].longitude,
        latitude: data[0].latitude,
        website: data[0].website,
      });
    }
  });
}

// Route 3: GET /attractions
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

// Route 4: GET /restaurant_recommendations/:name
const restaurant_recommendations = async function(req, res) {
  const name = req.params.name;
  const distance = req.query.distance ?? 23;
  const rating = req.query.rating ?? 0;
  const drinkScore = req.query.drink_score ?? -25;
  const valueScore = req.query.value_score ?? -25;
  const foodScore = req.query.food_score ?? -25;
  const serviceScore = req.query.service_score ?? -25;
  const numRecs = req.query.num_recs ?? 20;
  
  connection.query(`
    SELECT R.name, R.stars, R.address, R.latitude, R.longitude
    FROM Attractions A JOIN Nearby N ON A.attraction_id = N.attraction_id
    JOIN Restaurants R ON N.business_id = R.business_id
    WHERE A.name = '${name}' AND R.stars >= '${rating}' AND 
    R.drink_score >= '${drinkScore}' AND R.value_score >= '${valueScore}' AND
    R.food_score >= '${foodScore}' AND R.service_score >= '${serviceScore}'
    AND distance <= '${distance}'
    ORDER BY distance
    LIMIT ${numRecs};
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

// Route 5: GET /all_restaurants
const all_restaurants = async function(req, res) {
  const name = req.query.name ?? '';
  const rating = req.query.rating ?? 0;
  const drinkScore = req.query.drink_score ?? -25;
  const valueScore = req.query.value_score ?? -25;
  const foodScore = req.query.food_score ?? -25;
  const serviceScore = req.query.service_score ?? -25;
  const category = req.query.category ?? '';
  const zipcode = req.query.zipcode ?? '';

  if (name === '') {
    if (category === '') {
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
          R.service_score >= '${serviceScore}' AND R.address LIKE '%${zipcode}';
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
          R.cat_2 LIKE '%${category}%' OR R.cat_3 LIKE '%${category}%') AND 
          R.address LIKE '%${zipcode}';
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
      WHERE R.name = '${name}' AND R.address LIKE '%${zipcode}';
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

// Route 6: GET /restaurant_info/:name
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

// Route 7: GET /attraction_info/:name
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

// Route 8: GET /most_popular_restaurants
const most_popular_restaurants = async function(req, res) {
  const zipcode = req.query.zipcode ?? '';

  connection.query(`
    WITH MostPopularRestaurants AS (
    SELECT RES.business_id, RES.name, RES.address, RES.stars, COUNT(*) AS review_count
    FROM Reviews REV JOIN Restaurants RES ON REV.business_id = RES.business_id AND RES.address LIKE '%${zipcode}'
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

// Route 9: GET /outstanding_restaurants
const outstanding_restaurants = async function(req, res) {
  const zipcode = req.query.zipcode ?? '';

  connection.query(`
    WITH CategoryAverages AS (
      SELECT business_id, name, cat_1, AVG(stars) AS avg_category1_rating
      FROM Restaurants
      GROUP BY cat_1
    )
    
    SELECT R.business_id, R.name, R.stars, R.cat_1
    FROM Restaurants R
    JOIN CategoryAverages CA ON R.cat_1 = CA.cat_1
    WHERE R.stars > CA.avg_category1_rating AND R.address LIKE '%${zipcode}'
    ORDER BY R.cat_1, R.stars DESC;  
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

// Route 10: GET /best_restaurants_per_category
const best_restaurants_per_category = async function(req, res) {
  const category = req.query.category ?? '';
  const type = req.query.type ?? '';
  const zipcode = req.query.zipcode ?? '';

  if (category === '') {
    if (type === '') {
      connection.query(`
        WITH RankedRestaurants AS (
          SELECT R.name,
                R.address,
                R.cat_1,
                AVG(Rev.stars) AS average_rating,
                ROW_NUMBER() OVER (PARTITION BY R.cat_1 ORDER BY AVG(Rev.stars) DESC) AS ranking
          FROM Restaurants R JOIN Reviews Rev ON R.business_id = Rev.business_id AND R.address LIKE '%${zipcode}'
          GROUP BY R.business_id
        )

        SELECT name, address, cat_1, average_rating
        FROM RankedRestaurants
        WHERE ranking <= 5;
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
        WITH RankedRestaurants AS (
          SELECT R.name,
                R.address,
                R.cat_1,
                AVG(Rev.stars) AS average_rating,
                ROW_NUMBER() OVER (PARTITION BY R.cat_1 ORDER BY AVG(Rev.stars) DESC) AS ranking
          FROM Restaurants R JOIN Reviews Rev ON R.business_id = Rev.business_id AND R.address LIKE '%${zipcode}'
          WHERE EXISTS (SELECT *
                        FROM Nearby N
                        JOIN Attractions A ON N.attraction_id = A.attraction_id
                        WHERE N.business_id = R.business_id AND A.type = '${type}' AND N.distance < 2.0)
          GROUP BY R.business_id
        )
    
        SELECT name, address, cat_1, average_rating
        FROM RankedRestaurants
        WHERE ranking <= 5;
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
    if (type === '') {
      connection.query(`
      WITH RankedRestaurants AS (
        SELECT R.name,
               R.address,
               R.cat_1,
               AVG(Rev.stars) AS average_rating,
               ROW_NUMBER() OVER (PARTITION BY R.cat_1 ORDER BY AVG(Rev.stars) DESC) AS ranking
        FROM Restaurants R JOIN Reviews Rev ON R.business_id = Rev.business_id AND R.address LIKE '%${zipcode}'
        GROUP BY R.business_id
      )

        SELECT name, address, cat_1, average_rating
        FROM RankedRestaurants
        WHERE ranking <= 5 AND cat_1 = '${category}';
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
      WITH RankedRestaurants AS (
        SELECT R.name,
              R.address,
              R.cat_1,
              AVG(Rev.stars) AS average_rating,
              ROW_NUMBER() OVER (PARTITION BY R.cat_1 ORDER BY AVG(Rev.stars) DESC) AS ranking
        FROM Restaurants R
        JOIN Reviews Rev ON R.business_id = Rev.business_id AND R.address LIKE '%${zipcode}'
        WHERE EXISTS (SELECT *
                      FROM Nearby N
                      JOIN Attractions A ON N.attraction_id = A.attraction_id
                      WHERE N.business_id = R.business_id AND A.type = '${type}' AND N.distance < 2.0)
        GROUP BY R.business_id
      )

      SELECT name, address, cat_1, average_rating
      FROM RankedRestaurants
      WHERE ranking <= 5 AND cat_1 = '${category}';
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
}

// Route 11: GET /recommended_restaurants
const recommended_restaurants = async function(req, res) {
  const zipcode = req.query.zipcode ?? '';

  connection.query(`
    SELECT *
    FROM Restaurants RES
    WHERE NOT EXISTS (
        SELECT REV.business_id
        FROM Reviews REV
        WHERE RES.business_id = REV.business_id AND RES.stars < 4
    )
    AND (
        SELECT COUNT(DISTINCT AT.attraction_id)
        FROM Nearby N
        JOIN Attractions AT ON N.attraction_id = AT.attraction_id
        WHERE N.business_id = RES.business_id
    ) > 1 AND RES.address LIKE '%${zipcode}'
    GROUP BY RES.business_id;
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

// Route 12: GET /zipcode_ranking
const zipcode_ranking = async function(req, res) {
  connection.query(`
    WITH RestaurantRatings AS (
      SELECT
          R.business_id,
          RIGHT(R.address, 5) AS ZipCode,
          AVG(Rev.stars) AS AverageRating,
          COUNT(Rev.review_id) AS TotalReviews
      FROM Restaurants R
      JOIN Reviews Rev ON R.business_id = Rev.business_id
      GROUP BY R.business_id
    ),
    ZipCodeMetrics AS (
        SELECT
            RR.ZipCode,
            COUNT(RR.business_id) AS NumberOfRestaurants,
            AVG(RR.AverageRating) AS ZipCodeAverageRating,
            SUM(RR.TotalReviews) AS ZipCodeTotalReviews
        FROM RestaurantRatings RR
        GROUP BY RR.ZipCode
    ),
    NearbyMuseums AS (
        SELECT DISTINCT
            RIGHT(R.address, 5) AS ZipCode
        FROM Restaurants R
        JOIN Nearby N ON R.business_id = N.business_id
        JOIN Attractions A ON N.attraction_id = A.attraction_id
        WHERE A.type = 'Museum'
    ),
    RankedZipCodes AS (
        SELECT
            ZM.ZipCode,
            ZM.NumberOfRestaurants,
            ZM.ZipCodeAverageRating,
            ZM.ZipCodeTotalReviews,
            RANK() OVER (ORDER BY ZM.ZipCodeAverageRating DESC, ZM.NumberOfRestaurants DESC, ZM.ZipCodeTotalReviews DESC) AS ZipCodeRank
        FROM ZipCodeMetrics ZM
        JOIN NearbyMuseums NM ON ZM.ZipCode = NM.ZipCode
        WHERE ZM.NumberOfRestaurants > 5 AND ZM.ZipCodeAverageRating > 4.0 AND ZM.ZipCodeTotalReviews > 100
    )
    SELECT
        RZ.ZipCode,
        RZ.NumberOfRestaurants,
        RZ.ZipCodeAverageRating,
        RZ.ZipCodeTotalReviews,
        RZ.ZipCodeRank
    FROM RankedZipCodes RZ
    ORDER BY RZ.ZipCodeRank;
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

// Route 13: GET /attractions/current
const attractions_within_bounds = async function(req, res) {
  const type = req.query.type ?? '';
  const minLat = req.query.minLat;
  const minLng = req.query.minLng;
  const maxLat = req.query.maxLat;
  const maxLng = req.query.maxLng;

  if (!minLat || !minLng || !maxLat || !maxLng) {
    return res.status(400).json({ error: "Missing latitude or longitude parameters" });
  }

  let baseQuery = `
    SELECT name, type, latitude, longitude
    FROM Attractions
    WHERE latitude BETWEEN ? AND ? AND longitude BETWEEN ? AND ?
  `;

  let queryParams = [minLat, maxLat, minLng, maxLng];

  if (type !== '') {
    baseQuery += ` AND type = ?`;
    queryParams.push(type);
  } else {
    baseQuery += ` AND (type = 'viewpoint' OR type = 'museum' OR type = 'park'
                         OR type = 'theme_park' OR type = 'zoo' OR type = 'aquarium'
                         OR type = 'art_gallery' OR type = 'gallery' OR type = 'artwork'
                         OR type = 'attraction')`;
  }

  connection.query(baseQuery, queryParams, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database query failed" });
    }
    if (data.length === 0) {
      return res.json([]); 
    }
    res.json(data);
  });
}

// Route 14: GET /all_restaurants/current
const restaurants_within_bounds = async function(req, res) {
  const name = req.query.name ?? '';
  const rating = req.query.rating ?? 0;
  const drinkScore = req.query.drink_score ?? -25;
  const valueScore = req.query.value_score ?? -25;
  const foodScore = req.query.food_score ?? -25;
  const serviceScore = req.query.service_score ?? -25;
  const category = req.query.category ?? '';
  const zipcode = req.query.zipcode ?? '';
  const minLat = req.query.minLat;
  const minLng = req.query.minLng;
  const maxLat = req.query.maxLat;
  const maxLng = req.query.maxLng;

  if (name === '') {
    if (category === '') {
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
          R.service_score >= '${serviceScore}' AND R.address LIKE '%${zipcode}'
          AND R.latitude BETWEEN '${minLat}' AND '${maxLat}' AND R.longitude BETWEEN '${minLng}' AND '${maxLng}';
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
          R.cat_2 LIKE '%${category}%' OR R.cat_3 LIKE '%${category}%') AND 
          R.address LIKE '%${zipcode}' AND R.latitude BETWEEN '${minLat}' AND '${maxLat}' AND R.longitude BETWEEN '${minLng}' AND '${maxLng}'
          ;
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
      WHERE R.name = '${name}' AND R.address LIKE '%${zipcode}' AND R.latitude BETWEEN '${minLat}' AND '${maxLat}' AND R.longitude BETWEEN '${minLng}' AND '${maxLng}';
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

module.exports = {
  random_restaurant,
  random_attraction,
  attractions,
  restaurant_recommendations,
  all_restaurants,
  restaurant_info,
  attraction_info,
  most_popular_restaurants,
  outstanding_restaurants,
  best_restaurants_per_category,
  recommended_restaurants,
  zipcode_ranking,
  attractions_within_bounds,
  restaurants_within_bounds
}
