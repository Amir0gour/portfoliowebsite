import { useEffect, useState, useCallback, useRef } from 'react';

export interface RealtimeVisitorStats {
  activeVisitors: number;
  pageViews: number;
  uniqueVisitors: number;
  timestamp?: string;
}

export function useRealtimeVisitors(autoTrack: boolean = true) {
  const [stats, setStats] = useState<RealtimeVisitorStats>({
    activeVisitors: 1,
    pageViews: 4820,
    uniqueVisitors: 3140
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasTrackedRef = useRef<boolean>(false);

  // Manual or automatic view tracking
  const trackView = useCallback(async (pathName?: string) => {
    try {
      const res = await fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: pathName || window.location.hash || window.location.pathname })
      });
      if (res.ok) {
        const data = await res.json();
        setStats(prev => ({
          ...prev,
          pageViews: data.pageViews ?? prev.pageViews + 1,
          activeVisitors: data.activeVisitors ?? prev.activeVisitors
        }));
      }
    } catch {
      // offline fallback
      setStats(prev => ({ ...prev, pageViews: prev.pageViews + 1 }));
    }
  }, []);

  // Fetch fallback snapshot
  const fetchSnapshot = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/realtime');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setStats(prev => ({
            ...prev,
            activeVisitors: json.data.activeVisitors ?? prev.activeVisitors,
            pageViews: json.data.pageViews ?? prev.pageViews,
            uniqueVisitors: json.data.uniqueVisitors ?? prev.uniqueVisitors,
            timestamp: json.data.timestamp
          }));
          setLastPing(new Date());
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // 1. Track initial visit once per component lifecycle if requested
    if (autoTrack && !hasTrackedRef.current) {
      hasTrackedRef.current = true;
      trackView();
    }

    // 2. Initial fetch snapshot
    fetchSnapshot();

    // 3. Connect to Server-Sent Events (SSE) stream
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      try {
        const es = new EventSource('/api/analytics/live-visitors');
        eventSourceRef.current = es;

        es.onopen = () => {
          setIsConnected(true);
          setLastPing(new Date());
        };

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setStats(prev => ({
              ...prev,
              activeVisitors: data.activeVisitors ?? prev.activeVisitors,
              pageViews: data.pageViews ?? prev.pageViews,
              uniqueVisitors: data.uniqueVisitors ?? prev.uniqueVisitors,
              timestamp: data.timestamp
            }));
            setIsConnected(true);
            setLastPing(new Date());
          } catch {
            // keep alive ping or parse error
          }
        };

        es.onerror = () => {
          setIsConnected(false);
          // If SSE disconnects, fall back to occasional polling
        };
      } catch (err) {
        console.warn('SSE connection failed, falling back to polling', err);
      }
    }

    // 4. Polling fallback heartbeat every 15 seconds
    const interval = setInterval(() => {
      fetchSnapshot();
    }, 15000);

    return () => {
      clearInterval(interval);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [autoTrack, trackView, fetchSnapshot]);

  return {
    activeVisitors: stats.activeVisitors,
    pageViews: stats.pageViews,
    uniqueVisitors: stats.uniqueVisitors,
    isConnected,
    lastPing,
    refresh: fetchSnapshot,
    trackView
  };
}
