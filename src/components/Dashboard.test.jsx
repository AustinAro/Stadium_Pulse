import React from 'react';
import { render, screen } from '@testing-library/react';
import { StadiumContext } from '../context/StadiumContext';
import { Dashboard } from './Dashboard';
import { describe, it, expect, vi } from 'vitest';

describe('Dashboard Component', () => {
  const mockContext = {
    zones: [
      { id: 1, name: 'North Gate', occupancy: 40, queueTime: 5 }
    ],
    coordinator: 'Austin Aro A.',
    incidents: [],
    acknowledgeIncident: vi.fn(),
    resolveIncident: vi.fn(),
    dispatchStaff: vi.fn(),
    aiInsights: {
      predictedPeak: 'North Gate (Currently 40% capacity)',
      recommendedAction: 'Deploy extra personnel',
      recommendedZone: 'North Gate',
      crowdFlowRisk: 'LOW',
      riskColor: 'text-green-400',
      resourceOptimization: 'Reroute resources'
    },
    focusedZoneName: null,
    setFocusedZoneName: vi.fn()
  };

  it('renders Dashboard header and AI insights panels', () => {
    render(
      <StadiumContext.Provider value={mockContext}>
        <Dashboard />
      </StadiumContext.Provider>
    );

    expect(screen.getByText('StadiumPulse')).toBeDefined();
    expect(screen.getByText('GenAI Operational Copilot')).toBeDefined();
  });
});
