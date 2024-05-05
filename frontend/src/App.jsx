/*
//import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage.jsx';
import './App.css'

function App() {
  return (
    <HomePage/>
  )
}

export default App;
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage/HomePage.jsx';
import RestaurantsPage from './HomePage/RestaurantsPage.jsx';
import Intro from './HomePage/Intro.jsx'; 
import LeaderboardsPage from './HomePage/LeaderboardsPage.jsx'
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />  
        <Route path="/home" element={<HomePage />} />  
        <Route path="/all_restaurants" element={<RestaurantsPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
