import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkerIcon, RestaurantIcon } from '../src/HomePage/MarkerIcon';  
import svg from '../src/assets/restaurant-icon.svg';

describe('Icon Components', () => {
    it('renders the MarkerIcon correctly', () => {
      render(<MarkerIcon />);
      const svgElement = screen.getByLabelText("svg") 
      expect(svgElement).toBeInTheDocument();
      expect(svgElement).toHaveAttribute('stroke', '#3eb8db');
    });
  
    it('renders the RestaurantIcon with correct source', () => {
      const testSrc = svg;
      render(<RestaurantIcon src={svg} />);
      const imgElement = screen.getByRole('img', { name: 'Marker Icon' });
      expect(imgElement).toBeInTheDocument();
      expect(imgElement).toHaveAttribute('src', testSrc);
    });
  });
