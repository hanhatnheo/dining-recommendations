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
import Intro from './HomePage/Intro.jsx'; // Ensure this is correctly imported
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />  // Set Intro as the root path
        <Route path="/home" element={<HomePage />} />  // Change path to /home
        <Route path="/restaurants" element={<RestaurantsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
