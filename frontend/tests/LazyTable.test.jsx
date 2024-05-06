import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LazyTable from '../src/HomePage/LazyTable';

global.fetch = vi.fn();

  describe('LazyTable', () => {
    beforeEach(() => {
      fetch.mockClear();
      fetch.mockResolvedValue({
        json: () => Promise.resolve([
          { id: 1, name: 'Item 1', description: 'Description 1' },
          { id: 2, name: 'Item 2', description: 'Description 2' },
        ])
      });
    });
  
    it('loads data and renders table', async () => {
      const columns = [
        { headerName: 'Name', field: 'name' },
        { headerName: 'Description', field: 'description' }
      ];
  
      render(<LazyTable route="/test-route" columns={columns} defaultPageSize={10} rowsPerPageOptions={[5, 10, 25]} />);
  
      // Wait for the data to load
      await screen.findByText('Item 1');
  
      // Check that both items are displayed
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
  
      // Verify correct fetch call
      expect(fetch).toHaveBeenCalledWith('/test-route?page=1&page_size=10');
    });
  
    it('handles pagination correctly', async () => {
      const columns = [
        { headerName: 'Name', field: 'name' },
        { headerName: 'Description', field: 'description' }
      ];
  
      render(<LazyTable route="/test-route" columns={columns} defaultPageSize={10} rowsPerPageOptions={[5, 10, 25]} />);
  
      // Simulate changing page
      const nextPageButton = screen.getByRole('button', { name: /next page/i });
      fireEvent.click(nextPageButton);
  
      // Assert new fetch call
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/test-route?page=1&page_size=10');
      });
    });
  });
  