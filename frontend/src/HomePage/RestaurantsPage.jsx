import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Slider,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './Navbar';
import config from '../../../server/config.json';

var bgColors = {
  "Default": "#DFDEE5"
};

export default function RestaurantsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [stars, setStars] = useState([0, 5]);
  const [foodQ, setFoodQ] = useState([-25, 25]);
  const [drinkQ, setDrinkQ] = useState([-25, 25]);
  const [serviceQ, setServiceQ] = useState([-25, 25]);
  const [valuePerD, setValuePerD] = useState([-25, 25]);

  //random restaurant + attarction
  const [restaurant, setRestaurant] = useState(null); 
  const [attraction, setAttraction] = useState(null); 

  const URLPREFIX = //`http://${config.server_host}:${config.server_port}/`;
                `https://exploreeat.fly.dev/`; // deployed back-end

  useEffect(() => {
    fetchRandomRestaurant();
  }, []);

  const fetchRandomRestaurant = () => {
    fetch(`${URLPREFIX}random_restaurant`)
      .then(res => res.json())
      .then(resJson => {
        // Extracting variables
        const { name, rating, address } = resJson;
        // Setting state with fetched data
        setRestaurant({ name, rating, address });
      })
      .catch(error => {
        console.error('Error fetching random restaurant:', error);
      });
  };

  useEffect(() => {
    fetchRandomAttraction();
  }, []);

  const fetchRandomAttraction = () => {
    fetch(`${URLPREFIX}random_attraction`)
      .then(res => res.json())
      .then(resJson => {
        // Extracting variables
        const { name, type} = resJson;
        // Setting state with fetched data
        setAttraction({ name, type});
      })
      .catch(error => {
        console.error('Error fetching random attraction:', error);
      });
  };

  useEffect(() => {
    fetch(`${URLPREFIX}all_restaurants`)
      .then(res => res.json())
      .then(resJson => {
        const restaurantsWithId = resJson.map(restaurant => ({ id: restaurant.business_id, ...restaurant }));
        setData(restaurantsWithId);
      });
  }, []);

  const search = () => {
    fetch(`${URLPREFIX}all_restaurants?name=${name}` +
      `&rating_min=${stars[0]}&&rating_max=${stars[1]}&food_score_min=${foodQ[0]}&food_score_max=${foodQ[1]}` +
      `&drink_score_min=${drinkQ[0]}&drink_score_max=${drinkQ[1]}&service_score_min=${serviceQ[0]}&service_score_max=${serviceQ[1]}` +
      `&value_score_min=${valuePerD[0]}&value_score_max=${valuePerD[1]}&zip_code=${zipCode}`
    )
      .then(res => res.json())
      .then(resJson => {
        const restaurantsWithId = resJson.map(restaurant => ({ id: restaurant.business_id, ...restaurant }));
        setData(restaurantsWithId);
      });
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'stars', headerName: 'Stars', width: 100 },
    { field: 'food_score', headerName: 'Food', width: 100 },
    { field: 'drink_score', headerName: 'Drink', width: 75 },
    { field: 'service_score', headerName: 'Service', width: 75 },
    { field: 'value_score', headerName: 'Value', width: 75 },
    { field: 'review_text', headerName: 'Review Preview', width: 5000 }
  ];

  return (
    <div>
      <Navbar /> {/* This will place the Navbar at the top */}
      <Container>
        <div style={{ backgroundColor: bgColors.Default, padding: 20, marginTop: 20, borderRadius: 20, }}>
          <h2 style={{color: "black"}}>Search for Restaurants</h2>
          <Grid container
            spacing={3}
            direction="row"
            justifyContent="center"
            alignItems="center">
            <Grid item xs={12}>
              <TextField
                inputProps={{"data-testid":'name-change'}}
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                InputProps={{
                  style: { backgroundColor: 'white', borderRadius: '4px' }, // Set background color and border radius
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="ZIP Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                fullWidth
                inputProps={{"data-testid":'zip-input'}}
                InputProps={{
                  style: { backgroundColor: 'white', borderRadius: '4px' }, // Set background color and border radius
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Slider
                value={stars}
                onChange={(e, newValue) => setStars(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                aria-labelledby="stars-slider"
                data-testid="stars-slider"
              />
              <p style={{color: "black"}}>Stars</p>
            </Grid>
            <Grid item xs={4}>
              <Slider
                value={foodQ}
                onChange={(e, newValue) => setFoodQ(newValue)}
                valueLabelDisplay="auto"
                min={-25}
                max={25}
                aria-labelledby="foodQ-slider"
              />
              <p style={{color: "black"}}>Food Quality</p>
            </Grid>
            <Grid item xs={4}>
              <Slider
                value={drinkQ}
                onChange={(e, newValue) => setDrinkQ(newValue)}
                valueLabelDisplay="auto"
                min={-25}
                max={25}
                aria-labelledby="danceability-slider"
              />
              <p style={{color: "black"}}>Drink Quality</p>
            </Grid>
            <Grid item xs={4}>
              <Slider
                value={serviceQ}
                onChange={(e, newValue) => setServiceQ(newValue)}
                valueLabelDisplay="auto"
                min={-25}
                max={25}
                aria-labelledby="serviceQ-slider"
              />
              <p style={{color: "black"}}>Service Quality</p>
            </Grid>
            <Grid item xs={4}>
              <Slider
                value={valuePerD}
                onChange={(e, newValue) => setValuePerD(newValue)}
                valueLabelDisplay="auto"
                min={-25}
                max={25}
                aria-labelledby="valuePerD-slider"
              />
              <p style={{color: "black"}}>Value Per Dollar</p>
            </Grid>
            <Grid item xs={12}>
              <Button 
              variant="contained" 
              onClick={search} 
              style={{ marginTop: 20 }}
              data-testid="button">
                Search
              </Button>
            </Grid>
          </Grid>
        </div>
        <h2>Results</h2>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25]}
          autoHeight
        />
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          {restaurant && (
          <div style={{ backgroundColor: '#778EBC', borderRadius: '10px', padding: '10px' }}>
            Restaurant of the day: {restaurant.name}, {restaurant.rating} stars, {restaurant.address}
          </div> )}
        </Grid>
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          {attraction && (
          <div style={{ backgroundColor: '#CDCBB8', borderRadius: '10px', padding: '10px' }}>
            Attraction of the day: {attraction.name}, {attraction.type}
          </div> )}
        </Grid>
      </Container>
    </div>
    
  );
}