import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button } from '@mui/material';
import Navbar from './Navbar';
import config from '../../../server/config.json';
import axios from 'axios';

export default function LeaderboardsPage() {
  const [pageSize, setPageSize] = useState(10);

  // Assuming different data sets for each leaderboard category
  const [recommendedData, setRecommendedData] = useState([]);
  const [zipcodeRankingData, setZipcodeRankingData] = useState([]);
  const [mostPopularData, setMostPopularData] = useState([]);
  const [zipCodeFilter, setZipCodeFilter] = useState('');
  
  const getRecommendedRestaurants = useCallback(async () => {
    try {
      // Fetch Recommended Restaurants (route 15.5)
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/all_restaurants/zip_code/best`)
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
      const response = await axios.get(`http://${config.server_host}:${config.server_port}/zipcode_ranking`)
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
      ? `http://${config.server_host}:${config.server_port}/most_popular_restaurants?zip_code=${zipCodeFilter}`
      : `http://${config.server_host}:${config.server_port}/most_popular_restaurants`;

      console.log('clicked')

      console.log(url);

      const response = await axios.get(url);
      console.log('Most popular')
      console.log(response.data)
      setMostPopularData(response.data)
      console.log(mostPopularData);
    } catch (error) {
      console.error('Error fetching most popular restaurants', error);
    }
   }, [zipCodeFilter]);

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
    { field: 'stars', headerName: 'Number of Restaurants', width: 80 },
    { field: 'review_count', headerName: 'Total Reviews', width: 80 },
    { field: 'Address', headerName: 'Address', width: 120 },
    { field: 'high_rating_review_text', headerName: '4-5 Stars Review', width: 120 },
    { field: 'mid_rating_review_text', headerName: '2-3 Stars Review', width: 120 },
    { field: 'low_rating_review_text', headerName: '1 Star Review', width: 120 },
  ];

  return (
    <div><Navbar />
    <Container>
      <h2>Leaderboards</h2>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <h3>Best Restaurants in Your Zip!</h3>
          <DataGrid
            rows={recommendedData}
            columns={recommendedColumns}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            getRowId={(row) => row.BusinessID}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <h3>Best Zip Codes for Restaurants!</h3>
          <DataGrid
            rows={zipcodeRankingData}
            columns={zipcodeColumns}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            getRowId={(row) => row.ZipCode}
          />
        </Grid>
        <Grid item xs={12}>
          <h3>Most Popular Restaurants in the U.S.!</h3>
          <TextField
          label="Enter Your Zip Code"
          variant="outlined"
          value={zipCodeFilter}
          onChange={(e) => setZipCodeFilter(e.target.value)}
          style={{ marginBottom: '20px' }}
          InputProps={{
            style: { backgroundColor: 'white', borderRadius: '4px' }, // Set background color and border radius
          }}
        />
        <Button onClick={getPopularRestaurants} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
          Search
        </Button>
          <DataGrid
            rows={mostPopularData}
            columns={popularColumns}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            getRowId={(row) => row.business_id}
          />
        </Grid>
      </Grid>
    </Container>
    </div>
  );
}
