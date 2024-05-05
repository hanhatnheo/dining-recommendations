import React from 'react';
import { useNavigate } from 'react-router-dom';


const ControlPanel = ({ onToggleLayer, onChangeStyle }) => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1, backgroundColor: 'white', padding: '10px' }}>
      <button onClick={() => onToggleLayer('markers')}>Toggle Markers</button>
      <button onClick={() => onChangeStyle('mapbox://styles/mapbox/dark-v9')}>Dark Mode</button>
      <button onClick={() => onChangeStyle('mapbox://styles/mapbox/light-v9')}>Light Mode</button>
      <div className="input">
        <label>Attractions</label>
        <input
          type="checkbox"
          name="Attractions"
          checked={allDays}
          onChange={evt => onChangeAllDays(evt.target.checked)}
        />
      </div>
      <div className="input">
        <label>Restaurants</label>
        <input
          type="checkbox"
          name="Restaurants"
          checked={allDays}
          onChange={evt => onChangeAllDays(evt.target.checked)}
        />
      </div>
    </div>
    
  );
};

export default ControlPanel;
