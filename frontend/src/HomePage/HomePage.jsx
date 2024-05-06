import React from 'react';
import { createRoot } from 'react-dom/client';
import "mapbox-gl/dist/mapbox-gl.css";
import Navbar from './Navbar';
import Map from './Map';

import { useLocation } from 'react-router-dom';

export default function App() {
  const location = useLocation();  // Get location from react-router
  const coordinates = location.state?.coordinates;  // Get coordinates passed in state

  return (
    <div>
      <Navbar /> 
      <Map initialCoordinates={coordinates}/>
    </div>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}