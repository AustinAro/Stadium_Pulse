import { describe, it, expect } from 'vitest';
import { generateAIInsights } from './StadiumContext';

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
    expect(insights.resourceOptimization).toContain('Gate C'); // least busy is C
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
