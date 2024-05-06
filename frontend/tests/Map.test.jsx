import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Map from '../src/HomePage/Map';  // Adjust path as necessary

vi.mock('react-map-gl', () => {
  const MockReactMapGL = ({ children }) => <div>{children}</div>;
  const MockNavigationControl = () => <div>Navigation Control</div>;

  return {
    __esModule: true,
    default: MockReactMapGL,
    NavigationControl: MockNavigationControl
  };
});

// Mock components if they are not directly tested here
vi.mock('../src/HomePage/ControlPanel', () => ({
  __esModule: true,
  default: ({ markerType, setMarkerType, mapStyle, setMapStyle }) => (
    <div>Control Panel</div>
  )
}));

vi.mock('../src/HomePage/Markers', () => ({
  __esModule: true,
  default: () => <div>Markers</div>
}));

vi.mock('../src/HomePage/Restaurants', () => ({
  __esModule: true,
  default: () => <div>Restaurants</div>
}));


describe('Map Component', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
  
    it('renders with initial coordinates and default settings', () => {
      const initialCoordinates = { latitude: 40, longitude: -100 };
      render(<Map initialCoordinates={initialCoordinates} />);
  
      expect(screen.getByText('Control Panel')).toBeInTheDocument();
      expect(screen.getByText('Navigation Control')).toBeInTheDocument();
    });
  
    it('conditionally renders Markers and Restaurants based on markerType', () => {
      const initialCoordinates = { latitude: 40, longitude: -100 };
      render(<Map initialCoordinates={initialCoordinates} />);
  
      // Initially, no Markers or Restaurants should be visible
      expect(screen.queryByText('Markers')).toBeNull();
      expect(screen.queryByText('Restaurants')).toBeNull();
    });
  });
  