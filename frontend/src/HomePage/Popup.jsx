import React from 'react';
import { Popup as MapboxPopup } from 'react-map-gl';

const Popup = ({ marker, onClose, position }) => {
  return (
    <MapboxPopup
      offsetTop={-20}
      offsetLeft={20}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      anchor="bottom-left"
    >
      <div style={{ background: 'white', padding: '10px', borderRadius: '10px' }}>
        <h3>{marker.name}</h3>
        "Hello World"
      </div>
    </MapboxPopup>
  );
};

export default Popup;