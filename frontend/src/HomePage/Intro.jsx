import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateInput = (input) => {
    const regex = /^[0-9]{5}$/;  // Basic US zip code validation
    return regex.test(input);
  };

  const handleSearch = () => {
    if (!zipCode) {
      setError('Zip code cannot be empty.');
      return;
    }
    if (!validateInput(zipCode)) {
      setError('Please enter a valid 5-digit zip code.');
      return;
    }
    setError('');
    navigate('/home', { state: { zipCode } });  // Navigate and pass zip code
  };

  return (
    <div className="intro-page">
      <h1>Welcome to Penn Eats!</h1>
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
