import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { IncidentItem } from './IncidentItem';

describe('IncidentItem Component', () => {
  const mockIncident = {
    id: 1,
    zone: 'VIP Lounge',
    type: 'critical_occupancy',
    severity: 'critical',
    message: 'Test incident message',
    assigned: 'Staff Alpha',
    timestamp: new Date().toISOString(),
    acknowledged: false
  };

  it('renders incident details correctly', () => {
    render(<IncidentItem incident={mockIncident} onAcknowledge={vi.fn()} onResolve={vi.fn()} />);

    expect(screen.getByText('VIP Lounge')).toBeDefined();
    expect(screen.getByText('Test incident message')).toBeDefined();
    expect(screen.getByText('CRITICAL')).toBeDefined();
  });
});
