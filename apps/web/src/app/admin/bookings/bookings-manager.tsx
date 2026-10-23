'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import { AdminLogoutButton } from '@/components/admin-logout-button';

const API_BASE = getApiBaseUrl();

export type ServiceRequestItem = {
  id: string;
  reference: string;
  status: string;
  description: string;
  address: string;
  gpsAddress: string | null;
  preferredDate: string | null;
  timeWindow: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    organisationName: string | null;
    preferredContactMethod: string | null;
  };
  service: {
    id: string;
    name: string;
    slug: string;
  };
  events?: Array<{
    id: string;
    eventType: string;
    oldStatus: string | null;
    newStatus: string | null;
    createdAt: string;
    detail?: any;
  }>;
};

const STATUS_OPTIONS = [
  { value: 'REQUESTED', label: 'Requested (New)' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SITE_VISIT_REQUIRED', label: 'Site Visit Required' },
  { value: 'QUOTATION_PENDING', label: 'Quotation Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'DECLINED', label: 'Declined' },
];

export function BookingsManager() {
  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [flash, setFlash] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const showFlash = (type: 'ok' | 'err', text: string) => {
    setFlash({ type, text });
    setTimeout(() => setFlash(null), 4500);
  };

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries`);
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } else {
        showFlash('err', 'Failed to retrieve service requests from server.');
      }
    } catch {
      showFlash('err', 'Network error connecting to API server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const handleStatusUpdate = async (id: string, newStatus: string, note?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r))
        );
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        setStatusNote('');
        showFlash('ok', `Status updated to "${newStatus.replace(/_/g, ' ')}".`);
      } else {
        showFlash('err', 'Could not update status. Please try again.');
      }
    } catch {
      showFlash('err', 'Failed to connect to API server.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, ref: string) => {
    if (!confirm(`Are you sure you want to delete request ${ref}? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        if (selectedRequest?.id === id) setSelectedRequest(null);
        showFlash('ok', `Request ${ref} has been removed.`);
      } else {
        showFlash('err', 'Failed to delete request.');
      }
    } catch {
      showFlash('err', 'Failed to connect to API server.');
    }
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      // Status filter
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'ACTIVE') {
          if (!['REQUESTED', 'UNDER_REVIEW', 'CONFIRMED', 'IN_PROGRESS', 'SITE_VISIT_REQUIRED'].includes(item.status)) {
            return false;
          }
        } else if (item.status !== filterStatus) {
          return false;
        }
      }

      // Search filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        item.reference?.toLowerCase().includes(q) ||
        item.customer?.fullName?.toLowerCase().includes(q) ||
        item.customer?.email?.toLowerCase().includes(q) ||
        item.customer?.phone?.toLowerCase().includes(q) ||
        item.customer?.organisationName?.toLowerCase().includes(q) ||
        item.service?.name?.toLowerCase().includes(q) ||
        item.address?.toLowerCase().includes(q) ||
        item.gpsAddress?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    });
  }, [requests, filterStatus, search]);

  // Counts
  const counts = useMemo(() => {
    const total = requests.length;
    const requested = requests.filter((r) => r.status === 'REQUESTED').length;
    const underReview = requests.filter((r) => r.status === 'UNDER_REVIEW').length;
    const confirmed = requests.filter((r) => r.status === 'CONFIRMED' || r.status === 'IN_PROGRESS').length;
    const completed = requests.filter((r) => r.status === 'COMPLETED' || r.status === 'CLOSED').length;
    return { total, requested, underReview, confirmed, completed };
  }, [requests]);

  const renderBadge = (status: string) => {
    const s = status.toLowerCase();
    let badgeClass = 'admin-badge--requested';
    if (s.includes('review')) badgeClass = 'admin-badge--under_review';
    else if (s.includes('confirm')) badgeClass = 'admin-badge--confirmed';
    else if (s.includes('progress')) badgeClass = 'admin-badge--in_progress';
    else if (s.includes('complete') || s.includes('close')) badgeClass = 'admin-badge--completed';
    else if (s.includes('cancel') || s.includes('decline')) badgeClass = 'admin-badge--cancelled';

    return (
      <span className={`admin-badge ${badgeClass}`}>
        <span className="admin-badge-dot" />
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="admin-shell">
      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-divider" />
        <span className="admin-topbar-section">Service Bookings &amp; Quotes</span>
        <div className="admin-topbar-spacer" />
        <Link href="/book-service" className="admin-topbar-back">
          Public Form ↗
        </Link>
        <AdminLogoutButton />
      </header>

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-label">Navigation</div>
          <Link href="/admin" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/bookings" className="admin-nav-link active">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Service Bookings
          </Link>
          <Link href="/admin/gallery" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            Gallery
          </Link>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {flash && (
            <div className={`admin-flash ${flash.type === 'ok' ? 'admin-flash--ok' : 'admin-flash--err'}`}>
              {flash.text}
            </div>
          )}

          <div className="admin-page-header">
            <div className="admin-page-eyebrow">Operations &amp; Client Management</div>
            <h1 className="admin-page-title">Service Bookings &amp; Quotes</h1>
            <p className="admin-page-lead">
              Review incoming service booking requests, track quotation inquiries, and update appointment statuses in real time.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-label">Total Requests</div>
              <div className="admin-stat-value">{counts.total}</div>
              <div className="admin-stat-sub">recorded submissions</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">New / Pending</div>
              <div className="admin-stat-value" style={{ color: '#facc15' }}>{counts.requested}</div>
              <div className="admin-stat-sub">awaiting initial review</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">In Review</div>
              <div className="admin-stat-value" style={{ color: '#60a5fa' }}>{counts.underReview}</div>
              <div className="admin-stat-sub">client contact in progress</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Confirmed / Active</div>
              <div className="admin-stat-value" style={{ color: '#4ade80' }}>{counts.confirmed}</div>
              <div className="admin-stat-sub">scheduled / underway</div>
            </div>
          </div>

          {/* Toolbar: Search & Filter Pills */}
          <div className="admin-toolbar">
            <div className="admin-search-wrap">
              <svg className="admin-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search reference, client name, phone, service, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-filter-pills">
              <button
                type="button"
                className={`admin-filter-pill ${filterStatus === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterStatus('ALL')}
              >
                All <span className="admin-pill-badge">{counts.total}</span>
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${filterStatus === 'REQUESTED' ? 'active' : ''}`}
                onClick={() => setFilterStatus('REQUESTED')}
              >
                New <span className="admin-pill-badge">{counts.requested}</span>
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${filterStatus === 'UNDER_REVIEW' ? 'active' : ''}`}
                onClick={() => setFilterStatus('UNDER_REVIEW')}
              >
                In Review <span className="admin-pill-badge">{counts.underReview}</span>
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${filterStatus === 'CONFIRMED' ? 'active' : ''}`}
                onClick={() => setFilterStatus('CONFIRMED')}
              >
                Confirmed
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${filterStatus === 'COMPLETED' ? 'active' : ''}`}
                onClick={() => setFilterStatus('COMPLETED')}
              >
                Completed <span className="admin-pill-badge">{counts.completed}</span>
              </button>
              <button
                type="button"
                className="admin-btn-action"
                onClick={() => void loadRequests()}
                title="Refresh requests"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="admin-empty" style={{ padding: '60px 20px', color: 'var(--admin-muted)' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚡</div>
              <p>Loading bookings &amp; service requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="admin-empty" style={{ padding: '60px 20px', background: 'var(--admin-surface)', borderRadius: 12, border: '1px solid var(--admin-border)' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>📋</div>
              <h3 style={{ margin: '0 0 6px', color: 'var(--admin-text)' }}>No requests found</h3>
              <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: 14 }}>
                {search ? 'Try adjusting your search terms or filter.' : 'New submissions from the website will appear here.'}
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <colgroup>
                  <col className="admin-table-col-reference" />
                  <col className="admin-table-col-customer" />
                  <col className="admin-table-col-service" />
                  <col className="admin-table-col-location" />
                  <col className="admin-table-col-status" />
                  <col className="admin-table-col-submitted" />
                  <col className="admin-table-col-actions" />
                </colgroup>
                <thead>
                  <tr>
                    <th className="admin-th">Reference</th>
                    <th className="admin-th">Customer</th>
                    <th className="admin-th">Service</th>
                    <th className="admin-th">Location</th>
                    <th className="admin-th">Status</th>
                    <th className="admin-th">Date Submitted</th>
                    <th className="admin-th" style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((item) => {
                    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <tr key={item.id} className="admin-tr">
                        <td className="admin-td admin-table-cell--reference">
                          <span className="admin-ref-code">{item.reference}</span>
                        </td>
                        <td className="admin-td admin-table-cell--customer">
                          <span className="admin-cust-name">{item.customer?.fullName || 'Anonymous'}</span>
                          {item.customer?.organisationName && (
                            <span className="admin-cust-org">{item.customer.organisationName}</span>
                          )}
                          <div className="admin-cust-sub">
                            <a href={`tel:${item.customer?.phone}`} className="admin-cust-link" title="Call customer">
                              📞 {item.customer?.phone}
                            </a>
                            {item.customer?.email && (
                              <a href={`mailto:${item.customer?.email}`} className="admin-cust-link" title="Email customer">
                                ✉️ {item.customer?.email}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="admin-td admin-table-cell--service">
                          <div className="admin-table-primary">
                            {item.service?.name || 'General Enquiry'}
                          </div>
                          {item.preferredDate && (
                            <div className="admin-table-meta">
                              <span aria-hidden="true">📅</span> {new Date(item.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              {item.timeWindow ? ` (${item.timeWindow})` : ''}
                            </div>
                          )}
                        </td>
                        <td className="admin-td admin-table-cell--location">
                          <div className="admin-table-primary admin-location-text" title={item.address}>
                            {item.address || 'No address supplied'}
                          </div>
                          {item.gpsAddress && (
                            <div className="admin-table-meta admin-gps-text" title={item.gpsAddress}>
                              📍 {item.gpsAddress}
                            </div>
                          )}
                        </td>
                        <td className="admin-td admin-table-cell--status">
                          {renderBadge(item.status)}
                        </td>
                        <td className="admin-td admin-table-cell--submitted">
                          <time dateTime={item.createdAt}>{formattedDate}</time>
                        </td>
                        <td className="admin-td admin-table-cell--actions">
                          <div className="admin-actions">
                            <button
                              type="button"
                              className="admin-btn-action"
                              onClick={() => setSelectedRequest(item)}
                              title="Inspect full request details and manage status"
                            >
                              View <span aria-hidden="true">→</span>
                            </button>
                            <button
                              type="button"
                              className="admin-btn-action admin-btn-danger"
                              onClick={() => handleDelete(item.id, item.reference)}
                              title="Delete request"
                              aria-label={`Delete request ${item.reference}`}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Slide-over Detail Drawer */}
      {selectedRequest && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedRequest(null)}>
          <div className="admin-modal-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-drawer-header">
              <div>
                <span className="admin-ref-code" style={{ marginRight: 8 }}>{selectedRequest.reference}</span>
                <span style={{ fontSize: 13, color: 'var(--admin-muted)' }}>
                  Submitted {new Date(selectedRequest.createdAt).toLocaleString('en-GB')}
                </span>
              </div>
              <button
                type="button"
                className="admin-drawer-close"
                onClick={() => setSelectedRequest(null)}
                aria-label="Close details"
              >
                &times;
              </button>
            </div>

            <div className="admin-drawer-body">
              {/* Quick Status Bar */}
              <div className="admin-detail-group" style={{ borderColor: 'var(--admin-wine)' }}>
                <div className="admin-detail-label">Current Status &amp; Action</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  {renderBadge(selectedRequest.status)}
                </div>
                <label className="admin-detail-label" htmlFor="quick-status-change">Change Status To:</label>
                <select
                  id="quick-status-change"
                  className="admin-status-select"
                  value={selectedRequest.status}
                  disabled={updatingId === selectedRequest.id}
                  onChange={(e) => handleStatusUpdate(selectedRequest.id, e.target.value, statusNote)}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Optional status transition note (e.g. Scheduled for Friday 10am)..."
                  className="admin-status-select"
                  style={{ marginTop: 8, fontSize: 13 }}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>

              {/* Customer Contact Card */}
              <div className="admin-detail-group">
                <div className="admin-detail-label">Client Contact Details</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                  {selectedRequest.customer?.fullName}
                </div>
                {selectedRequest.customer?.organisationName && (
                  <div style={{ fontSize: 13, color: 'var(--admin-muted)', marginBottom: 8 }}>
                    🏢 {selectedRequest.customer.organisationName}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  <a
                    href={`tel:${selectedRequest.customer?.phone}`}
                    className="admin-btn-action"
                    style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.3)' }}
                  >
                    📞 Call: {selectedRequest.customer?.phone}
                  </a>
                  {selectedRequest.customer?.phone && (
                    <a
                      href={`https://wa.me/${selectedRequest.customer.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn-action"
                      style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25d366', borderColor: 'rgba(37, 211, 102, 0.3)' }}
                    >
                      💬 WhatsApp
                    </a>
                  )}
                  {selectedRequest.customer?.email && (
                    <a
                      href={`mailto:${selectedRequest.customer.email}?subject=RE: Service Request ${selectedRequest.reference}`}
                      className="admin-btn-action"
                      style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}
                    >
                      ✉️ Email
                    </a>
                  )}
                </div>
              </div>

              {/* Service & Scope Description */}
              <div className="admin-detail-group">
                <div className="admin-detail-label">Requested Service</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--admin-text)', marginBottom: 8 }}>
                  {selectedRequest.service?.name}
                </div>
                <div className="admin-detail-label">Client Description / Scope</div>
                <div className="admin-detail-value" style={{ whiteSpace: 'pre-wrap', background: 'var(--admin-surface)', padding: 12, borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                  {selectedRequest.description || 'No additional project description provided.'}
                </div>
              </div>

              {/* Site Location & Schedule */}
              <div className="admin-detail-group">
                <div className="admin-detail-label">Installation / Site Location</div>
                <div className="admin-detail-value" style={{ marginBottom: 8 }}>
                  📍 {selectedRequest.address}
                </div>
                {selectedRequest.gpsAddress && (
                  <div style={{ fontSize: 13, color: '#60a5fa', fontFamily: 'monospace', marginBottom: 8 }}>
                    GPS: {selectedRequest.gpsAddress}
                  </div>
                )}
                {selectedRequest.preferredDate && (
                  <div>
                    <div className="admin-detail-label" style={{ marginTop: 10 }}>Preferred Visit Schedule</div>
                    <div className="admin-detail-value" style={{ color: '#facc15' }}>
                      📅 {new Date(selectedRequest.preferredDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      {selectedRequest.timeWindow ? ` — ${selectedRequest.timeWindow}` : ''}
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline Events (if any) */}
              {selectedRequest.events && selectedRequest.events.length > 0 && (
                <div className="admin-detail-group">
                  <div className="admin-detail-label">Activity Timeline</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                    {selectedRequest.events.map((evt) => (
                      <div
                        key={evt.id}
                        style={{
                          fontSize: 12.5,
                          padding: '6px 10px',
                          background: 'var(--admin-surface)',
                          borderRadius: 6,
                          borderLeft: '3px solid var(--admin-wine)',
                        }}
                      >
                        <div style={{ fontWeight: 600, color: 'var(--admin-text)' }}>
                          {evt.eventType.replace(/_/g, ' ')}
                          {evt.newStatus ? ` → ${evt.newStatus}` : ''}
                        </div>
                        <div style={{ color: 'var(--admin-muted)', fontSize: 11 }}>
                          {new Date(evt.createdAt).toLocaleString('en-GB')}
                          {evt.detail?.note ? ` — Note: "${evt.detail.note}"` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
