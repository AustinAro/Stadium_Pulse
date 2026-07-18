import { describe, it, expect } from 'vitest';
import { generateZoneData, zoneNames } from './mockDataEngine';

describe('mockDataEngine', () => {
  it('should generate data for exactly 12 zones', () => {
    const data = generateZoneData();
    expect(data).toHaveLength(12);
  });

  it('should match the defined zone names', () => {
    const data = generateZoneData();
    data.forEach((zone, index) => {
      expect(zone.name).toBe(zoneNames[index]);
    });
  });

  it('should return valid numerical bounds for occupancy and queueTime', () => {
    const data = generateZoneData();
    data.forEach((zone) => {
      expect(zone.id).toBeTypeOf('number');
      expect(zone.occupancy).toBeGreaterThanOrEqual(5);
      expect(zone.occupancy).toBeLessThanOrEqual(99);
      expect(zone.queueTime).toBeGreaterThanOrEqual(0);
      expect(zone.queueTime).toBeLessThanOrEqual(35);
    });
  });
});
