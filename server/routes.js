const mysql = require('mysql')
const config = require('./config.json');
const e = require('express');

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
  connection.query(`
    SELECT name, stars AS rating, address
    FROM Restaurants R
    WHERE R.latitude BETWEEN -100 AND 100 AND R.longitude BETWEEN -100 AND 100 
    LIMIT 1 OFFSET 52;
  `, (err, data) => {
    if (err || data.length === 0) {
      // If there is an error for some reason, or if the query is empty
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      res.json({
        name: data[0].name,
        rating: data[0].rating,
        address: data[0].address
      });
    }
  });
}

// Route 2: GET /random_attraction
const random_attraction = async function(req, res) {
  connection.query(`
    SELECT *
    FROM Attractions A
    WHERE (type = 'viewpoint' OR type = 'museum' OR type = 'park'
    OR type = 'theme_park' OR type = 'zoo' OR type = 'aquarium'
    OR type = 'art_gallery' OR type = 'gallery' OR type = 'artwork'
    OR type = 'attraction') 
    AND A.latitude BETWEEN -100 AND 100 AND A.longitude BETWEEN -100 AND 100 
    LIMIT 1 OFFSET 1;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        name: data[0].name,
        type: data[0].type,
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
  const zipCode = req.query.zip_code ?? '';

  if (type === '') {
    if (zipCode === '') {
      connection.query(`
        SELECT attraction_id, name, type, latitude, longitude, website, zip_code
        FROM Attractions
        WHERE (type = 'viewpoint' OR type = 'museum' OR type = 'park'
        OR type = 'theme_park' OR type = 'zoo' OR type = 'aquarium'
        OR type = 'art_gallery' OR type = 'gallery' OR type = 'artwork'
        OR type = 'attraction')
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
        SELECT attraction_id, name, type, latitude, longitude, website, zip_code
        FROM Attractions
        WHERE zip_code = '${zipCode}' AND (type = 'viewpoint' OR type = 'museum' OR type = 'park'
        OR type = 'theme_park' OR type = 'zoo' OR type = 'aquarium'
        OR type = 'art_gallery' OR type = 'gallery' OR type = 'artwork'
        OR type = 'attraction')
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
    if (zipcode === '') {
      connection.query(`
        SELECT attraction_id, name, type, latitude, longitude, website, zip_code
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
    } else {
      connection.query(`
        SELECT attraction_id, name, type, latitude, longitude, website, zip_code
        FROM Attractions
        WHERE zip_code = '${zipCode}' AND type = '${type}'
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

// Route 4: GET /restaurant_recommendations/id
const restaurant_recommendations = async function(req, res) {
  const id = req.query.id;
  const distance = req.query.distance ?? 23;
  const rating = req.query.rating ?? 0;
  const drinkScore = req.query.drink_score ?? -25;
  const valueScore = req.query.value_score ?? -25;
  const foodScore = req.query.food_score ?? -25;
  const serviceScore = req.query.service_score ?? -25;
  const numRecs = 5;
  
  connection.query(`
    SELECT R.name, R.stars, R.address, R.latitude, R.longitude, N.attraction_id
    FROM Nearby N JOIN Restaurants R ON N.business_id = R.business_id
    WHERE N.attraction_id = '${id}' AND R.stars >= '${rating}' AND 
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
  const zipcode = req.query.zip_code ?? '';

  if (name === '') {
    if (category === '') {
      if (zipcode === '') {
        connection.query(`
          WITH ReviewsWithTheirRestaurants AS (
          SELECT RES.business_id, REV.stars, REV.text
          FROM Restaurants RES
          JOIN Reviews REV ON RES.business_id = REV.business_id)
          SELECT R.business_id, R.name, R.address, R.latitude, R.longitude, R.stars,
            (SELECT RWR.text
            FROM ReviewsWithTheirRestaurants RWR WHERE R.business_id = RWR.business_id
            AND stars >= 4
            LIMIT 1) as high_rating_review_text, (SELECT RWR.text
            FROM ReviewsWithTheirRestaurants RWR WHERE R.business_id = RWR.business_id
            AND stars >= 2
            AND stars <= 3
            LIMIT 1) as mid_rating_review_text, (SELECT RWR.text
            FROM ReviewsWithTheirRestaurants RWR WHERE R.business_id = RWR.business_id
            AND stars <= 1
            LIMIT 1) as low_rating_review_text
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
                LIMIT 1) as low_rating_review_text
          FROM Restaurants R
          WHERE R.stars >= '${rating}' AND R.drink_score >= '${drinkScore}' AND 
            R.value_score >= '${valueScore}' AND R.food_score >= '${foodScore}' AND 
            R.service_score >= '${serviceScore}' AND R.zip_code = '${zipcode}';
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
        if (zipcode === '') {
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
                LIMIT 1) as low_rating_review_text
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
                LIMIT 1) as low_rating_review_text
          FROM Restaurants R
          WHERE R.stars >= '${rating}' AND R.drink_score >= '${drinkScore}' AND 
            R.value_score >= '${valueScore}' AND R.food_score >= '${foodScore}' AND 
            R.service_score >= '${serviceScore}' AND (R.cat_1 LIKE '%${category}%' OR 
            R.cat_2 LIKE '%${category}%' OR R.cat_3 LIKE '%${category}%') AND 
            R.zip_code = '${zipcode}';
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
    } else {
      if (zipcode === '') {
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
                  LIMIT 1) as low_rating_review_text
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
                LIMIT 1) as low_rating_review_text
        FROM Restaurants R
        WHERE R.name = '${name}' AND R.zip_code = '${zipcode}'';
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

// Route 6: GET /restaurant_info/id
const restaurant_info = async function(req, res) {
  const id = req.query.id;

  connection.query(`
    SELECT *
    FROM Restaurants RES JOIN Reviews REV ON RES.business_id = REV.business_id
    WHERE RES.business_id = '${id}'
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

// Route 7: GET /attraction_info/id
const attraction_info = async function(req, res) {
  const id = req.query.id;

  connection.query(`
    SELECT *
    FROM Attractions
    WHERE attraction_id = '${id}';
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
  const zipcode = req.query.zip_code;

  if (zipcode) {
    connection.query(`
      WITH MostPopularRestaurants AS (
      SELECT RES.business_id, RES.name, RES.address, RES.stars, RES.review_count 
      FROM Restaurants RES
      WHERE RES.zip_code = '${zipcode}'
      GROUP BY RES.business_id
      ORDER BY RES.review_count DESC
      LIMIT 100
      )
      SELECT MPR.business_id, MPR.name, MPR.address, MPR.stars, MPR.review_count, (SELECT R.text
      FROM MostPopularRestaurants MPR
      WHERE MPR.business_id = R.business_id AND R.stars >= 4 LIMIT 1) as high_rating_review_text,
      (SELECT R.text
      FROM MostPopularRestaurants MPR
      WHERE MPR.business_id = R.business_id AND R.stars >= 2 AND R.stars <= 3 LIMIT 1) as mid_rating_review_text,
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
  } else {
    connection.query(`
      WITH MostPopularRestaurants AS (
      SELECT RES.business_id, RES.name, RES.address, RES.stars, RES.review_count 
      FROM Restaurants RES
      GROUP BY RES.business_id
      ORDER BY RES.review_count DESC
      LIMIT 100
      )
      SELECT MPR.business_id, MPR.name, MPR.address, MPR.stars, MPR.review_count, (SELECT R.text
      FROM MostPopularRestaurants MPR
      WHERE MPR.business_id = R.business_id AND R.stars >= 4 LIMIT 1) as high_rating_review_text,
      (SELECT R.text
      FROM MostPopularRestaurants MPR
      WHERE MPR.business_id = R.business_id AND R.stars >= 2 AND R.stars <= 3 LIMIT 1) as mid_rating_review_text,
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

    
}

// Route 9: GET /best_restaurants_per_category
const best_restaurants_per_category = async function(req, res) {
  const zipcode = req.query.zip_code ?? '';

      connection.query(`
        WITH RankedRestaurants AS (
        SELECT R.name, R.address,
        R.cat_1,
        R.stars,
        ROW_NUMBER() OVER (PARTITION BY R.cat_1 ORDER BY AVG(Rev.stars)
        DESC) AS ranking
        FROM Restaurants R JOIN Reviews Rev ON R.business_id = Rev.business_id
        AND R.zip_code = '${zipcode}'
        GROUP BY R.business_id
        )
        SELECT name, address, cat_1, stars FROM RankedRestaurants
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

// Route 10: GET /recommended_attractions
const recommended_attractions = async function(req, res) {
  const zipcode = req.query.zip_code ?? '';

  connection.query(`
    SELECT *
    FROM Attractions A
    WHERE (
    SELECT COUNT(DISTINCT R.business_id)
    FROM Nearby N
    JOIN Restaurants R ON N.business_id = R.business_id WHERE N.attraction_id = A.attraction_id
    AND R.review_count > 100
    AND R.stars >= 4
    ) > 1 AND A.zip_code = '${zipcode}';
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

// Route 11: GET /zipcode_ranking
const zipcode_ranking = async function(req, res) {
  connection.query(`
    SELECT
    RZ.ZipCode, 
    RZ.NumberOfRestaurants, 
    RZ.ZipCodeAverageRating,
    RZ.ZipCodeTotalReviews,
    RZ.ZipCodeRank
    FROM TopZipCodes RZ ORDER BY RZ.ZipCodeRank;
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

// Route 12: GET /attractions/current
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
    SELECT name, type, latitude, longitude, attraction_id, address, website
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

// Route 13: GET /all_restaurants/current
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
              LIMIT 1) as low_rating_review_text
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
              LIMIT 1) as low_rating_review_text
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
              LIMIT 1) as low_rating_review_text
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

//Route 15.5: Get restaurants in top 5 zipcodes of all time GET 

const best_restaurants_in_top_zipcodes = async function(req, res) { 
  connection.query(`
      WITH Top5ZipCodes AS (
      SELECT ZipCode
      FROM TopZipCodes
      LIMIT 5),
      Top5RestaurantsPerZip AS (SELECT
      R.business_id AS BusinessID,
      R.name AS RestaurantName,
      R.review_count AS TotalReviews,
      R.stars AS AverageRating,
      R.zip_code AS ZipCode,
      R.address AS Address,
      ROW_NUMBER() OVER (PARTITION BY R.zip_code ORDER BY R.review_count DESC) AS RestaurantRank
      FROM Restaurants R
      INNER JOIN Top5ZipCodes TZC ON R.zip_code = TZC.ZipCode
      )
      SELECT *
      FROM Top5RestaurantsPerZip
      WHERE RestaurantRank <= 5
      ORDER BY ZipCode, RestaurantRank;`
      , (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
}

// Route 16: GET /zipgenerator/:zip_code
const zip_generator = async function(req, res) {
  const userZipCode = req.params.zip_code;

  connection.query(`
    SELECT longitude, latitude
    FROM LongLatLookUp
    WHERE postal_code = ${userZipCode}
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({ error: 'No data found or query error' });
    } else {
      res.json(data[0]); // Assuming the query returns one row
    }
  });
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
  best_restaurants_per_category,
  recommended_attractions,
  zipcode_ranking,
  attractions_within_bounds,
  restaurants_within_bounds,
  best_restaurants_in_top_zipcodes,
  zip_generator
}
