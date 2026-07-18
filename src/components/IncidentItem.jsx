import React from 'react';

export const IncidentItem = ({ incident, onAcknowledge, onResolve }) => {
  const severityColors = {
    critical: 'bg-red-500/20 border-red-500/30 text-red-300',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
  };

  const severityIcons = {
    critical: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    if (mins > 0) return `${mins}m ago`;
    return `${secs}s ago`;
  };

  return (
    <div className={`relative ${severityColors[incident.severity]} border rounded-xl p-4 transition-all duration-300 animate-slide-in ${incident.acknowledged ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {severityIcons[incident.severity]}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-white">{incident.zone}</p>
              <p className="text-sm text-gray-300 mt-1">{incident.message}</p>
            </div>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
              incident.severity === 'critical' 
                ? 'bg-red-500/20 text-red-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {incident.severity.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {incident.assigned}
            </span>
            <span>{timeAgo(incident.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/5">
        {!incident.acknowledged && (
          <button
            onClick={() => onAcknowledge(incident.id)}
            aria-label={`Acknowledge active alert in ${incident.zone}`}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors cursor-pointer"
          >
            Acknowledge
          </button>
        )}
        <button
          onClick={() => onResolve(incident.id)}
          aria-label={`${incident.acknowledged ? 'Resolve' : 'Dismiss'} active alert in ${incident.zone}`}
          className="px-3 py-1.5 text-xs font-medium text-white bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-colors cursor-pointer"
        >
          {incident.acknowledged ? 'Resolve' : 'Dismiss'}
        </button>
      </div>

      {/* Pulse indicator for unacknowledged critical incidents */}
      {!incident.acknowledged && incident.severity === 'critical' && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};