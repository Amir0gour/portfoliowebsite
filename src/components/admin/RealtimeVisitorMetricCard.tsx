import React, { useState } from 'react';
import { useRealtimeVisitors } from '../../hooks/useRealtimeVisitors';
import { Users, Activity, Eye, Radio, Sparkles, RefreshCw } from 'lucide-react';

export const RealtimeVisitorMetricCard: React.FC = () => {
  const { activeVisitors, pageViews, uniqueVisitors, isConnected, lastPing, trackView, refresh } = useRealtimeVisitors(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateVisitor = async () => {
    setIsSimulating(true);
    await trackView('Simulated Visitor Session');
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 flex flex-col justify-between relative overflow-hidden group">
      
      {/* Subtle ambient gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Header row with live telemetry badge */}
        <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400 text-xs mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900 dark:text-neutral-200">
              Live Visitor Telemetry
            </span>
            {/* Real telemetry status dot - compliant with frontend design constitution */}
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>{isConnected ? 'LIVE' : 'SYNCING'}</span>
            </span>
          </div>

          <button
            onClick={() => refresh()}
            title="Refresh stream"
            aria-label="Refresh telemetry stream"
            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Primary Live Number: Active Visitors Right Now */}
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-900 dark:text-neutral-100 tracking-tight tabular-nums">
            {activeVisitors}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            concurrent visitor{activeVisitors !== 1 ? 's' : ''} now
          </span>
        </div>

        {/* Secondary: Total Page Views */}
        <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-500 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-blue-400 inline" /> Total Views:
          </span>
          <span className="font-bold text-neutral-200 tabular-nums">
            {pageViews.toLocaleString()}
          </span>
        </div>

        <div className="pt-1.5 flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-500 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400 inline" /> Unique Reach:
          </span>
          <span className="font-semibold text-neutral-300 tabular-nums">
            ~{uniqueVisitors.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Interactive test trigger */}
      <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
        <span className="text-neutral-500 text-[10px] font-mono">
          {lastPing ? `Synced ${lastPing.toLocaleTimeString()}` : 'Connecting...'}
        </span>

        <button
          onClick={handleSimulateVisitor}
          disabled={isSimulating}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 disabled:opacity-50 cursor-pointer"
        >
          <Activity className="w-3 h-3" />
          <span>{isSimulating ? 'Pinged...' : '+ Test Ping'}</span>
        </button>
      </div>

    </div>
  );
};
