import React, { useState } from 'react';

function ZipCodeBox({ onValidZip }) {
  const [zipCode, setZipCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //maybe use database call later
  const validateZipCode = (zip) => /^\d{5}(-\d{4})?$/.test(zip);

  const handleZipChange = (event) => {
    setZipCode(event.target.value);
  };

  const handleZoomToZip = async () => {
    if (validateZipCode(zipCode)) {
      try {
        const coords = await getCoordinatesFromZip(zipCode);
        if (coords) {
          onValidZip(coords);
          setErrorMessage('');
        } else {
          setErrorMessage('No coordinates found for this ZIP code.');
        }
      } catch (error) {
        setErrorMessage('Failed to fetch coordinates.');
      }
    } else {
      setErrorMessage('Invalid ZIP code.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter ZIP code"
        value={zipCode}
        onChange={handleZipChange}
      />
      <button onClick={handleZoomToZip}>Zoom</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

async function getCoordinatesFromZip(zip) {
    const apiKey = 'AIzaSyAa-DpmQ3AAm1sDv00QJ1YEXOW33OiUPC8Y'; //keep this on dl lol
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${apiKey}`;
  
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch coordinates from Google Maps Geocoding API.');
  
    const data = await response.json();
  
    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    } else {
      throw new Error(data.error_message || 'Failed to find coordinates for the provided ZIP code.');
    }
  }

/*
async function getCoordinatesFromZip(zip) {
  const apiKey = 'zipapi'; //insert actual api key here
  const url = `https://api.zipapi.example.com/zip?apikey=${apiKey}&code=${zip}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Network response was not ok.');
  const data = await response.json();
  return { latitude: data.latitude, longitude: data.longitude };
}
*/

export default ZipCodeBox;