import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../server/config.json';

const URLPREFIX = `http://${config.server_host}:${config.server_port}/`;

const Intro = () => {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInput = (input) => {
    const regex = /^[0-9]{5}$/;  // Basic US zip code validation
    return regex.test(input);
  };

  const handleSearch = async () => {
    if (!zipCode) {
      setError('Zip code cannot be empty.');
      return;
    }
    if (!validateInput(zipCode)) {
      setError('Please enter a valid 5-digit zip code.');
      return;
    }
    setError('');

    // Fetch coordinates from the server using zip_generator
    try {
      const response = await axios.get(`${URLPREFIX}zip_generator/${zipCode}`);
      if (response.data) {
        navigate('/home', { state: { coordinates: response.data } });
      } else {
        throw new Error('No data returned');
      }
    } catch (error) {
      console.error('Error fetching coordinates', error);
      setError('Failed to fetch coordinates. Please try again.');
    }
  };

  return (
    <div className="intro-page">
      <h1>Welcome to Our Map App!</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter zip code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Intro;