import React from 'react';
import ReactMapGL, { NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Markers } from './Markers';
import { Restaurants } from './Restaurants';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX; 

const MAP_CONFIG = {
  minZoom: 5,
  maxZoom: 20,
  mapStyle: "mapbox://styles/mapbox/light-v9",
  mapboxAccessToken: MAPBOX_TOKEN
};

const Map = () => {
    const mapRef = React.useRef(null);
    const mapContainerRef = React.useRef(null);
    
    return (
      <div style={{ width: "100%", height: "98vh" }}>
        <div ref={mapContainerRef} className="map">
          <ReactMapGL
            ref={mapRef}
            {...MAP_CONFIG}
          >
            <NavigationControl className="navigation-control" showCompass={false} />
            <Markers />
            <Restaurants />
          </ReactMapGL>
        </div>
      </div>
    );
};

export default Map;