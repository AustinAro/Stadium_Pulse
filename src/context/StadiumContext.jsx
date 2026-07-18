import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { generateZoneData } from '../data/mockDataEngine';

export const StadiumContext = createContext();

export const generateAIInsights = (zones) => {
  if (!zones || zones.length === 0) return null;
  const sorted = [...zones].sort((a, b) => b.occupancy - a.occupancy);
  const peakZone = sorted[0];
  const lowestZone = sorted[sorted.length - 1];
  
  const highOccupancyCount = zones.filter(z => z.occupancy > 80).length;
  let crowdFlowRisk = "LOW";
  let riskColor = "text-green-400";
  if (highOccupancyCount >= 3) {
    crowdFlowRisk = "HIGH - Surge Bottleneck";
    riskColor = "text-red-400";
  } else if (highOccupancyCount >= 1) {
    crowdFlowRisk = "MEDIUM - Localized Surge";
    riskColor = "text-yellow-400";
  }

  return {
    predictedPeak: `${peakZone.name} (Currently ${peakZone.occupancy}% capacity)`,
    recommendedAction: `Deploy extra personnel to ${peakZone.name} for flow management.`,
    recommendedZone: peakZone.name,
    crowdFlowRisk,
    riskColor,
    resourceOptimization: `Reroute resources from ${lowestZone.name} (${lowestZone.occupancy}% capacity) to ${peakZone.name}.`
  };
};

export const StadiumProvider = ({ children }) => {
  const [zones, setZones] = useState(generateZoneData());
  const [incidents, setIncidents] = useState([]);
  const [focusedZoneName, setFocusedZoneName] = useState(null);
  const coordinator = "Austin Aro A.";

  // Update zones every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(generateZoneData());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Function to acknowledge/resolve an incident
  const acknowledgeIncident = useCallback((incidentId) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId ? { ...inc, acknowledged: true, acknowledgedAt: new Date().toISOString() } : inc
    ));
  }, []);

  const resolveIncident = useCallback((incidentId) => {
    setIncidents(prev => prev.filter(inc => inc.id !== incidentId));
  }, []);

  const dispatchStaff = useCallback((zoneName, staffName = "Staff Alpha") => {
    setIncidents(prev => {
      // Check if there's already an active action/incident of this type
      const exists = prev.some(inc => inc.zone === zoneName && inc.type === 'dispatch_action' && !inc.resolved);
      if (exists) return prev;

      return [
        {
          id: Date.now() + Math.random(),
          zone: zoneName,
          type: 'dispatch_action',
          severity: 'warning',
          message: `GenAI Dispatch: ${staffName} dispatched to ${zoneName} for peak mitigation.`,
          assigned: staffName,
          timestamp: new Date().toISOString(),
          acknowledged: true,
          resolved: false
        },
        ...prev
      ];
    });
  }, []);

  const aiInsights = useMemo(() => generateAIInsights(zones), [zones]);

  const value = { 
    zones, 
    incidents, 
    setIncidents,
    acknowledgeIncident,
    resolveIncident,
    dispatchStaff,
    aiInsights,
    focusedZoneName,
    setFocusedZoneName,
    coordinator 
  };
  
  return <StadiumContext.Provider value={value}>{children}</StadiumContext.Provider>;
};