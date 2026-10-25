'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin-roles';

const API_URL = '/api/admin/backend/admin/dashboard/stats';

type DashboardStats = {
  totalBookings: number;
  newRequested: number;
  inProgress: number;
  completedThisMonth: number;
  upcomingVisits: number;
  pendingAction: number;
  totalGalleryPhotos: number;
  totalStaff: number;
  generatedAt: string;
};

/** Animated counting-up number */
function AnimatedCount({ value, loading }: { value: number; loading: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (loading) { setDisplay(0); return; }
    if (value === 0) { setDisplay(0); return; }
    // Quickly count from 0 to the value
    let start = 0;
    const duration = 700; // ms
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, loading]);

  if (loading) return <span className="dash-stat-skeleton" aria-label="Loading" />;
  return <>{display}</>;
}

/** Small coloured badge used inside stat cards */
function Badge({ text, variant }: { text: string; variant: 'new' | 'warn' | 'ok' | 'info' }) {
  return <span className={`dash-badge dash-badge-${variant}`}>{text}</span>;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DashboardStats = await res.json();
      setStats(data);
      setLastRefreshed(new Date());
    } catch {
      setError('Could not load live stats. Using cached data if available.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount and auto-refresh every 90 seconds
  useEffect(() => {
    void load();
    const interval = setInterval(() => { void load(); }, 90_000);
    return () => clearInterval(interval);
  }, [load]);

  const s = stats;

  return (
    <div className="dash-stats-wrapper">
      {error && (
        <div className="dash-stats-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <div className="admin-stats dash-stats-grid">
        {/* Pending Action */}
        <div className="admin-stat-card dash-stat-highlight">
          <div className="admin-stat-label">
            Pending Action
            {!loading && s && s.pendingAction > 0 && <Badge text="Needs attention" variant="new" />}
          </div>
          <div className="admin-stat-value dash-stat-num">
            <AnimatedCount value={s?.pendingAction ?? 0} loading={loading} />
          </div>
          <div className="admin-stat-sub">
            {loading ? <span className="dash-stat-skeleton-text" /> : (
              <>
                {s?.newRequested ?? 0} new&nbsp;·&nbsp;
                {/* under_review + quotation_pending */}
                {((s?.pendingAction ?? 0) - (s?.newRequested ?? 0))} under review
              </>
            )}
          </div>
        </div>

        {/* Upcoming / Confirmed */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">
            Upcoming Jobs
            {!loading && s && s.upcomingVisits > 0 && <Badge text={`${s.upcomingVisits} scheduled`} variant="info" />}
          </div>
          <div className="admin-stat-value dash-stat-num">
            <AnimatedCount value={s?.upcomingVisits ?? 0} loading={loading} />
          </div>
          <div className="admin-stat-sub">
            {loading ? <span className="dash-stat-skeleton-text" /> : 'Confirmed or site visit required'}
          </div>
        </div>

        {/* In Progress */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">
            In Progress
            {!loading && s && s.inProgress > 0 && <Badge text="Active" variant="ok" />}
          </div>
          <div className="admin-stat-value dash-stat-num">
            <AnimatedCount value={s?.inProgress ?? 0} loading={loading} />
          </div>
          <div className="admin-stat-sub">
            {loading ? <span className="dash-stat-skeleton-text" /> : 'Jobs currently being worked on'}
          </div>
        </div>

        {/* Completed This Month */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">Completed This Month</div>
          <div className="admin-stat-value dash-stat-num">
            <AnimatedCount value={s?.completedThisMonth ?? 0} loading={loading} />
          </div>
          <div className="admin-stat-sub">
            {loading ? <span className="dash-stat-skeleton-text" /> : `${s?.totalBookings ?? 0} total bookings ever`}
          </div>
        </div>

        {/* Gallery Photos */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">Gallery Photos</div>
          <div className="admin-stat-value dash-stat-num">
            <AnimatedCount value={s?.totalGalleryPhotos ?? 0} loading={loading} />
          </div>
          <div className="admin-stat-sub">
            {loading ? <span className="dash-stat-skeleton-text" /> : 'Active photos on live site'}
          </div>
        </div>

        {/* Staff */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">Active Staff</div>
          <div className="admin-stat-value dash-stat-num">
            <AnimatedCount value={s?.totalStaff ?? 0} loading={loading} />
          </div>
          <div className="admin-stat-sub">
            {loading ? <span className="dash-stat-skeleton-text" /> : 'Portal accounts with access'}
          </div>
        </div>
      </div>

      {/* Refresh row */}
      <div className="dash-stats-footer">
        {lastRefreshed && !loading && (
          <span className="dash-stats-timestamp">
            Last updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
        <button
          type="button"
          className="dash-refresh-btn"
          onClick={() => void load()}
          disabled={loading}
          aria-label="Refresh dashboard statistics"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={loading ? 'dash-spin' : ''}>
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </div>
  );
}
