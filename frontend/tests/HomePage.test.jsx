import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/HomePage/HomePage';
import { renderToDom } from '../src/HomePage/HomePage'; // Adjust the import path as necessary

// Mock react-dom/client
vi.mock('react-dom/client', () => {
  return {
    createRoot: vi.fn(() => ({
      render: vi.fn()
    }))
  };
});

// Mock react-router-dom with a custom location state
vi.mock('react-router-dom', () => {
  const originalModule = vi.importActual('react-router-dom'); // Import the actual module
  return {
    ...originalModule, 
    useLocation: vi.fn(() => ({
      pathname: '/home',
      state: { coordinates: { lat: 40.7128, lng: -74.0060 } }
    })),
    Link: ({ children, to }) => React.createElement('a', { href: to }, children)
  };
});

// Mock the Navbar component
vi.mock('../src/HomePage/Navbar', () => ({
  __esModule: true,
  default: () => <div>Navbar mock</div>
}));

// Mock the Map component
vi.mock('../src/HomePage/Map', () => ({
  __esModule: true,
  default: ({ initialCoordinates }) => (
    <div>Map mock, Coordinates: {initialCoordinates.lat}, {initialCoordinates.lng}</div>
  )
}));

import * as ReactDOMClient from 'react-dom/client';

describe('renderToDom function', () => {
  it('should render App to the provided DOM container', () => {
    const fakeContainer = document.createElement('div'); // Create a fake container

    renderToDom(fakeContainer);

    expect(ReactDOMClient.createRoot).toHaveBeenCalledWith(fakeContainer);

    const mockRootInstance = ReactDOMClient.createRoot.mock.results[0].value;

    expect(mockRootInstance.render).toHaveBeenCalled();
  });
});

describe('HomePage Component', () => {
  it('renders with Navbar and Map components', () => {
    render(<App />);

    // Expectations to verify if Navbar is rendered
    expect(screen.getByText('Navbar mock')).toBeInTheDocument();

    // Expectations to verify if Map is rendered with the correct coordinates
    expect(screen.getByText(/Map mock, Coordinates: 40.7128/)).toBeInTheDocument();
  });

});
