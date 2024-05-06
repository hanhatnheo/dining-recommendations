import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { Markers } from '../src/HomePage/Markers';
import axios from 'axios';
import { UseMap } from '../src/HomePage/UseMap';
import { useMap } from "react-map-gl";

vi.mock('axios', () => {
    return {
        default: {
            get: vi.fn(),
            response: {
                use: vi.fn(),
                eject: vi.fn(),
              },
        }
    }
});
vi.mock('react-map-gl', () => ({
  useMap: vi.fn(),
  Marker: vi.fn(({ children, onClick, latitude, longitude }) => <div data-lat={latitude} data-lng={longitude} onClick={onClick}>{children}</div>), 
  Popup: vi.fn(({ children, onClose }) => <div>{children}<button onClick={onClose}>Close</button></div>)   
}));

vi.mock('../src/HomePage/UseMap');

vi.mock('../src/HomePage/MarkerIcon', () => ({
    RestaurantIcon: vi.fn(() => <div data-testid="restaurant-icon">RestaurantIcon</div>),
    MarkerIcon:  vi.fn(() => <div data-testid="marker-icon">MarkerIcon</div>)
}));


describe('Markers', () => {
  let mapMock;
  let body;

  beforeAll(async () => {
    axios.get.mockResolvedValue({
      data: [{ id: 1, name: 'Test Restaurant', rating: 5 }]
    });

    const response = await axios.get('http://localhost:8080/recommendation');
    body = response.data;
    console.log(body);
  });

  beforeEach(() => {
    mapMock = {
      getBounds: vi.fn().mockReturnValue({
        toArray: () => [[37.7749, -122.4194], [40.7128, -74.006]],
      }),
      on: vi.fn(),
      off: vi.fn(),
      getZoom: vi.fn(() => 8),
    };

    useMap.mockReturnValue({ current: mapMock });
    UseMap.mockReturnValue({
      bounds: {
        toArray: () => [[37.7749, -122.4194], [40.7128, -74.006]]
      },
      isMoving: false
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches data on mount and handles marker clicks', async () => {
    const setAttractionsDetails = vi.fn();
    const { getByText } = render(<Markers attractionsDetails={[]} setAttractionsDetails={setAttractionsDetails} />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
})


  it('renders restaurant markers on the map', async () => {
    const setAttractionsDetails = vi.fn();
    const mockRestaurants = [
      { business_id: 1, latitude: 40.7128, longitude: -74.006 },
      { business_id: 2, latitude: 37.7749, longitude: -122.4194 },
    ];

    axios.get.mockResolvedValueOnce({ data: mockRestaurants });

    render(<Markers attractionDetails={mockRestaurants} setAttractionsDetails={setAttractionsDetails}/>);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/attractions/current'), {
        mode: "no-cors",
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

    const setAttractionsDetails = vi.fn();
    const showRestaurant = vi.fn()
    const mockMarkers = [
        { business_id: 1, latitude: 40.7128, longitude: -74.006 },
        { business_id: 2, latitude: 37.7749, longitude: -122.4194 },
      ];
  
      axios.get.mockResolvedValueOnce({ data: mockMarkers });
  
      render(<Markers attractionDetails={mockMarkers} setAttractionsDetails={setAttractionsDetails}/>);
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    
    screen.debug();
    const markers = screen.getAllByTestId('marker-icon');
    expect(markers).toHaveLength(2);
    fireEvent.click(markers.at(0));

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });

    const mockData = { data: [{ id: 1, name: 'Test Restaurant', rating: 5 }] };
    axios.get.mockResolvedValueOnce(mockData);
    await showRestaurant();

    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('restaurant_recommendations/id'), {
          mode: "no-cors",
          params: {
            id: undefined
          }
        });
      });

  
  });

  it('closes popup on close button click', async () => {
    const setAttractionsDetails = vi.fn();
    const mockRestaurants = [
        { business_id: 1, latitude: 40.7128, longitude: -74.006 }
      ];
  
      axios.get.mockResolvedValueOnce({ data: mockRestaurants });
  
      render(<Markers attractionDetails={mockRestaurants} setAttractionsDetails={setAttractionsDetails}/>);
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalled();
      });
    
    const marker = screen.getByText('MarkerIcon');
    marker.click();

    await waitFor(() => {
      const closeButton = screen.getByText('Close');
      closeButton.click();
    });
  });
});
