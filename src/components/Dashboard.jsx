import React, { useContext, useState, useEffect, useRef } from 'react';
import { StadiumContext } from '../context/StadiumContext';
import { MetricCard } from './MetricCard';
import { RuleEngine } from './RuleEngine';
import { IncidentItem } from './IncidentItem';

/**
 * Synthesizes and plays a warning or siren tone programmatically using Web Audio API.
 * @param {string} severity - Severity of the incident ('critical' or 'warning').
 * @returns {void}
 */
const playAlertSound = (severity = 'critical') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (severity === 'critical') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + 0.35); // A4

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(554.37, ctx.currentTime); // C#5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.38);
    }
  } catch (error) {
    // Audio playback blocked by browser guest settings or autoplay policy
  }
};

// Spatial stadium minimap sector layout
const StadiumMinimap = ({ zones, focusedZoneName, setFocusedZoneName }) => {
  const layout = [
    { name: 'North Gate', gridArea: 'col-start-2 col-end-4 row-start-1' },
    { name: 'VIP Lounge', gridArea: 'col-start-2 row-start-2' },
    { name: 'Press Box', gridArea: 'col-start-3 row-start-2' },
    { name: 'East Gate', gridArea: 'col-start-4 row-start-2 row-end-4' },
    { name: 'West Gate', gridArea: 'col-start-1 row-start-2 row-end-4' },
    { name: 'Family Zone', gridArea: 'col-start-2 row-start-3' },
    { name: 'Supporters Section', gridArea: 'col-start-3 row-start-3' },
    { name: 'South Gate', gridArea: 'col-start-2 col-end-4 row-start-4' },
    { name: 'Concourse A', gridArea: 'col-start-1 row-start-4' },
    { name: 'Concourse B', gridArea: 'col-start-4 row-start-4' },
    { name: 'Food Court', gridArea: 'col-start-2 row-start-5' },
    { name: 'Merchandise', gridArea: 'col-start-3 row-start-5' }
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-md font-bold text-text-primary mb-1 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-accent animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Stadium Spatial Minimap
        </h3>
        <p className="text-xs text-text-muted mb-4">
          Click sectors to locate and focus. Hover to preview.
        </p>
      </div>

      <div
        className="grid grid-cols-4 grid-rows-5 gap-2 bg-slate-950/60 p-4 rounded-xl border border-border/50 w-full aspect-square max-w-[240px] mx-auto select-none"
        role="img"
        aria-label="Interactive map representation of stadium sectors"
      >
        {layout.map((item) => {
          const zoneData = zones.find((z) => z.name === item.name) || { occupancy: 0 };
          const isFocused = focusedZoneName === item.name;

          let colorClass = 'bg-green-500/10 border-green-500/30 text-green-400';
          if (zoneData.occupancy > 85) {
            colorClass = 'bg-red-500/20 border-red-500/40 text-red-400';
          } else if (zoneData.occupancy > 70) {
            colorClass = 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
          }

          return (
            <button
              key={item.name}
              onClick={() => {
                setFocusedZoneName(item.name);
                const el = document.getElementById(`zone-card-${zoneData.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              onMouseEnter={() => setFocusedZoneName(item.name)}
              aria-label={`Inspect ${item.name}. Capacity is ${zoneData.occupancy} percent.`}
              className={`${item.gridArea} ${colorClass} border rounded-lg p-0.5 text-[9px] font-bold transition-all duration-200 flex flex-col justify-center items-center gap-0.5 hover:scale-105 hover:bg-opacity-30 cursor-pointer ${
                isFocused ? 'ring-2 ring-accent border-accent shadow-glow' : ''
              }`}
            >
              <span className="truncate max-w-[55px]">
                {item.name.replace(' Section', '').replace(' Zone', '')}
              </span>
              <span className="text-[8px] font-bold opacity-90">{zoneData.occupancy}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const {
    zones,
    coordinator,
    incidents,
    acknowledgeIncident,
    resolveIncident,
    dispatchStaff,
    aiInsights,
    focusedZoneName,
    setFocusedZoneName
  } = useContext(StadiumContext);

  const [isMuted, setIsMuted] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const prevCountRef = useRef(0);

  const criticalIncidents = incidents.filter((i) => i.severity === 'critical' && !i.resolved);
  const warningIncidents = incidents.filter((i) => i.severity === 'warning' && !i.resolved);
  const activeIncidents = [...criticalIncidents, ...warningIncidents];

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Sound Alert Trigger logic
  useEffect(() => {
    const activeUnacknowledged = incidents.filter((i) => !i.acknowledged && !i.resolved);
    if (activeUnacknowledged.length > prevCountRef.current) {
      if (!isMuted) {
        const hasCritical = activeUnacknowledged.some((i) => i.severity === 'critical');
        playAlertSound(hasCritical ? 'critical' : 'warning');
      }
    }
    prevCountRef.current = activeUnacknowledged.length;
  }, [incidents, isMuted]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const keyMap = {
      n: 'North Gate',
      e: 'East Gate',
      g: 'South Gate',
      w: 'West Gate',
      v: 'VIP Lounge',
      p: 'Press Box',
      y: 'Family Zone',
      s: 'Supporters Section',
      a: 'Concourse A',
      b: 'Concourse B',
      f: 'Food Court',
      m: 'Merchandise'
    };

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();

      if (key === '?') {
        setShowShortcutsHelp((prev) => !prev);
        return;
      }

      if (key === 'escape') {
        setFocusedZoneName(null);
        triggerToast('Cleared active selection focus');
        return;
      }

      if (key === ' ' || key === 'spacebar') {
        e.preventDefault();
        if (aiInsights && aiInsights.recommendedZone) {
          dispatchStaff(aiInsights.recommendedZone);
          triggerToast(`GenAI Auto-Dispatch to ${aiInsights.recommendedZone}`);
        }
        return;
      }

      const targetZone = keyMap[key];
      if (targetZone) {
        setFocusedZoneName(targetZone);
        triggerToast(`Focused Zone: ${targetZone}`);

        const zoneObj = zones.find((z) => z.name === targetZone);
        if (zoneObj) {
          const cardEl = document.getElementById(`zone-card-${zoneObj.id}`);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zones, aiInsights, dispatchStaff, setFocusedZoneName]);

  const handleAutoDispatch = () => {
    if (aiInsights && aiInsights.recommendedZone) {
      dispatchStaff(aiInsights.recommendedZone);
      triggerToast(`GenAI Auto-Dispatch to ${aiInsights.recommendedZone}`);
    }
  };

  // Compile and download CSV incident report
  const exportIncidentsToCSV = () => {
    if (incidents.length === 0) {
      triggerToast('No logged incidents to export.');
      return;
    }

    const headers = [
      'Incident ID',
      'Sector Zone',
      'Alert Type',
      'Severity',
      'Message Description',
      'Assigned Staff',
      'Timestamp',
      'Acknowledged'
    ];
    const rows = incidents.map((inc) => [
      inc.id,
      `"${inc.zone}"`,
      `"${inc.type}"`,
      `"${inc.severity}"`,
      `"${inc.message.replace(/"/g, '""')}"`,
      `"${inc.assigned}"`,
      inc.timestamp,
      inc.acknowledged ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `stadiumpulse_incidents_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Exported operations report to CSV');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6" role="main">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card bg-opacity-50 backdrop-blur-sm rounded-2xl border border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-3">
            <span className="relative">
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14D003 6.001 14.986 9 15 10c0 2-.5 5-2.343 8.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </span>
            StadiumPulse
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Real-time stadium operations & crowd intelligence
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Audio Mute Button */}
          <button
            onClick={() => {
              setIsMuted((prev) => !prev);
              triggerToast(isMuted ? 'Audio alerts enabled' : 'Audio alerts muted');
            }}
            aria-label={isMuted ? 'Unmute warning sound alerts' : 'Mute warning sound alerts'}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-text-secondary hover:text-white transition-colors hover:border-border-light cursor-pointer select-none"
            title={isMuted ? 'Unmute sound alerts' : 'Mute sound alerts'}
          >
            {isMuted ? (
              <svg
                className="w-4 h-4 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-accent animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z"
                />
              </svg>
            )}
            <span className="text-xs font-semibold uppercase">
              {isMuted ? 'Muted' : 'Sound On'}
            </span>
          </button>

          {/* Shortcut Help Button */}
          <button
            onClick={() => setShowShortcutsHelp(true)}
            aria-label="View operational keyboard shortcuts help documentation"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg text-text-secondary hover:text-white transition-colors hover:border-border-light cursor-pointer select-none"
            title="View keyboard shortcuts help"
          >
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-semibold">HELP (?)</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full select-none">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-xs font-medium text-green-400">LIVE FEED</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg select-none">
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span
              className="text-sm text-text-secondary font-medium"
              aria-label={`Logged in coordinator: ${coordinator}`}
            >
              {coordinator}
            </span>
          </div>
        </div>
      </header>

      {/* Dynamic Copilot & Spatial Map Panel */}
      <section
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        aria-label="AI operations panel and map"
      >
        <div className="lg:col-span-2">
          {aiInsights ? (
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between h-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                    </span>
                    GenAI Operational Copilot
                  </h3>
                  <div className="px-2.5 py-0.5 bg-accent-dim border border-accent/20 rounded-full text-[10px] font-bold text-accent tracking-wide select-none">
                    PREDICTIVE RADAR
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-950/40 border border-border rounded-xl">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1">
                      Predicted Peak sector
                    </span>
                    <span className="text-sm font-semibold text-text-primary block">
                      {aiInsights.predictedPeak}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-950/40 border border-border rounded-xl">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1">
                      Crowd Flow Surge Risk
                    </span>
                    <span className={`text-sm font-bold block ${aiInsights.riskColor}`}>
                      {aiInsights.crowdFlowRisk}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 bg-slate-950/40 border border-border rounded-xl">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold block mb-1">
                    Resource Optimization Plan
                  </span>
                  <span className="text-xs text-text-secondary leading-relaxed block">
                    {aiInsights.resourceOptimization}
                  </span>
                </div>

                <div className="mt-4 p-3.5 bg-accent/5 border border-accent/15 rounded-xl flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 animate-bounce-subtle"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <div>
                    <span className="text-[10px] text-accent uppercase tracking-wider font-bold block mb-0.5">
                      Recommended Action Plan
                    </span>
                    <span className="text-xs text-text-primary leading-relaxed font-semibold block">
                      {aiInsights.recommendedAction}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAutoDispatch}
                aria-label={`Execute GenAI auto dispatch command to ${aiInsights.recommendedZone}`}
                className="w-full mt-6 py-2.5 px-4 bg-accent hover:bg-accent/85 text-background font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-accent/20 select-none border border-transparent"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Auto-Dispatch Staff (Press SPACE)
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-center h-full">
              <span className="text-xs text-text-muted">
                Analyzing real-time stadium metrics...
              </span>
            </div>
          )}
        </div>

        <div>
          <StadiumMinimap
            zones={zones}
            focusedZoneName={focusedZoneName}
            setFocusedZoneName={setFocusedZoneName}
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none"
        aria-label="Operations metrics summary"
      >
        <StatCard label="Total Zones" value={zones.length} icon={<ZonesIcon />} color="blue" />
        <StatCard
          label="Avg Occupancy"
          value={`${Math.round(zones.reduce((a, b) => a + b.occupancy, 0) / zones.length)}%`}
          icon={<OccupancyIcon />}
          color="green"
        />
        <StatCard
          label="Critical Alerts"
          value={criticalIncidents.length}
          icon={<AlertIcon />}
          color="red"
        />
        <StatCard
          label="Warnings"
          value={warningIncidents.length}
          icon={<WarningIcon />}
          color="yellow"
        />
      </section>

      {/* Incidents Panel */}
      {activeIncidents.length > 0 && (
        <section
          className="bg-card border border-border rounded-2xl overflow-hidden animate-slide-in"
          aria-labelledby="incidents-heading"
        >
          <div className="p-4 bg-card bg-opacity-50 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
            <h2
              id="incidents-heading"
              className="text-lg font-semibold text-text-primary flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Active Incidents ({activeIncidents.length})
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-400 rounded">
                  {criticalIncidents.length} Critical
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded">
                  {warningIncidents.length} Warning
                </span>
              </div>
              <button
                onClick={exportIncidentsToCSV}
                aria-label="Export logged active incidents report to CSV format file"
                className="px-2.5 py-1 bg-accent/15 border border-accent/30 rounded-lg text-[10px] font-bold text-accent hover:bg-accent/25 transition-all select-none cursor-pointer flex items-center gap-1"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                EXPORT CSV
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeIncidents.map((incident) => (
                <IncidentItem
                  key={incident.id}
                  incident={incident}
                  onAcknowledge={acknowledgeIncident}
                  onResolve={resolveIncident}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Zones Grid */}
      <section aria-labelledby="zones-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 select-none">
          <h2 id="zones-heading" className="text-xl font-bold text-text-primary">
            Stadium Zones
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <LegendItem color="bg-green-500" label="Normal (<70%)" />
            <LegendItem color="bg-yellow-500" label="Warning (70-85%)" />
            <LegendItem color="bg-red-500" label="Critical (>85%)" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <MetricCard key={zone.id} zone={zone} />
          ))}
        </div>
      </section>

      {/* RuleEngine (non-visual) */}
      <RuleEngine />

      {/* Keyboard Shortcuts Help Modal */}
      {showShortcutsHelp && (
        <div
          className="fixed inset-0 z-50 bg-background/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
        >
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative select-none">
            <button
              onClick={() => setShowShortcutsHelp(false)}
              aria-label="Close shortcuts help dialog modal"
              className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3
              id="modal-heading"
              className="text-md font-bold text-text-primary mb-4 flex items-center gap-2"
            >
              ⌨️ Dashboard Keyboard Shortcuts
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs mb-5">
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">North Gate</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  N
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">East Gate</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  E
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">South Gate</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  G
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">West Gate</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  W
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">VIP Lounge</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  V
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">Press Box</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  P
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">Family Zone</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  Y
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">Supporters Section</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  S
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">Concourse A</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  A
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">Concourse B</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  B
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">Food Court</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  F
                </kbd>
              </div>
              <div className="border border-border/50 p-2 rounded-lg bg-slate-950/40 flex justify-between items-center">
                <span className="text-text-secondary">Merchandise</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  M
                </kbd>
              </div>
            </div>

            <div className="border-t border-border pt-4 text-xs text-text-muted space-y-2">
              <div className="flex justify-between items-center">
                <span>AI Auto-Dispatch to busiest zone</span>
                <kbd className="px-2 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  SPACE
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Clear selection highlight</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  ESC
                </kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Toggle help overlay modal</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 text-accent rounded text-[10px] font-mono font-bold">
                  ?
                </kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-accent/35 rounded-xl px-4 py-2.5 shadow-glow flex items-center gap-2.5 text-xs font-semibold text-accent animate-fade-in select-none"
          role="status"
          aria-live="polite"
        >
          <span
            className="w-2.5 h-2.5 bg-accent rounded-full animate-ping absolute -top-1 -right-1"
            aria-hidden="true"
          />
          <span className="w-2 h-2 bg-accent rounded-full" aria-hidden="true" />
          {toastMsg}
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
            {label}
          </p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`} aria-hidden="true">
          {icon}
        </div>
      </div>
    </div>
  );
};

// Legend Item
const LegendItem = ({ color, label }) => (
  <span className="flex items-center gap-1.5 px-2 py-1 bg-card border border-border rounded-lg">
    <span className={`w-2.5 h-2.5 rounded-full ${color}`} aria-hidden="true" />
    <span>{label}</span>
  </span>
);

// Icons
const ZonesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const OccupancyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);
