import React from 'react';
import { render } from '@testing-library/react';
import { StadiumContext } from '../context/StadiumContext';
import { RuleEngine } from './RuleEngine';
import { describe, it, expect, vi } from 'vitest';

describe('RuleEngine Component', () => {
  it('triggers critical occupancy alert when occupancy exceeds 85%', () => {
    const mockSetIncidents = vi.fn();
    const mockContext = {
      zones: [{ id: 1, name: 'North Gate', occupancy: 90, queueTime: 10 }],
      incidents: [],
      setIncidents: mockSetIncidents
    };

    render(
      <StadiumContext.Provider value={mockContext}>
        <RuleEngine />
      </StadiumContext.Provider>
    );

    expect(mockSetIncidents).toHaveBeenCalled();
  });
});
