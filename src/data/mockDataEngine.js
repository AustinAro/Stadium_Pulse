// src/data/mockDataEngine.js
export const zoneNames = [
  'North Gate',
  'East Gate',
  'South Gate',
  'West Gate',
  'VIP Lounge',
  'Press Box',
  'Family Zone',
  'Supporters Section',
  'Concourse A',
  'Concourse B',
  'Food Court',
  'Merchandise'
];

export const zoneShortcuts = {
  'North Gate': 'N',
  'East Gate': 'E',
  'South Gate': 'S',
  'West Gate': 'W',
  'VIP Lounge': 'V',
  'Press Box': 'P',
  'Family Zone': 'F',
  'Supporters Section': 'U',
  'Concourse A': 'A',
  'Concourse B': 'B',
  'Food Court': 'C',
  Merchandise: 'M'
};

export const generateZoneData = () => {
  return zoneNames.map((name, i) => {
    const baseOccupancy = [75, 65, 70, 60, 30, 20, 55, 85, 45, 40, 60, 35][i];
    const variance = Math.floor(Math.random() * 30) - 15;
    const occupancy = Math.max(5, Math.min(99, baseOccupancy + variance));
    const baseQueue = Math.floor(occupancy / 5) + Math.floor(Math.random() * 10);
    const queueTime = Math.max(0, Math.min(35, baseQueue));
    return { id: i + 1, name, occupancy, queueTime };
  });
};

export const aiInsights = [
  {
    type: 'prediction',
    icon: '🔮',
    text: 'Supporters Section will hit 98% in 8 min — pre-position Staff Gamma at Gate 3',
    severity: 'high'
  },
  {
    type: 'flow',
    icon: '🌊',
    text: 'Crowd convergence detected at Concourse A/B junction — deploy bidirectional barriers',
    severity: 'high'
  },
  {
    type: 'optimization',
    icon: '⚡',
    text: 'VIP Lounge at 22% — reassign 3 staff to Family Zone (67% and rising)',
    severity: 'medium'
  },
  {
    type: 'prediction',
    icon: '🔮',
    text: 'Food Court queue will exceed 25 min by 19:45 — open Express Lane 2',
    severity: 'medium'
  },
  {
    type: 'safety',
    icon: '🛡️',
    text: 'Press Box evacuation route blocked by equipment — clear immediately',
    severity: 'critical'
  },
  {
    type: 'flow',
    icon: '🌊',
    text: 'North/East gate correlation: 0.87 — synchronized entry surge expected at half-time',
    severity: 'medium'
  }
];
