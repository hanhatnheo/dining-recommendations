import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Navbar from './Navbar';
import config from '../../../server/config.json';

export default function LeaderboardsPage() {
  const [pageSize, setPageSize] = useState(10);

  // Assuming different data sets for each leaderboard category
  const [recommendedData, setRecommendedData] = useState([]);
  const [zipcodeRankingData, setZipcodeRankingData] = useState([]);
  const [mostPopularData, setMostPopularData] = useState([]);

  // Fetch data for each category (placeholders for actual API endpoints)
  useEffect(() => {
    // Fetch Recommended Restaurants (route 15)
    fetch(`http://${config.server_host}:${config.server_port}/all_restaurants/zip_code/best`)
      .then(res => res.json())
      .then(data => setRecommendedData(data));

    // Fetch Zipcode Ranking (route 12)
    fetch(`http://${config.server_host}:${config.server_port}/zipcode_ranking`)
      .then(res => res.json())
      .then(data => setZipcodeRankingData(data));

    // Fetch Most Popular Restaurants (route 8)
    fetch(`http://${config.server_host}:${config.server_port}/most_popular_restaurants`)
      .then(res => res.json())
      .then(data => setMostPopularData(data));
  }, []);

  const commonColumns = [
    { field: 'restaurantName', headerName: 'Restaurant Name', width: 150 },
    { field: 'totalRev', headerName: 'Total Reviews', width: 100 },
    { field: 'avgRating', headerName: 'Average Rating', width: 100 },
    { field: 'zipCode', headerName: 'Zip Code', width: 130 },
    { field: 'address', headerName: 'Address', width: 130 }
  ];

  return (
    <Container>
      <Navbar />
      <h2>Leaderboards</h2>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <h3>/recommended_restaurants</h3>
          <DataGrid
            rows={recommendedData}
            columns={commonColumns}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <h3>/zipcode_ranking</h3>
          <DataGrid
            rows={zipcodeRankingData}
            columns={commonColumns}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
          />
        </Grid>
        <Grid item xs={12}>
          <h3>/most_popular_restaurants</h3>
          <DataGrid
            rows={mostPopularData}
            columns={commonColumns}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
          />
        </Grid>
      </Grid>
    </Container>
  );
}
