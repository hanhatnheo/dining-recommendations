import React from 'react';
import ReactMapGL, { NavigationControl, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Markers } from './Markers';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX; 

const MAP_CONFIG = {
  minZoom: 0,
  maxZoom: 20,
  mapStyle: "mapbox://styles/mapbox/light-v9",
  mapboxAccessToken: MAPBOX_TOKEN
};

// Define the GeoJSON data for the rectangle
const rectangleGeoJSON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-100.01, 40.01],  // Adjust these coordinates to frame your rectangle appropriately
        [-99.99, 40.01],
        [-99.99, 39.99],
        [-100.01, 39.99],
        [-100.01, 40.01]  // Closed loop (first coordinate repeated)
      ]
    ]
  }
};

const Map = ({ initialCoordinates }) => {
    const mapRef = React.useRef(null);
    const mapContainerRef = React.useRef(null);

    return (
      <div style={{ width: "100%", height: "98vh" }}>
        <div ref={mapContainerRef} className="map">
          <ReactMapGL
            ref={mapRef}
            interactive
            {...MAP_CONFIG}
            initialViewState={{
                longitude: initialCoordinates?.longitude || -100,
                latitude: initialCoordinates?.latitude || 40,
                zoom: 9,
              }}
          >
            <NavigationControl className="navigation-control" showCompass={false} />
            <Markers />
            </ReactMapGL>
        </div>
      </div>
    );
};

export default Map;
