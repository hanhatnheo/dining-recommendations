import React from 'react';
import { beforeEach, describe, it, vi } from 'vitest';
import axios from 'axios';
import { render, screen, fireEvent } from '@testing-library/react';
import LeaderboardsPage from '../src/HomePage/LeaderboardsPage';
import { MemoryRouter } from 'react-router-dom';

vi.mock('axios');

describe('LeaderboardsPage', () => {
    beforeEach(() => {
      axios.get.mockClear();
    });
  
    it('fetches and displays recommended restaurants on render', async () => {
      const mockData = {
        data: [{ id: 1, BusinessID: 1, RestaurantName: 'Pizza Place', TotalReviews: 150, AverageRating: 4.5, ZipCode: '12345', Address: '123 Pizza Street' }]
      };
      axios.get.mockResolvedValueOnce(mockData);
  
      render(<MemoryRouter><LeaderboardsPage /></MemoryRouter>);
  
      await screen.findByText('Pizza Place'); 
      expect(screen.getByText('Pizza Place')).toBeInTheDocument();
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('all_restaurants/zip_code/best'));
    });

    it('updates data based on zip code filter and button click for most popular restaurants', async () => {
        
        render(<MemoryRouter><LeaderboardsPage /></MemoryRouter>);
      
        const zipInput = screen.getByTestId('zip-input');
        fireEvent.change(zipInput, { target: { value: '67890' } });
        expect(zipInput.value).toBe('67890');
      
        const searchButton = screen.getByTestId('search-button');
        fireEvent.click(searchButton);
      
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('most_popular_restaurants?zip_code=67890'));
      });

    it('updates data based on zip code filter and button click for category', async () => {
        
        render(<MemoryRouter><LeaderboardsPage /></MemoryRouter>);
      
        const zipInput = screen.getByTestId('category-zip');
        fireEvent.change(zipInput, { target: { value: '67890' } });
        expect(zipInput.value).toBe('67890');
      
        const searchButton = screen.getByTestId('category-button');
        fireEvent.click(searchButton);
      
        expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('best_restaurants_per_category?zip_code=67890'));
      });

  });