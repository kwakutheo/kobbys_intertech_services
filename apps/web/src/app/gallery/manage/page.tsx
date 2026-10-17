'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
const API = `${API_BASE}/gallery`;
const ADMIN_PASSWORD = 'kobbys2026'; // simple front-door protection

type Photo = {
  id: string;
  filename: string;
  caption: string | null;
  uploadedAt: string;
};

export default function GalleryManagePage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCaption, setUploadCaption] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (type: 'ok' | 'err', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      if (res.ok) {
        const data = await res.json();
        setPhotos(Array.isArray(data) ? data : []);
      } else {
        flash('err', 'Failed to load photos');
      }
    } catch {
      flash('err', 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      void load();
    } else {
      setPwError('Incorrect password.');
    }
  };

  const doUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    let fail = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      if (uploadCaption) fd.append('caption', uploadCaption);
      try {
        const res = await fetch(API, { method: 'POST', body: fd });
        if (res.ok) ok++;
        else fail++;
      } catch {
        fail++;
      }
    }
    setUploading(false);
    setUploadCaption('');
    if (fileRef.current) fileRef.current.value = '';
    flash(fail === 0 ? 'ok' : 'err', `Uploaded ${ok} photo(s)${fail ? `, ${fail} failed` : ''}.`);
    load();
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        flash('ok', 'Photo deleted.');
        load();
      } else {
        flash('err', 'Delete failed.');
      }
    } catch {
      flash('err', 'Delete failed.');
    }
  };

  const handleCaptionEdit = async (id: string, caption: string) => {
    try {
      const res = await fetch(`${API}/${id}`, {
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

  if (!authed) {
    return (
      <main>
        <section className="page-hero">
          <p className="eyebrow">Gallery admin</p>
          <h1>Sign in to manage photos</h1>
        </section>
        <section className="section form-section">
          <form onSubmit={handleLogin} className="enquiry-form" style={{ maxWidth: 360 }}>
            <label>
              Password
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {pwError && <p style={{ color: '#9a001a', margin: 0 }}>{pwError}</p>}
            <button className="button" type="submit">Enter</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero">
        <p className="eyebrow">
          <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>
            ← Admin Dashboard
          </Link>
        </p>
        <h1>Manage Photos</h1>
        <p>{photos.length} photo{photos.length !== 1 ? 's' : ''} in the gallery.</p>
      </section>

      {message && (
        <div className={`form-message ${message.type === 'ok' ? 'form-success' : 'form-error'}`}
          style={{ maxWidth: 900, margin: '0 auto 0', padding: '14px 32px' }}>
          {message.text}
        </div>
      )}

      {/* Upload area */}
      <section className="section" style={{ paddingBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginBottom: 18 }}>Upload new photos</h2>
        <div
          className={`gallery-dropzone${dragOver ? ' gallery-dropzone--active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); doUpload(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
        >
          <span>{uploading ? 'Uploading…' : 'Drag & drop images here, or click to browse'}</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => doUpload(e.target.files)}
          />
        </div>
        <label style={{ display: 'block', marginTop: 14, fontSize: 13, fontWeight: 700, color: '#60636a' }}>
          Caption for all uploaded photos (optional)
          <input
            type="text"
            value={uploadCaption}
            onChange={(e) => setUploadCaption(e.target.value)}
            placeholder="e.g. CCTV installation at Achimota"
            style={{ display: 'block', marginTop: 6, width: '100%', maxWidth: 480, border: '1px solid #b9bbc0', padding: '10px 12px', font: 'inherit', fontSize: 14 }}
          />
        </label>
      </section>

      {/* Photo grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <h2 style={{ fontSize: 22, marginBottom: 18 }}>All photos</h2>
        {loading && <p>Loading…</p>}
        {!loading && photos.length === 0 && <p>No photos yet.</p>}
        <div className="gallery-grid">
          {photos.map((photo) => (
            <figure className="gallery-item gallery-item--admin" key={photo.id}>
              <div className="gallery-img-wrap">
                <Image
                  src={`/gallery/${photo.filename}`}
                  alt={photo.caption ?? photo.filename}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                  className="gallery-img"
                />
              </div>
              <div className="gallery-admin-bar">
                <CaptionEditor
                  initial={photo.caption ?? ''}
                  onSave={(v) => handleCaptionEdit(photo.id, v)}
                />
                <button
                  className="gallery-delete-btn"
                  onClick={() => handleDelete(photo.id, photo.filename)}
                  aria-label={`Delete ${photo.filename}`}
                >
                  🗑 Delete
                </button>
              </div>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}

function CaptionEditor({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [val, setVal] = useState(initial);
  return (
    <form
      style={{ display: 'flex', gap: 6, flex: 1 }}
      onSubmit={(e) => { e.preventDefault(); onSave(val); }}
    >
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Add caption…"
        style={{ flex: 1, border: '1px solid #dedee0', padding: '5px 8px', font: 'inherit', fontSize: 12 }}
      />
      <button type="submit" style={{ padding: '5px 10px', fontSize: 12, background: '#9a001a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
        Save
      </button>
    </form>
  );
}
