'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getApiBaseUrl } from '@/lib/api-url';
import { AdminLogoutButton } from '@/components/admin-logout-button';

function getGalleryApi(): string {
  return `${getApiBaseUrl()}/gallery`;
}

type Photo = {
  id: string;
  filename: string;
  caption: string | null;
  uploadedAt: string;
  url?: string | null;
  r2Key?: string | null;
};

export default function GalleryManagePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getGalleryApi());
      if (res.ok) {
        const data = await res.json();
        setPhotos(Array.isArray(data) ? data : []);
      } else {
        flash('err', `Failed to load photos: ${res.status} ${res.statusText}`);
      }
    } catch (err: unknown) {
      flash('err', `Failed to connect to API: ${err instanceof Error ? err.message : 'Network error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const doUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    let fail = 0;
    let lastError = '';
    const fileList = Array.from(files);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadStatus(`Uploading ${i + 1} of ${fileList.length}: ${file.name}…`);
      const fd = new FormData();
      fd.append('file', file);
      if (uploadCaption.trim()) fd.append('caption', uploadCaption.trim());

      try {
        const res = await fetch(getGalleryApi(), { method: 'POST', body: fd });
        if (res.ok) {
          ok++;
        } else {
          fail++;
          const errData = await res.json().catch(() => null);
          lastError = errData?.message || `Server returned ${res.status} ${res.statusText}`;
        }
      } catch (err: unknown) {
        fail++;
        lastError = err instanceof Error ? err.message : 'Network error (check if API is running)';
      }
    }

    setUploading(false);
    setUploadStatus('');
    setUploadCaption('');
    if (fileRef.current) fileRef.current.value = '';

    if (fail === 0) {
      flash('ok', `Successfully uploaded ${ok} photo${ok === 1 ? '' : 's'} to Cloudflare R2.`);
    } else {
      flash('err', `Uploaded ${ok} photo${ok === 1 ? '' : 's'}, ${fail} failed: ${lastError}`);
    }
    load();
  };

  const handleDelete = async (id: string, filename: string) => {
    const displayName = filename.includes('/') ? filename.split('/').pop() || filename : filename;
    if (!confirm(`Delete "${displayName}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${getGalleryApi()}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        flash('ok', `Photo "${displayName}" deleted successfully.`);
        load();
      } else {
        const errData = await res.json().catch(() => null);
        flash('err', `Delete failed: ${errData?.message || res.statusText || 'Unknown error'}`);
      }
    } catch (err: unknown) {
      flash('err', `Delete failed: ${err instanceof Error ? err.message : 'Network error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCaptionEdit = async (id: string, caption: string) => {
    try {
      const res = await fetch(`${getGalleryApi()}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });
      if (res.ok) {
        flash('ok', 'Caption saved.');
        load();
      } else {
        flash('err', 'Failed to save caption.');
      }
    } catch {
      flash('err', 'Failed to save caption.');
    }
  };

  /* ── Authenticated gallery manager ── */
  return (
    <div className="admin-shell">
      {/* Topbar */}
      <header className="admin-topbar">
        <Link href="/admin" className="admin-topbar-logo">
          <div className="admin-topbar-logo-mark">KI</div>
          <span className="admin-topbar-name">Kobby&apos;s Intertech</span>
        </Link>
        <div className="admin-topbar-divider" />
        <span className="admin-topbar-section">Gallery Manager</span>
        <div className="admin-topbar-spacer" />
        <Link href="/gallery" className="admin-topbar-back">
          View Live Gallery ↗
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
          <Link href="/admin/bookings" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Service Bookings
          </Link>
          <Link href="/admin/gallery" className="admin-nav-link active">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            Gallery
          </Link>
          <div className="admin-sidebar-label" style={{ marginTop: 12 }}>Public Pages</div>
          <Link href="/services" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
            </svg>
            Services
          </Link>
          <Link href="/book-service" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Book Service
          </Link>
          <Link href="/contact" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Contact
          </Link>
        </aside>

        {/* Main */}
        <main className="admin-main">
          {/* Page header */}
          <div className="admin-page-header">
            <div className="admin-page-eyebrow">Media Management</div>
            <h1 className="admin-page-title">Photo Gallery</h1>
            <p className="admin-page-lead">
              Upload, caption, and manage the installation photos shown on the live gallery page.
            </p>
          </div>

          {/* Stats */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-label">Total Photos</div>
              <div className="admin-stat-value">{photos.length}</div>
              <div className="admin-stat-sub">in the live gallery</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">With Captions</div>
              <div className="admin-stat-value">{photos.filter(p => p.caption).length}</div>
              <div className="admin-stat-sub">captioned images</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Without Captions</div>
              <div className="admin-stat-value">{photos.filter(p => !p.caption).length}</div>
              <div className="admin-stat-sub">need captions</div>
            </div>
          </div>

          {/* Flash message */}
          {message && (
            <div className={`admin-flash admin-flash--${message.type === 'ok' ? 'ok' : 'err'}`}>
              {message.type === 'ok' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
              {message.text}
            </div>
          )}

          {/* Upload section */}
          <div className="admin-upload-section">
            <div className="admin-section-title">Upload Photos</div>

            <div
              className={`admin-dropzone${dragOver ? ' admin-dropzone--active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); doUpload(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
            >
              {uploading ? (
                <div className="admin-uploading-bar">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6" stroke="rgba(192,0,46,0.35)" strokeWidth="2" />
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {uploadStatus || 'Uploading photos to Cloudflare R2…'}
                </div>
              ) : (
                <>
                  <div className="admin-dropzone-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className="admin-dropzone-text">Drag &amp; drop images here, or click to browse</div>
                  <div className="admin-dropzone-hint">JPG, PNG, WebP, HEIC · Directly stored in Cloudflare R2</div>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => doUpload(e.target.files)}
              />
            </div>

            <div className="admin-caption-row">
              <label htmlFor="upload-caption">Caption for uploaded photos (optional)</label>
              <input
                id="upload-caption"
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="e.g. CCTV installation at Achimota, Accra"
              />
            </div>
          </div>

          {/* Gallery grid */}
          <div className="admin-section-title">All Photos ({photos.length})</div>

          {loading && (
            <div className="admin-loading">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Loading photos…
            </div>
          )}

          {!loading && photos.length === 0 && (
            <div className="admin-empty">
              No photos yet.<br />
              Upload your first installation photo using the drop zone above.
            </div>
          )}

          {!loading && photos.length > 0 && (
            <div className="admin-gallery-grid">
              {photos.map((photo) => {
                const photoSrc =
                  photo.url ||
                  (photo.filename.startsWith('http')
                    ? photo.filename
                    : `/gallery/${photo.filename}`);
                const displayName = photo.filename.includes('/')
                  ? photo.filename.split('/').pop() || photo.filename
                  : photo.filename;
                const isR2 = Boolean(photo.url || photo.r2Key);
                const isDeleting = deletingId === photo.id;

                return (
                  <div className="admin-gallery-item" key={photo.id}>
                    <div className="admin-gallery-img-wrap">
                      <Image
                        src={photoSrc}
                        alt={photo.caption ?? displayName}
                        fill
                        unoptimized={Boolean(photo.url)}
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 25vw"
                        className="admin-gallery-img"
                      />
                    </div>
                  <div className="admin-gallery-bar">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div 
                      className="admin-gallery-filename" title={photo.filename}>{displayName}
                      </div>
                    </div>
                    <CaptionEditor
                      initial={photo.caption ?? ''}
                      onSave={(v) => handleCaptionEdit(photo.id, v)}
                    />
                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDelete(photo.id, photo.filename)}
                      disabled={isDeleting}
                      style={{ opacity: isDeleting ? 0.6 : 1 }}
                      aria-label={`Delete ${displayName}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                      </svg>
                      {isDeleting ? 'Deleting…' : 'Delete photo'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CaptionEditor({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [val, setVal] = useState(initial);
  return (
    <form
      className="admin-caption-editor"
      onSubmit={(e) => { e.preventDefault(); onSave(val); }}
    >
      <input
        className="admin-caption-input"
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Add caption…"
      />
      <button className="admin-caption-save" type="submit">
        Save
      </button>
    </form>
  );
}

