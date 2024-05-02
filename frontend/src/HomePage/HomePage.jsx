import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import "mapbox-gl/dist/mapbox-gl.css";
//import ZipCodeBox from './ZipCodeBox'; // Make sure the path is correct
import Navbar from './Navbar';
import Map from './Map';

export default function App() {
  return (
    <div>
      <Navbar /> 
      <Map />
    </div>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}