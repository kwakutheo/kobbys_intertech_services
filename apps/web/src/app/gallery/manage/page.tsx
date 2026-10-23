'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdminLogoutButton } from '@/components/admin-logout-button';
import { adminFetch } from '@/lib/admin-roles';
import { compressImage, formatBytes } from '@/lib/image-compress';
import {
  GALLERY_CATEGORIES,
  getCategoryLabel,
} from '@/lib/gallery-categories';

function getGalleryApi(): string {
  return '/api/admin/backend/gallery';
}

type Photo = {
  id: string;
  filename: string;
  caption: string | null;
  category: string | null;
  uploadedAt: string;
  url?: string | null;
  r2Key?: string | null;
};

export default function GalleryManagePage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadCategory, setUploadCategory] = useState<string>('cctv-security');
  const [compressEnabled, setCompressEnabled] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingCategoryForId, setUpdatingCategoryForId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 6000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch(getGalleryApi());
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

  // Handle ESC key to dismiss delete modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && photoToDelete && !isDeleting) {
        setPhotoToDelete(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [photoToDelete, isDeleting]);

  const doUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    let fail = 0;
    let lastError = '';
    let totalOriginalBytes = 0;
    let totalCompressedBytes = 0;
    const fileList = Array.from(files);

    for (let i = 0; i < fileList.length; i++) {
      let fileToUpload = fileList[i];
      totalOriginalBytes += fileToUpload.size;

      // Check max size before upload (> 25MB raw)
      if (fileToUpload.size > 25 * 1024 * 1024 && !compressEnabled) {
        fail++;
        lastError = `"${fileToUpload.name}" exceeds 25MB limit. Enable image compression to upload.`;
        continue;
      }

      // 1. Client-Side Image Compression
      if (compressEnabled && fileToUpload.type.startsWith('image/')) {
        setUploadStatus(
          `Optimising ${i + 1} of ${fileList.length}: ${fileToUpload.name} (${formatBytes(fileToUpload.size)})…`
        );
        try {
          const result = await compressImage(fileToUpload, {
            maxWidth: 1920,
            maxHeight: 1920,
            quality: 0.85,
          });
          fileToUpload = result.file;
          totalCompressedBytes += result.compressedSize;
        } catch {
          totalCompressedBytes += fileToUpload.size;
        }
      } else {
        totalCompressedBytes += fileToUpload.size;
      }

      setUploadStatus(
        `Uploading ${i + 1} of ${fileList.length}: ${fileToUpload.name} (${formatBytes(fileToUpload.size)})…`
      );

      // 2. Prepare Form Data with category & caption
      const fd = new FormData();
      fd.append('file', fileToUpload);
      if (uploadCaption.trim()) fd.append('caption', uploadCaption.trim());
      if (uploadCategory) fd.append('category', uploadCategory);

      try {
        const res = await adminFetch(getGalleryApi(), { method: 'POST', body: fd });
        if (res.ok) {
          ok++;
        } else {
          fail++;
          const errData = await res.json().catch(() => null);
          lastError = errData?.message || `Server returned ${res.status} ${res.statusText}`;
        }
      } catch (err: unknown) {
        fail++;
        lastError = err instanceof Error ? err.message : 'Network error (check API connection)';
      }
    }

    setUploading(false);
    setUploadStatus('');
    setUploadCaption('');
    if (fileRef.current) fileRef.current.value = '';

    const savedBytes = totalOriginalBytes - totalCompressedBytes;
    const savingsInfo =
      compressEnabled && savedBytes > 50 * 1024
        ? ` (Saved ${formatBytes(savedBytes)}, reduced by ${Math.round((savedBytes / totalOriginalBytes) * 100)}%)`
        : '';

    if (fail === 0) {
      flash(
        'ok',
        `Successfully uploaded ${ok} photo${ok === 1 ? '' : 's'}.`
      );
    } else {
      flash('err', `Uploaded ${ok} photo${ok === 1 ? '' : 's'}, ${fail} failed: ${lastError}`);
    }
    load();
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;
    setIsDeleting(true);
    const displayName = photoToDelete.filename.includes('/')
      ? photoToDelete.filename.split('/').pop() || photoToDelete.filename
      : photoToDelete.filename;

    try {
      const res = await adminFetch(`${getGalleryApi()}/${photoToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        flash('ok', `Photo "${displayName}" deleted successfully.`);
        setPhotoToDelete(null);
        load();
      } else {
        const errData = await res.json().catch(() => null);
        flash('err', `Delete failed: ${errData?.message || res.statusText || 'Unknown error'}`);
      }
    } catch (err: unknown) {
      flash('err', `Delete failed: ${err instanceof Error ? err.message : 'Network error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCaptionEdit = async (id: string, caption: string) => {
    try {
      const res = await adminFetch(`${getGalleryApi()}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });
      if (res.ok) {
        flash('ok', 'Caption saved.');
        setPhotos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, caption } : p))
        );
      } else {
        flash('err', 'Failed to save caption.');
      }
    } catch {
      flash('err', 'Failed to save caption.');
    }
  };

  const handleCategoryEdit = async (id: string, newCategory: string) => {
    setUpdatingCategoryForId(id);
    try {
      const res = await adminFetch(`${getGalleryApi()}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory || null }),
      });
      if (res.ok) {
        flash('ok', `Category updated to "${getCategoryLabel(newCategory)}".`);
        setPhotos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, category: newCategory || null } : p))
        );
      } else {
        flash('err', 'Failed to update category.');
      }
    } catch {
      flash('err', 'Failed to update category.');
    } finally {
      setUpdatingCategoryForId(null);
    }
  };

  // Filtered photos based on category tab & search query
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesCategory =
        filterCategory === 'all'
          ? true
          : filterCategory === 'uncategorized'
          ? !photo.category
          : photo.category === filterCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        photo.filename.toLowerCase().includes(q) ||
        (photo.caption && photo.caption.toLowerCase().includes(q)) ||
        (photo.category && getCategoryLabel(photo.category).toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [photos, filterCategory, searchQuery]);

  // Counts per category for pills
  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = { all: photos.length, uncategorized: 0 };
    for (const cat of GALLERY_CATEGORIES) {
      map[cat.id] = 0;
    }
    for (const p of photos) {
      if (!p.category) {
        map.uncategorized++;
      } else if (map[p.category] !== undefined) {
        map[p.category]++;
      } else {
        map.uncategorized++;
      }
    }
    return map;
  }, [photos]);

  return (
    <div className="admin-shell">
      {/* Topbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-divider" />
        <span className="admin-topbar-section">Gallery Manager</span>
        <div className="admin-topbar-spacer" />
        <Link href="/gallery" className="admin-topbar-back" target="_blank" rel="noopener noreferrer">
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
          <Link href="/admin/team" className="admin-nav-link">
            <svg className="admin-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            </svg>
            Team &amp; Access
          </Link>
        </aside>

        {/* Main */}
        <main className="admin-main">
          {/* Page header */}
          <div className="admin-page-header">
            <div className="admin-page-eyebrow">Media Management</div>
            <h1 className="admin-page-title">Photo Gallery</h1>
            <p className="admin-page-lead">
              Upload, tag with service categories, and manage project photos shown on the live website. All images are compressed client-side and saved.
            </p>
          </div>

          {/* Stats */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-label">Total Photos</div>
              <div className="admin-stat-value">{photos.length}</div>
              <div className="admin-stat-sub">in Cloud Storage</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">Categorized</div>
              <div className="admin-stat-value">{photos.filter((p) => p.category).length}</div>
              <div className="admin-stat-sub">assigned to a service</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-label">With Captions</div>
              <div className="admin-stat-value">{photos.filter((p) => p.caption).length}</div>
              <div className="admin-stat-sub">captioned images</div>
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
            <div className="admin-section-title">Upload &amp; Tag Photos</div>

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
                  {uploadStatus || 'Processing and uploading photos…'}
                </div>
              ) : (
                <>
                  <div className="admin-dropzone-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className="admin-dropzone-text">Drag &amp; drop images here, or click to browse</div>
                  <div className="admin-dropzone-hint">
                    JPG, PNG, WebP · Auto-resized to Full HD (1920px) &middot; 
                  </div>
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

            {/* Upload Options Row: Category, Compression, Caption */}
            <div className="admin-upload-options-bar">
              <div className="admin-field-inline">
                <label htmlFor="upload-category">Assign Category:</label>
                <select
                  id="upload-category"
                  className="admin-select"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                >
                  {GALLERY_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                  <option value="">None / Uncategorized</option>
                </select>
              </div>

              <div className="admin-field-inline">
                <label className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={compressEnabled}
                    onChange={(e) => setCompressEnabled(e.target.checked)}
                  />
                  <span>Compress before upload (Max 1920px &bull; Saves ~70% bandwidth)</span>
                </label>
              </div>
            </div>

            <div className="admin-caption-row" style={{ marginTop: 10 }}>
              <label htmlFor="upload-caption">Caption for uploaded photos (optional)</label>
              <input
                id="upload-caption"
                type="text"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="e.g. CCTV & IP Camera installation at Achimota, Accra"
              />
            </div>
          </div>

          {/* Section header with search & filter pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 32, marginBottom: 12 }}>
            <div className="admin-section-title" style={{ margin: 0 }}>
              Gallery Photos ({filteredPhotos.length}{filteredPhotos.length !== photos.length ? ` of ${photos.length}` : ''})
            </div>

            {/* Quick search input */}
            <input
              type="text"
              placeholder="Search by caption, file or tag…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-caption-input"
              style={{ maxWidth: 260 }}
            />
          </div>

          {/* Admin Category Filter Pills */}
          <div className="admin-filter-bar">
            <button
              type="button"
              className={`admin-filter-pill${filterCategory === 'all' ? ' admin-filter-pill--active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              All Photos ({countsByCategory.all})
            </button>
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat.id}
                className={`admin-filter-pill${filterCategory === cat.id ? ' admin-filter-pill--active' : ''}`}
                onClick={() => setFilterCategory(cat.id)}
              >
                {cat.label} ({countsByCategory[cat.id] || 0})
              </button>
            ))}
            {countsByCategory.uncategorized > 0 && (
              <button
                type="button"
                className={`admin-filter-pill${filterCategory === 'uncategorized' ? ' admin-filter-pill--active' : ''}`}
                onClick={() => setFilterCategory('uncategorized')}
              >
                Uncategorized ({countsByCategory.uncategorized})
              </button>
            )}
          </div>

          {loading && (
            <div className="admin-loading">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Loading photos…
            </div>
          )}

          {!loading && filteredPhotos.length === 0 && (
            <div className="admin-empty">
              {photos.length === 0 ? (
                <>
                  No photos yet.<br />
                  Upload your first installation photo using the drop zone above.
                </>
              ) : (
                <>
                  No photos matching this filter.<br />
                  Try selecting &quot;All Photos&quot; or clear your search term.
                </>
              )}
            </div>
          )}

          {!loading && filteredPhotos.length > 0 && (
            <div className="admin-gallery-grid">
              {filteredPhotos.map((photo) => {
                const photoSrc =
                  photo.url ||
                  (photo.filename.startsWith('http')
                    ? photo.filename
                    : `/gallery/${photo.filename}`);
                const displayName = photo.filename.includes('/')
                  ? photo.filename.split('/').pop() || photo.filename
                  : photo.filename;
                const isUpdatingCategory = updatingCategoryForId === photo.id;

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
                      {/* Category selector row */}
                      <div className="admin-card-category-row">
                        <span className="admin-category-badge">
                          {getCategoryLabel(photo.category)}
                        </span>
                        <select
                          className="admin-card-category-select"
                          value={photo.category || ''}
                          disabled={isUpdatingCategory}
                          onChange={(e) => handleCategoryEdit(photo.id, e.target.value)}
                          title="Change photo category"
                        >
                          <option value="">-- No Category --</option>
                          {GALLERY_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-gallery-filename" title={photo.filename}>
                        {displayName}
                      </div>

                      <CaptionEditor
                        initial={photo.caption ?? ''}
                        onSave={(v) => handleCaptionEdit(photo.id, v)}
                      />

                      <button
                        className="admin-delete-btn"
                        onClick={() => setPhotoToDelete(photo)}
                        aria-label={`Delete ${displayName}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M9 6V4h6v2" />
                        </svg>
                        Delete photo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* 3. Delete Confirmation Modal Dialog */}
      {photoToDelete && (
        <div
          className="admin-modal-overlay"
          onClick={() => !isDeleting && setPhotoToDelete(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div
            className="admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <div className="admin-modal-header-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2 id="delete-modal-title" className="admin-modal-title">Delete Photo</h2>
            </div>

            <div className="admin-modal-preview">
              <Image
                src={
                  photoToDelete.url ||
                  (photoToDelete.filename.startsWith('http')
                    ? photoToDelete.filename
                    : `/gallery/${photoToDelete.filename}`)
                }
                alt={photoToDelete.caption || photoToDelete.filename}
                fill
                unoptimized={Boolean(photoToDelete.url)}
                className="admin-gallery-img"
              />
            </div>

            <div className="admin-modal-body">
              <p>
                Are you sure you want to permanently delete this photo? This will remove it from the live website gallery and delete the file from storage. <strong>This cannot be undone.</strong>
              </p>

              <div className="admin-modal-details">
                <div className="admin-modal-details-row">
                  <span className="admin-modal-details-label">File Name:</span>
                  <span className="admin-modal-details-value">
                    {photoToDelete.filename.includes('/')
                      ? photoToDelete.filename.split('/').pop() || photoToDelete.filename
                      : photoToDelete.filename}
                  </span>
                </div>
                {photoToDelete.caption && (
                  <div className="admin-modal-details-row">
                    <span className="admin-modal-details-label">Caption:</span>
                    <span className="admin-modal-details-value">{photoToDelete.caption}</span>
                  </div>
                )}
                <div className="admin-modal-details-row">
                  <span className="admin-modal-details-label">Category:</span>
                  <span className="admin-modal-details-value">{getCategoryLabel(photoToDelete.category)}</span>
                </div>
              </div>
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-modal-btn-cancel"
                onClick={() => setPhotoToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-modal-btn-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Deleting…
                  </>
                ) : (
                  'Delete Photo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CaptionEditor({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [val, setVal] = useState(initial);

  useEffect(() => {
    setVal(initial);
  }, [initial]);

  return (
    <form
      className="admin-caption-editor"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(val);
      }}
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
