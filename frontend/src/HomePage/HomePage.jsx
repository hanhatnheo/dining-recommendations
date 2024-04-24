import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Markers } from './Markers';

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
  //const [restaurants, setRestaurants] = useState([]);

  const Map = () => {
    const mapRef = React.useRef(null);
    const mapContainerRef = React.useRef(null);
    
    return (
      <div ref={mapContainerRef} className="map">
        <ReactMapGL
          ref={mapRef}
          {...MAP_CONFIG}
        >
          <NavigationControl className="navigation-control" showCompass={false} />
          <Markers />

        </ReactMapGL>
      </div>
    );
  };


  //   // Fetch restaurants
    // axios.get(`${URLPREFIX}all_restaurants`, {
    //   params: { minLat, minLng, maxLat, maxLng }
    // }).then(response => {
    //   setRestaurants(response.data);
    // }).catch(error => console.error('Error fetching restaurants', error));

      //     {/* {restaurants.map(restaurant => (
      //       <Marker
      //         key={restaurant.business_id}
      //         latitude={restaurant.latitude}
      //         longitude={restaurant.longitude}
      //         onClick={e => onMarkerClick(e, restaurant)}
      //       >
      //         <img src="../assets/restaurant-icon.png" alt="Restaurant" />
      //       </Marker>

   
  return (
    <div style={{ width: "100%", height: "98vh" }}>
      <Map />
    </div>
  );
}

export function renderToDom(container) {
  createRoot(container).render(<App />);
}
