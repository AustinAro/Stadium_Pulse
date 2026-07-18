import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { generateZoneData, aiInsights } from '../data/mockDataEngine';

export const StadiumContext = createContext();

export const StadiumProvider = ({ children }) => {
  const [zones, setZones] = useState(generateZoneData());
  const [incidents, setIncidents] = useState([]);
  const [insights, setInsights] = useState([]);
  const [dismissedInsights, setDismissedInsights] = useState(new Set());
  const coordinator = "Austin Aro A.";
  const triggeredZones = useRef(new Set());

  // Sound alerts
  const playAlert = useCallback((severity) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (severity === 'critical') {
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      // Double beep for critical
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.setValueAtTime(880, ctx.currentTime);
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.3);
      }, 200);
    } else if (severity === 'warning') {
      osc.frequency.setValueAtTime(660, ctx.currentTime); // E5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.frequency.setValueAtTime(523, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  }, []);

  // Update zones every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(generateZoneData());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rule Engine - detect incidents
  useEffect(() => {
    const newIncidents = [];
    
    zones.forEach(zone => {
      const isCritical = zone.occupancy > 85;
      const isWarning = zone.occupancy > 70 && zone.occupancy <= 85;
      const criticalKey = `${zone.name}-critical`;
      const warningKey = `${zone.name}-warning`;
      
      if (isCritical && !triggeredZones.current.has(criticalKey)) {
        const existing = incidents.find(inc => inc.zone === zone.name && inc.type === 'critical_occupancy' && !inc.resolved);
        if (!existing) {
          triggeredZones.current.add(criticalKey);
          newIncidents.push({
            id: Date.now() + Math.random(),
            zone: zone.name,
            type: 'critical_occupancy',
            severity: 'critical',
            message: `Zone ${zone.name} at ${zone.occupancy}% capacity. Immediate action required.`,
            assigned: 'Staff Alpha',
            timestamp: new Date().toISOString(),
            acknowledged: false
          });
          playAlert('critical');
        }
      } else if (!isCritical) {
        triggeredZones.current.delete(criticalKey);
      }
      
      if (isWarning && !triggeredZones.current.has(warningKey)) {
        const existing = incidents.find(inc => inc.zone === zone.name && inc.type === 'warning_occupancy' && !inc.resolved);
        if (!existing) {
          triggeredZones.current.add(warningKey);
          newIncidents.push({
            id: Date.now() + Math.random(),
            zone: zone.name,
            type: 'warning_occupancy',
            severity: 'warning',
            message: `Zone ${zone.name} approaching capacity at ${zone.occupancy}%. Monitor closely.`,
            assigned: 'Staff Beta',
            timestamp: new Date().toISOString(),
            acknowledged: false
          });
          playAlert('warning');
        }
      } else if (!isWarning) {
        triggeredZones.current.delete(warningKey);
      }
    });

    if (newIncidents.length > 0) {
      setIncidents(prev => [...newIncidents, ...prev]);
    }
  }, [zones, incidents, playAlert]);

  // AI Insights - rotate every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const available = aiInsights.filter(i => !dismissedInsights.has(i.text));
      if (available.length > 0) {
        const insight = available[Math.floor(Math.random() * available.length)];
        setInsights(prev => {
          if (prev.length >= 3) return [...prev.slice(1), { ...insight, id: Date.now() }];
          return [...prev, { ...insight, id: Date.now() }];
        });
      }
    }, 15000);
    
    // Initial insights
    setInsights(aiInsights.slice(0, 2).map((i, idx) => ({ ...i, id: idx })));
    return () => clearInterval(interval);
  }, [dismissedInsights]);

  const acknowledgeIncident = useCallback((incidentId) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === incidentId ? { ...inc, acknowledged: true, acknowledgedAt: new Date().toISOString() } : inc
    ));
  }, []);

  const resolveIncident = useCallback((incidentId) => {
    setIncidents(prev => prev.filter(inc => inc.id !== incidentId));
  }, []);

  const dismissInsight = useCallback((text) => {
    setDismissedInsights(prev => new Set([...prev, text]));
    setInsights(prev => prev.filter(i => i.text !== text));
  }, []);

  const value = { 
    zones, 
    incidents, 
    insights,
    setIncidents,
    acknowledgeIncident,
    resolveIncident,
    dismissInsight,
    coordinator 
  };
  
  return <StadiumContext.Provider value={value}>{children}</StadiumContext.Provider>;
};