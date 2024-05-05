import React from 'react';
import { useNavigate } from 'react-router-dom';


const ControlPanel = ({ onToggleLayer, onChangeStyle }) => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, backgroundColor: 'white', padding: '10px' }}>
      <button onClick={() => onToggleLayer('markers')}>Toggle Markers</button>
      <button onClick={() => onChangeStyle('mapbox://styles/mapbox/dark-v9')}>Dark Mode</button>
      <button onClick={() => onChangeStyle('mapbox://styles/mapbox/light-v9')}>Light Mode</button>
    </div>
  );
};

export default ControlPanel;
