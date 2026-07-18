import React, { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { generateAIInsights, StadiumProvider, StadiumContext } from './StadiumContext';

describe('generateAIInsights', () => {
  it('should return null if zones are empty', () => {
    expect(generateAIInsights([])).toBeNull();
    expect(generateAIInsights(null)).toBeNull();
  });

  it('should correctly predict the busiest zone as peak occupancy', () => {
    const mockZones = [
      { name: 'Gate A', occupancy: 40, queueTime: 5 },
      { name: 'Gate B', occupancy: 95, queueTime: 25 },
      { name: 'Gate C', occupancy: 10, queueTime: 2 }
    ];
    
    const insights = generateAIInsights(mockZones);
    expect(insights).not.toBeNull();
    expect(insights.predictedPeak).toContain('Gate B');
    expect(insights.recommendedZone).toBe('Gate B');
    expect(insights.resourceOptimization).toContain('Gate C');
  });

  it('should set risk level to HIGH if multiple zones exceed 80%', () => {
    const mockZones = [
      { name: 'Gate A', occupancy: 85, queueTime: 10 },
      { name: 'Gate B', occupancy: 90, queueTime: 20 },
      { name: 'Gate C', occupancy: 95, queueTime: 30 }
    ];
    
    const insights = generateAIInsights(mockZones);
    expect(insights.crowdFlowRisk).toContain('HIGH');
    expect(insights.riskColor).toBe('text-red-400');
  });
});

const TestComponent = () => {
  const { incidents, acknowledgeIncident, resolveIncident, dispatchStaff, zones } = useContext(StadiumContext);
  return (
    <div>
      <div data-testid="zones-count">{zones.length}</div>
      <div data-testid="incidents-count">{incidents.length}</div>
      <button onClick={() => dispatchStaff('North Gate')} data-testid="dispatch-btn">Dispatch</button>
      {incidents.map(inc => (
        <div key={inc.id}>
          <span data-testid="inc-zone">{inc.zone}</span>
          <span data-testid="inc-ack">{inc.acknowledged ? 'Yes' : 'No'}</span>
          <button onClick={() => acknowledgeIncident(inc.id)} data-testid="ack-btn">Ack</button>
          <button onClick={() => resolveIncident(inc.id)} data-testid="resolve-btn">Resolve</button>
        </div>
      ))}
    </div>
  );
};

describe('StadiumProvider Component Context', () => {
  it('should initialize zones and allow dispatches, acknowledgement, and resolution', () => {
    render(
      <StadiumProvider>
        <TestComponent />
      </StadiumProvider>
    );

    expect(screen.getByTestId('zones-count').textContent).toBe('12');
    expect(screen.getByTestId('incidents-count').textContent).toBe('0');

    // Click dispatch
    fireEvent.click(screen.getByTestId('dispatch-btn'));
    expect(screen.getByTestId('incidents-count').textContent).toBe('1');
    expect(screen.getByTestId('inc-zone').textContent).toBe('North Gate');
    expect(screen.getByTestId('inc-ack').textContent).toBe('Yes');

    // Acknowledge incident
    fireEvent.click(screen.getByTestId('ack-btn'));
    expect(screen.getByTestId('inc-ack').textContent).toBe('Yes');
    
    // Resolve incident
    fireEvent.click(screen.getByTestId('resolve-btn'));
    expect(screen.getByTestId('incidents-count').textContent).toBe('0');
  });
});
