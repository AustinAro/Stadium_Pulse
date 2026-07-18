import React from 'react';
import { render, screen } from '@testing-library/react';
import { StadiumContext } from '../context/StadiumContext';
import { MetricCard } from './MetricCard';
import { describe, it, expect } from 'vitest';

describe('MetricCard Component', () => {
  const mockContext = {
    incidents: [],
    focusedZoneName: 'VIP Lounge'
  };

  const mockZone = {
    id: 1,
    name: 'VIP Lounge',
    occupancy: 45,
    queueTime: 8
  };

  it('renders zone details and is highlighted when focused', () => {
    render(
      <StadiumContext.Provider value={mockContext}>
        <MetricCard zone={mockZone} />
      </StadiumContext.Provider>
    );

    expect(screen.getByText('VIP Lounge')).toBeDefined();
    expect(screen.getByText('45%')).toBeDefined();
    expect(screen.getByText('8')).toBeDefined();
  });
});
