import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Restaurants } from '../src/HomePage/Restaurants';
import axios from 'axios';
import { UseMap } from '../src/HomePage/UseMap';
import { useMap } from "react-map-gl";

vi.mock('axios');
vi.mock('react-map-gl', () => ({
  useMap: vi.fn(),
  Marker: vi.fn(({ children, onClick, latitude, longitude }) => <div data-lat={latitude} data-lng={longitude} onClick={onClick}>{children}</div>), 
  Popup: vi.fn(({ children, onClose }) => <div>{children}<button onClick={onClose}>Close</button></div>)  
}));

vi.mock('../src/HomePage/UseMap');

vi.mock('../src/HomePage/MarkerIcon', () => ({
    RestaurantIcon: vi.fn(() => <div data-testid="restaurant-icon">RestaurantIcon</div>) 
}));

describe('Restaurants', () => {
    beforeEach(() => {
        vi.mocked(axios.get).mockClear();
      });
  let mapMock;

  beforeEach(() => {
    axios.get.mockClear();
    mapMock = {
      getBounds: vi.fn().mockReturnValue({
        toArray: () => [[37.7749, -122.4194], [40.7128, -74.006]],
      }),
      on: vi.fn(),
      off: vi.fn(),
    };

    useMap.mockReturnValue({ current: mapMock });
    UseMap.mockReturnValue({
      bounds: {
        toArray: () => [[37.7749, -122.4194], [40.7128, -74.006]]
      },
      isMoving: false
    });
  });


  it('renders restaurant markers on the map', async () => {
    const mockRestaurants = [
      { business_id: 1, latitude: 40.7128, longitude: -74.006 },
      { business_id: 2, latitude: 37.7749, longitude: -122.4194 },
    ];

    axios.get.mockResolvedValueOnce({ data: mockRestaurants });

    render(<Restaurants />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/all_restaurants/current'), {
        params: {
          maxLat: -74.006,
          minLat: -122.4194,
          minLng: 37.7749,
          maxLng: 40.7128,
        },
      });
    });

    expect(UseMap).toHaveBeenCalled();
  });

  it('handles marker clicks by showing a popup', async () => {
    const mockRestaurants = [
        { business_id: 1, latitude: 40.7128, longitude: -74.006 },
        { business_id: 2, latitude: 37.7749, longitude: -122.4194 },
      ];
  
      axios.get.mockResolvedValueOnce({ data: mockRestaurants });
  
      render(<Restaurants />);
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    
    screen.debug();
    const markers = screen.getAllByTestId('restaurant-icon');
    expect(markers).toHaveLength(2);
    fireEvent.click(markers.at(0));

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
  });

  it('closes popup on close button click', async () => {
    const mockRestaurants = [
        { business_id: 1, latitude: 40.7128, longitude: -74.006 }
      ];
  
      axios.get.mockResolvedValueOnce({ data: mockRestaurants });
  
      render(<Restaurants />);
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    
    const marker = screen.getByText('RestaurantIcon');
    marker.click();

    await waitFor(() => {
      const closeButton = screen.getByText('Close');
      closeButton.click();
    });
  });
});
