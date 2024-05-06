import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Intro from '../src/HomePage/Intro'; 

vi.mock('axios');
const navigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate
}));

describe('Intro Component', () => {
    beforeEach(() => {
        navigate.mockClear();
        axios.get.mockClear();
      });
  it('updates zip code on user input', () => {
    render(<Intro />);
    const input = screen.getByPlaceholderText('Enter zip code');
    fireEvent.change(input, { target: { value: '12345' } });
    expect(input.value).toBe('12345');
  });

  it('displays error when zip code is invalid', async () => {
    render(<Intro />);
    const input = screen.getByPlaceholderText('Enter zip code');
    const button = screen.getByText('Search');
    fireEvent.change(input, { target: { value: '123' } }); // Invalid zip code
    fireEvent.click(button);
    expect(await screen.findByText('Please enter a valid 5-digit zip code.')).toBeInTheDocument();
  });

  it('displays error when zip code is empty', async () => {
    render(<Intro />);
    const input = screen.getByPlaceholderText('Enter zip code');
    const button = screen.getByText('Search');
    fireEvent.change(input, { target: { value: '' } }); //empty
    fireEvent.click(button);
    expect(await screen.findByText('Zip code cannot be empty.')).toBeInTheDocument();
  });

  it('navigates to the home page on successful API response', async () => {
    axios.get.mockResolvedValue({ data: { longitude: -74.0060, latitude: 40.7128 } });

    render(<Intro />);
    const input = screen.getByPlaceholderText('Enter zip code');
    fireEvent.change(input, { target: { value: '10001' } });
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('/home', { state: { coordinates: { longitude: -74.0060, latitude: 40.7128 } } });
      }); });

  it('shows an error message if the API call fails', async () => {
    axios.get.mockRejectedValue(new Error('API call failed'));
    render(<Intro />);
    const input = screen.getByPlaceholderText('Enter zip code');
    fireEvent.change(input, { target: { value: '10001' } });
    fireEvent.click(screen.getByText('Search'));
    await waitFor(() => {
        expect(screen.getByText('Failed to fetch coordinates. Please try again.')).toBeInTheDocument();
      });
    });
});
