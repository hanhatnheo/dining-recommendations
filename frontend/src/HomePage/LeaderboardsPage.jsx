import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button } from '@mui/material';
import Navbar from './Navbar';
import config from '../../../server/config.json';
import axios from 'axios';

export default function LeaderboardsPage() {
  const [pageSize, setPageSize] = useState(25);

  // Assuming different data sets for each leaderboard category
  const [recommendedData, setRecommendedData] = useState([]);
  const [zipcodeRankingData, setZipcodeRankingData] = useState([]);
  const [mostPopularData, setMostPopularData] = useState([]);
  const [bestRestaurantsPerCategoryData, setBestRestaurantsPerCategoryData] = useState([]);
  const [zipCodeFilter, setZipCodeFilter] = useState('');
  const [categoryZipCodeFilter, setCategoryZipCodeFilter] = useState('');

  const URLPREFIX = //`http://${config.server_host}:${config.server_port}/`;
                `https://exploreeat.fly.dev/`; // deployed back-end

  const getRecommendedRestaurants = useCallback(async () => {
    try {
      // Fetch Recommended Restaurants (route 14)
      const response = await axios.get(`${URLPREFIX}all_restaurants/zip_code/best`)
      console.log(response.data)
      setRecommendedData(response.data)
      console.log(recommendedData);
    } catch (error) {
      console.error('Error fetching restaurants', error);
    }
  });

  const getZipRank = useCallback(async () => {
    try {
      // Fetch Zipcode Ranking (route 11)
      const response = await axios.get(`${URLPREFIX}zipcode_ranking`)
      console.log(response.data)
      setZipcodeRankingData(response.data)
      console.log(zipcodeRankingData);
    } catch (error) {
      console.error('Error fetching zips', error);
    }
  }, []);

  const getPopularRestaurants = useCallback(async () => {
    try {
      // Fetch Most Popular Restaurants (route 8)
      const url = zipCodeFilter
        ? `${URLPREFIX}most_popular_restaurants?zip_code=${zipCodeFilter}`
        : `${URLPREFIX}most_popular_restaurants`;

      console.log(url);

      const response = await axios.get(url);
      setMostPopularData(response.data)
      console.log(mostPopularData);
    } catch (error) {
      console.error('Error fetching most popular restaurants', error);
    }
  }, [zipCodeFilter]);

  const getBestRestaurantsPerCategory = useCallback(async () => {
    try {
      // Fetch Best Restaurants Per Category (route 9)
      const url = categoryZipCodeFilter
        ? `${URLPREFIX}best_restaurants_per_category?zip_code=${categoryZipCodeFilter}`
        : `${URLPREFIX}best_restaurants_per_category`;

      console.log(url);

      const response = await axios.get(url);
      setBestRestaurantsPerCategoryData(response.data)
      console.log(bestRestaurantsPerCategoryData);
    } catch (error) {
      console.error('Error fetching best restaurants per category', error);
    }
  }, [categoryZipCodeFilter]);

  useEffect(() => {
    getRecommendedRestaurants();
    console.log(recommendedData);
  }, [recommendedData]);

  useEffect(() => {
    getZipRank();
    console.log(zipcodeRankingData);
  }, []);

  const recommendedColumns = [
    { field: 'BusinessID', headerName: 'ID', width: 80 },
    { field: 'RestaurantName', headerName: 'Restaurant Name', width: 150 },
    { field: 'TotalReviews', headerName: 'Total Reviews', width: 100 },
    { field: 'AverageRating', headerName: 'Average Rating', width: 120 },
    { field: 'ZipCode', headerName: 'Zip Code', width: 80 },
    { field: 'Address', headerName: 'Address', width: 150 }
  ];

  const zipcodeColumns = [
    { field: 'ZipCode', headerName: 'Zip Code', width: 80 },
    { field: 'NumberOfRestaurants', headerName: 'Number of Restaurants', width: 150 },
    { field: 'ZipCodeTotalReviews', headerName: 'Total Reviews', width: 100 },
    { field: 'ZipCodeAverageRating', headerName: 'Average Rating', width: 120 },
    { field: 'ZipCodeRank', headerName: 'Rank', width: 80 }
  ];

  const popularColumns = [
    { field: 'business_id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Restaurant Name', width: 100 },
    { field: 'stars', headerName: 'Average Rating', width: 80 },
    { field: 'review_count', headerName: 'Total Reviews', width: 80 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'high_rating_review_text', headerName: '4-5 Stars Review', width: 500 },
    { field: 'mid_rating_review_text', headerName: '2-3 Stars Review', width: 500 },
    { field: 'low_rating_review_text', headerName: '1 Star Review', width: 500 },
  ];

  const bestRestaurantsPerCategoryColumns = [
    { field: 'business_id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Restaurant Name', width: 200 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'cat_1', headerName: 'Category', width: 200 },
    { field: 'stars', headerName: 'Average Rating', width: 200 },
  ];

  return (
    <div><Navbar />
    <Container>
      <h2>Leaderboards</h2>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <h3>Top 5 Restaurants Per Zip Code!</h3>
          <DataGrid
            rows={recommendedData}
            columns={recommendedColumns}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            getRowId={(row) => row.BusinessID}
            style={{
              background: 'white'
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <h3>Best Zip Codes for Restaurants!</h3>
          <DataGrid
            rows={zipcodeRankingData}
            columns={zipcodeColumns}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            getRowId={(row) => row.ZipCode}
            style={{
              background: 'white'
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <h3>Most Popular Restaurants in Your Zip!</h3>
          <div className="zipcode-input">
          <TextField
          label="Enter Your Zip Code"
          variant="outlined"
          value={zipCodeFilter}
          onChange={(e) => setZipCodeFilter(e.target.value)}
          style={{ marginBottom: '20px', backgroundColor: 'white' }}
          inputProps={{"data-testid":'zip-input'}}
        />
        <Button data-testid="search-button" onClick={getPopularRestaurants} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
          Search
        </Button>
        </div>
          <DataGrid
            rows={mostPopularData}
            columns={popularColumns}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            getRowId={(row) => row.business_id}
            style={{
              background: 'white'
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
            <h3>Best Restaurants Per Category!</h3>
            <div className="zipcode-input">
            <TextField 
              label="Enter Your Zip Code"
              variant="outlined"
              value={categoryZipCodeFilter}
              onChange={(e) => setCategoryZipCodeFilter(e.target.value)}
              style={{ marginBottom: '20px', backgroundColor: 'white', position: "center" }}
              inputProps={{"data-testid":'category-zip'}}
            />
            <Button data-testid="category-button" onClick={getBestRestaurantsPerCategory} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
              Search
            </Button>
            </div>
            <DataGrid
              rows={bestRestaurantsPerCategoryData}
              columns={bestRestaurantsPerCategoryColumns}
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
              }}
              onPageSizeChange={setPageSize}
              rowsPerPageOptions={[5, 10, 25]}
              autoHeight
              getRowId={(row) => row.business_id}
              style={{
                background: 'white'
              }}
            />
          </Grid>
      </Grid>
    </Container>
    </div>
  );
}
