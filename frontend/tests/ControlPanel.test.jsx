import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ControlPanel from '../src/Homepage/ControlPanel'; 

describe('ControlPanel Component', () => {
  it('renders correctly with initial marker type and map style', () => {
    const setMarkerType = vi.fn();
    const setMapStyle = vi.fn();

    // Render the component with initial props
    render(<ControlPanel markerType="none" setMarkerType={setMarkerType} mapStyle="mapbox://styles/mapbox/light-v9" setMapStyle={setMapStyle} />);

    // Assertions to check if the component renders correctly
    expect(screen.getByLabelText(/No Markers/i)).toBeChecked();
    expect(screen.getByLabelText(/Light Mode/i)).toBeChecked();
  });

  it('allows changing the marker type', async () => {
    const setMarkerType = vi.fn();
    const setMapStyle = vi.fn();

    // Render the component
    render(<ControlPanel markerType="none" setMarkerType={setMarkerType} mapStyle="mapbox://styles/mapbox/light-v9" setMapStyle={setMapStyle} />);

    // Simulate user changing the marker type to "attractions"
    const attractionsRadio = screen.getByLabelText(/Show Attractions/i);
    await userEvent.click(attractionsRadio);

    // Expect setMarkerType to have been called with "attractions"
    expect(setMarkerType).toHaveBeenCalledWith('attractions');
    
  });

  it('allows changing the marker type to restaurants', async () => {
    const setMarkerType = vi.fn();
    const setMapStyle = vi.fn();

    // Render the component
    render(<ControlPanel markerType="none" setMarkerType={setMarkerType} mapStyle="mapbox://styles/mapbox/light-v9" setMapStyle={setMapStyle} />);

    // Simulate user changing the marker type to "restaurants"
    const attractionsRadio = screen.getByLabelText(/Show Restaurants/i);
    await userEvent.click(attractionsRadio);

    // Expect setMarkerType to have been called with "restaurants"
    expect(setMarkerType).toHaveBeenCalledWith('restaurants');
    
  });

  it('allows changing the marker type to default', async () => {
    const setMarkerType = vi.fn();
    const setMapStyle = vi.fn();

    // Render the component
    render(<ControlPanel markerType="attractions" setMarkerType={setMarkerType} mapStyle="mapbox://styles/mapbox/light-v9" setMapStyle={setMapStyle} />);

    // Simulate user changing the marker type to "none"
    const noMarkersRadio = screen.getByLabelText(/No Markers/i);
    await userEvent.click(noMarkersRadio);

    // Expect setMarkerType to have been called with "none"
    expect(setMarkerType).toHaveBeenCalledWith('none');
    
  });


  it('allows changing the map style', async () => {
    const setMarkerType = vi.fn();
    const setMapStyle = vi.fn();

    // Render the component
    render(<ControlPanel markerType="none" setMarkerType={setMarkerType} mapStyle="mapbox://styles/mapbox/light-v9" setMapStyle={setMapStyle} />);

    // Simulate user changing the map style to "dark mode"
    const darkModeRadio = screen.getByLabelText(/Dark Mode/i);
    await userEvent.click(darkModeRadio);

    // Expect setMapStyle to have been called with the dark mode style URL
    expect(setMapStyle).toHaveBeenCalledWith('mapbox://styles/mapbox/dark-v9');
  });

  it('allows changing the map style to light', async () => {
    const setMarkerType = vi.fn();
    const setMapStyle = vi.fn();

    // Render the component
    render(<ControlPanel markerType="none" setMarkerType={setMarkerType} mapStyle="mapbox://styles/mapbox/dark-v9" setMapStyle={setMapStyle} />);

    // Simulate user changing the map style to "light mode"
    const lightModeRadio = screen.getByLabelText(/Light Mode/i);
    await userEvent.click(lightModeRadio);

    // Expect setMapStyle to have been called with the light mode style URL
    expect(setMapStyle).toHaveBeenCalledWith('mapbox://styles/mapbox/light-v9');
  });
});
