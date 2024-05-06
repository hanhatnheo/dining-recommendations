import React, { useState } from 'react';
import ReactMapGL, { NavigationControl, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ControlPanel from './ControlPanel';
import { Markers } from './Markers';
import { Restaurants } from './Restaurants';
import { Sidebar } from './Sidebar';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX; 

const MAP_CONFIG = {
  minZoom: 0,
  maxZoom: 20,
  mapboxAccessToken: MAPBOX_TOKEN
};

const Map = ({ initialCoordinates }) => {
    const mapRef = React.useRef(null);
    const mapContainerRef = React.useRef(null);

    const [markerType, setMarkerType] = useState('none');
    const [attractionsDetails, setAttractionsDetails] = useState([]);
    const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v9");

    return (
      <div style={{ width: "100%", height: "98vh" }}>
        <div ref={mapContainerRef} className="map">
          <ReactMapGL
            ref={mapRef}
            interactive
            {...MAP_CONFIG}
            mapStyle={mapStyle}
            initialViewState={{
                longitude: initialCoordinates?.longitude || -100,
                latitude: initialCoordinates?.latitude || 40,
                zoom: 9,
              }}
          >
            <Sidebar attractionsDetails={attractionsDetails} />
            <NavigationControl className="navigation-control" showCompass={false} />
            {markerType === 'attractions' && <Markers attractionsDetails={attractionsDetails} setAttractionsDetails={setAttractionsDetails}/>}
            {markerType === 'restaurants' && <Restaurants />}
            </ReactMapGL>
            <ControlPanel markerType={markerType} setMarkerType={setMarkerType} mapStyle={mapStyle} setMapStyle={setMapStyle} />
        </div>
      </div>
    );
};

export default Map;
