import React, { useContext, useEffect, useRef } from 'react';
import { StadiumContext } from '../context/StadiumContext';

let incidentCounter = 0;
const generateId = () => `inc-rule-${Date.now()}-${incidentCounter++}`;

export const RuleEngine = () => {
  const { zones, incidents, setIncidents } = useContext(StadiumContext);
  const triggeredZones = useRef(new Set());

  useEffect(() => {
    const newIncidents = [];
    
    zones.forEach(zone => {
      const isCritical = zone.occupancy > 85;
      const zoneKey = `${zone.name}-critical`;
      
      if (isCritical && !triggeredZones.current.has(zoneKey)) {
        // Check if there's already an active incident for this zone
        const existingIncident = incidents.find(
          inc => inc.zone === zone.name && inc.type === 'critical_occupancy' && !inc.resolved
        );
        
        if (!existingIncident) {
          triggeredZones.current.add(zoneKey);
          newIncidents.push({
            id: generateId(),
            zone: zone.name,
            type: 'critical_occupancy',
            severity: 'critical',
            message: `Zone ${zone.name} is at ${zone.occupancy}% capacity. Immediate action required.`,
            assigned: 'Staff Alpha',
            timestamp: new Date().toISOString(),
            acknowledged: false
          });
        }
      } else if (!isCritical) {
        // Remove from triggered when occupancy drops
        triggeredZones.current.delete(zoneKey);
      }
      
      // Warning level incidents (70-85%)
      const isWarning = zone.occupancy > 70 && zone.occupancy <= 85;
      const warningKey = `${zone.name}-warning`;
      
      if (isWarning && !triggeredZones.current.has(warningKey)) {
        const existingWarning = incidents.find(
          inc => inc.zone === zone.name && inc.type === 'warning_occupancy' && !inc.resolved
        );
        
        if (!existingWarning) {
          triggeredZones.current.add(warningKey);
          newIncidents.push({
            id: generateId(),
            zone: zone.name,
            type: 'warning_occupancy',
            severity: 'warning',
            message: `Zone ${zone.name} approaching capacity at ${zone.occupancy}%. Monitor closely.`,
            assigned: 'Staff Beta',
            timestamp: new Date().toISOString(),
            acknowledged: false
          });
        }
      } else if (!isWarning) {
        triggeredZones.current.delete(warningKey);
      }
    });

    if (newIncidents.length > 0) {
      setIncidents(prev => [...newIncidents, ...prev]);
    }
  }, [zones, incidents, setIncidents]);

  return null;
};