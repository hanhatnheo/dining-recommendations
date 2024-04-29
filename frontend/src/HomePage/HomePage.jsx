import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMapGL, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
//import ZipCodeBox from './ZipCodeBox'; // Make sure the path is correct
import Navbar from './Navbar';
import { Markers } from './Markers';
import { Restaurants } from './Restaurants';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX; 

const MAP_CONFIG = {
  minZoom: 5,
  maxZoom: 20,
  longitude: -100,
  latitude: 40,
  mapStyle: "mapbox://styles/mapbox/light-v9",
  mapboxAccessToken: MAPBOX_TOKEN
};

export default function App() {

  const Map = () => {
    const mapRef = React.useRef(null);
    const mapContainerRef = React.useRef(null);
    
    return (
      <div>
        <Navbar /> {/* Render the navigation bar */}
        <div ref={mapContainerRef} className="map">
          <ReactMapGL
            ref={mapRef}
            {...MAP_CONFIG}
          >
            <NavigationControl className="navigation-control" showCompass={false} />
            <Markers />
          </ReactMapGL>
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%", height: "98vh" }}>
      <Map />
    </div>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}