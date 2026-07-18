import React, { useContext } from 'react';
import { StadiumContext } from '../context/StadiumContext';

export const MetricCard = ({ zone }) => {
  const { incidents, focusedZoneName } = useContext(StadiumContext);
  
  const isFocused = focusedZoneName === zone.name;
  const isCritical = zone.occupancy > 85;
  const isWarning = zone.occupancy > 70;
  const isHighWait = zone.queueTime > 15;

  const hasActiveIncident = incidents.some(
    inc => inc.zone === zone.name && !inc.resolved
  );

  const getOccupancyColor = () => {
    if (isCritical) return 'bg-red-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getOccupancyTextColor = () => {
    if (isCritical) return 'text-red-400';
    if (isWarning) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBorderColor = () => {
    if (isFocused) return 'border-accent shadow-glow ring-2 ring-accent';
    if (hasActiveIncident) return 'border-red-500/50';
    if (isCritical) return 'border-red-500/30';
    if (isWarning) return 'border-yellow-500/30';
    return 'border-border';
  };

  const getStatusLabel = () => {
    if (isCritical) return 'CRITICAL';
    if (isWarning) return 'WARNING';
    return 'NORMAL';
  };

  const getStatusColor = () => {
    if (isCritical) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (isWarning) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const shortcutKeys = {
    'North Gate': 'N',
    'East Gate': 'E',
    'South Gate': 'G',
    'West Gate': 'W',
    'VIP Lounge': 'V',
    'Press Box': 'P',
    'Family Zone': 'Y',
    'Supporters Section': 'S',
    'Concourse A': 'A',
    'Concourse B': 'B',
    'Food Court': 'F',
    'Merchandise': 'M'
  };
  const keyLabel = shortcutKeys[zone.name];

  return (
    <div 
      id={`zone-card-${zone.id}`}
      className={`relative group bg-card border rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 ${
        isFocused ? 'scale-[1.02] z-10' : ''
      } ${getBorderColor()} animate-fade-in`}
    >
      {/* Status Badge */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-1.5">
          {zone.name}
          {keyLabel && (
            <kbd className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-800 text-accent border border-accent/20 rounded font-mono select-none" title={`Press ${keyLabel} shortcut key`}>
              {keyLabel}
            </kbd>
          )}
        </h3>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Occupancy Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-muted uppercase tracking-wide">Occupancy</span>
          <span className={`text-xl font-bold ${getOccupancyTextColor()}`}>{zone.occupancy}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getOccupancyColor()} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${zone.occupancy}%` }}
          />
        </div>
        
        {/* Occupancy markers */}
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-text-muted">0%</span>
          <span className="text-xs text-text-muted">50%</span>
          <span className="text-xs text-text-muted">100%</span>
        </div>
      </div>

      {/* Wait Time Section */}
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-xs text-text-muted uppercase tracking-wide">Wait Time</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${isHighWait ? 'text-red-400' : 'text-text-primary'}`}>
            {zone.queueTime}
          </span>
          <span className="text-sm text-text-muted">min</span>
        </div>
      </div>

      {/* Wait time progress bar */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isHighWait ? 'bg-red-500' : 'bg-gray-600'}`}
          style={{ width: `${Math.min(100, (zone.queueTime / 30) * 100)}%` }}
        />
      </div>

      {/* Incident Indicator */}
      {hasActiveIncident && (
        <div className="relative pt-4 border-t border-red-500/20 animate-pulse-subtle">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <svg className="w-4 h-4 flex-shrink-0 animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium text-xs">ACTIVE INCIDENT</span>
          </div>
          <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
        </div>
      )}

      {/* Hover Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-4 pt-4 border-t border-border flex items-center justify-between">
        <button className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-gray-800 hover:bg-gray-700 border border-border rounded-lg transition-colors cursor-pointer">
          Details
        </button>
        <button className="px-3 py-1.5 text-xs font-medium text-white bg-accent/20 hover:bg-accent/30 border border-accent/30 rounded-lg transition-colors cursor-pointer">
          Dispatch
        </button>
      </div>
    </div>
  );
};