import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Navbar from '../src/HomePage/Navbar';

describe('Navbar', () => {
  it('renders the brand name', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Explore&Eat')).toBeDefined();
  });

  it('renders the navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Map')).toBeDefined();
    expect(screen.getByText('Search Restaurants')).toBeDefined();
    expect(screen.getByText('Leaderboards')).toBeDefined();
  });

  it('has correct navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Map')).toHaveAttribute('href', '/home');
    expect(screen.getByText('Search Restaurants')).toHaveAttribute('href', '/all_restaurants');
    expect(screen.getByText('Leaderboards')).toHaveAttribute('href', '/leaderboards');
  });
});