import React, { useState } from 'react';

const GradientSlider = ({ label, min, max, step, value, onChange }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        style={{
          accentColor: 'linear-gradient(90deg, #ff0000, #ffff00, #00ff00)',
          width: '100%',
        }}
      />
    </div>
  );
};

export default GradientSlider;