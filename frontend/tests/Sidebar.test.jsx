import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from '../src/HomePage/Sidebar';

describe('Sidebar component', () => {
  it('renders empty message when no attractions are provided', () => {
    render(<Sidebar attractionsDetails={[]} />);
    expect(screen.getByText('Click on attractions to see recommendations!')).toBeInTheDocument();
  });

  it('renders attractions and their recommendations when provided', () => {
    const attractionsDetails = [
      {
        attraction: {
          attraction_id: '1',
          name: 'Eiffel Tower',
          type: 'Monument'
        },
        recommendations: [
          {
            business_id: '101',
            name: 'Le Jules Verne',
            stars: 5,
            address: 'Second floor of Eiffel Tower'
          }
        ]
      }
    ];

    render(<Sidebar attractionsDetails={attractionsDetails} />);

    // Check for attraction details
    expect(screen.getByText('Eiffel Tower')).toBeInTheDocument();
    expect(screen.getByText('Type: Monument')).toBeInTheDocument();

    // Check for recommendations
    expect(screen.getByText('Recommended Restaurants:')).toBeInTheDocument();
    expect(screen.getByText('Le Jules Verne - 5 Stars')).toBeInTheDocument();
    expect(screen.getByText('Second floor of Eiffel Tower')).toBeInTheDocument();
  });

  it('displays a no recommendations message if recommendations are empty', () => {
    const attractionsDetails = [
      {
        attraction: {
          attraction_id: '1',
          name: 'Statue of Liberty',
          type: 'Monument'
        },
        recommendations: []
      }
    ];

    render(<Sidebar attractionsDetails={attractionsDetails} />);

    // Check for attraction
    expect(screen.getByText('Statue of Liberty')).toBeInTheDocument();
    expect(screen.getByText('Type: Monument')).toBeInTheDocument();

    // Check for no recommendations message
    expect(screen.getByText('No recommendations available.')).toBeInTheDocument();
  });
});
