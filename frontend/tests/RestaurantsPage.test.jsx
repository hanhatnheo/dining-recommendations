import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import RestaurantsPage from '../src/HomePage/RestaurantsPage';
import { MemoryRouter } from 'react-router-dom';

// Mock fetch globally
global.fetch = vi.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve([{ id: '1', name: 'Eiffel Tower', type: 'Monument' }]) 
  })
);

describe('RestaurantsPage', () => {
    beforeEach(() => {
      fetch.mockClear();
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          name: 'Test Restaurant',
          rating: 4,
          address: '123 Test St',
        })
      });
    });
  
    it('renders and fetches data correctly', async () => {
      render(<MemoryRouter><RestaurantsPage /></MemoryRouter>);
  
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(3); // Check if fetch was called
      });
  
      // Ensure some text from the page is present
      expect(screen.getByText('Search for Restaurants')).toBeInTheDocument();
    });
  
    it('handles search correctly', async () => {
      render(<MemoryRouter><RestaurantsPage /></MemoryRouter>);
      const searchButton = screen.getByRole('button', { name: /search/i });
      fireEvent.click(searchButton);
  
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('all_restaurants'));
      });
    });

    it('fetches random restaurant and attraction on initialization', async () => {
        render(<MemoryRouter><RestaurantsPage /></MemoryRouter>);
      
        await waitFor(() => {
          expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/random_restaurant`));
          expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/random_attraction`));
        });
      });

      it('updates input fields correctly', () => {
        render(<MemoryRouter><RestaurantsPage /></MemoryRouter>);
        const nameInput = screen.getByTestId('name-change');
        fireEvent.change(nameInput, { target: { value: 'New Name' } });
        expect(nameInput.value).toBe('New Name');
      });

      it('updates zip input fields correctly', () => {
        render(<MemoryRouter><RestaurantsPage /></MemoryRouter>);
        const zipInput = screen.getByTestId('zip-input');
        fireEvent.change(zipInput, { target: { value: "19104" } });
        expect(zipInput.value).toBe("19104");
      });

      it('updates sliders correctly', () => {
        render(<MemoryRouter><RestaurantsPage /></MemoryRouter>);
        const star = screen.getByTestId('stars-slider');
        expect(star.value).toBe(undefined);
      });
      
      it('submits new search and updates table', async () => {
        fetch.mockResolvedValueOnce({
          json: () => Promise.resolve([
            { business_id: 1, name: 'New Restaurant', address: 'New Address', stars: 5 }
          ])
        });
      
        render(<MemoryRouter><RestaurantsPage /></MemoryRouter>);
        const searchButton = screen.getByRole('button', { name: /search/i });
        fireEvent.click(searchButton);
      
        await waitFor(() => {
          expect(fetch).toHaveBeenCalled();
        });
      });
      
  });
  
