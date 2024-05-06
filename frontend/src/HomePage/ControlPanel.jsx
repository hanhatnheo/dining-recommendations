import React from 'react';

const ControlPanel = ({ markerType, setMarkerType, mapStyle, setMapStyle }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 90,
      right: 30,
      zIndex: 1,
      backgroundColor: 'white',
      padding: '8px',
      display: 'flex',
      flexDirection: 'column',
      width: '150px',
      color: 'black',
      fontSize: '12px', 
      paddingBottom: '20px',
      borderRadius: '5px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
    }}>
      <div>
        <h4>Markers</h4>
        <label style={{ display: 'block' }}>
          <input
            type="radio"
            name="markerType"
            value="none"
            checked={markerType === 'none'}
            onChange={() => setMarkerType('none')}
          /> No Markers
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="radio"
            name="markerType"
            value="attractions"
            checked={markerType === 'attractions'}
            onChange={() => setMarkerType('attractions')}
          /> Show Attractions
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="radio"
            name="markerType"
            value="restaurants"
            checked={markerType === 'restaurants'}
            onChange={() => setMarkerType('restaurants')}
          /> Show Restaurants
        </label>
      </div>
      <div>
        <h4>Map Theme</h4>
        <label style={{ display: 'block' }}>
          <input
            type="radio"
            name="mapStyle"
            value="mapbox://styles/mapbox/light-v9"
            checked={mapStyle === 'mapbox://styles/mapbox/light-v9'}
            onChange={() => setMapStyle('mapbox://styles/mapbox/light-v9')}
          /> Light Mode
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="radio"
            name="mapStyle"
            value="mapbox://styles/mapbox/dark-v9"
            checked={mapStyle === 'mapbox://styles/mapbox/dark-v9'}
            onChange={() => setMapStyle('mapbox://styles/mapbox/dark-v9')}
          /> Dark Mode
        </label>
      </div>
    </div>
  );
};

export default ControlPanel;
