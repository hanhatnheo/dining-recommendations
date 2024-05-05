import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Slider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './Navbar';
import config from '../../../server/config.json';

export default function RestaurantPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);

  const [name, setName] = useState('');
  const [stars, setStars] = useState([0, 5]);
  const [foodQuality, setFoodQuality] = useState([-25, 25]);
  const [drinkQuality, setDrinkQuality] = useState([-25, 25]);
  const [serviceQuality, setServiceQuality] = useState([-25, 25]);
  const [valuePerDollar, setValuePerDollar] = useState([-25, 25]);
  const [distance, setDistance] = useState([0, 50]); // Assuming distance in km or miles as suitable

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_restaurants`)
      .then(res => res.json())
      .then(resJson => {
        const restaurantsWithId = resJson.map(restaurant => ({ id: restaurant.restaurant_id, ...restaurant }));
        setData(restaurantsWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_restaurants?name=${name}` +
      `&stars_low=${stars[0]}&stars_high=${stars[1]}` +
      `&foodQuality_low=${foodQuality[0]}&foodQuality_high=${foodQuality[1]}` +
      `&drinkQuality_low=${drinkQuality[0]}&drinkQuality_high=${drinkQuality[1]}` +
      `&serviceQuality_low=${serviceQuality[0]}&serviceQuality_high=${serviceQuality[1]}` +
      `&valuePerDollar_low=${valuePerDollar[0]}&valuePerDollar_high=${valuePerDollar[1]}` +
      `&distance_low=${distance[0]}&distance_high=${distance[1]}`
    )
      .then(res => res.json())
      .then(resJson => {
        const restaurantsWithId = resJson.map(restaurant => ({ id: restaurant.restaurant_id, ...restaurant }));
        setData(restaurantsWithId);
      });
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'stars', headerName: 'Stars', width: 100 },
    { field: 'foodQuality', headerName: 'Food Quality', width: 150 },
    { field: 'drinkQuality', headerName: 'Drink Quality', width: 150 },
    { field: 'serviceQuality', headerName: 'Service Quality', width: 150 },
    { field: 'valuePerDollar', headerName: 'Value Per Dollar', width: 150 },
    { field: 'distance', headerName: 'Distance', width: 100 },
  ];

  return (
    <div>
      <Navbar />
      <Container>
        <h2>Search for Restaurants</h2>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Restaurant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
          </Grid>
          {['Stars', 'Food Quality', 'Drink Quality', 'Service Quality', 'Value Per Dollar', 'Distance'].map((item, index) => (
            <Grid item xs={4} key={index}>
              <Slider
                value={eval(item.toLowerCase().replace(/ /g, ''))}
                onChange={(e, newValue) => eval(`set${item.replace(/ /g, '')}(newValue)`)}
                valueLabelDisplay="auto"
                min={item === 'Stars' ? 0 : item === 'Distance' ? 0 : -25}
                max={item === 'Stars' ? 5 : item === 'Distance' ? 50 : 25}
                aria-labelledby={`${item.toLowerCase().replace(/ /g, '')}-slider`}
              />
              <p>{item}</p>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" onClick={search} style={{ marginTop: 20 }}>
              Search
            </Button>
          </Grid>
        </Grid>
        <h2>Results</h2>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 25]}
          autoHeight
        />
      </Container>
    </div>
  );
}
