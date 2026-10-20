export interface GalleryCategory {
  id: string;
  label: string;
  shortLabel: string;
  color?: string;
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: 'cctv-security', label: 'CCTV & Security', shortLabel: 'CCTV' },
  { id: 'fibre-internet', label: 'Fibre Internet', shortLabel: 'Fibre' },
  { id: 'networking', label: 'Networking & Wi-Fi', shortLabel: 'Networking' },
  { id: 'satellite', label: 'Satellite & TV', shortLabel: 'Satellite' },
  { id: 'electrical-works', label: 'Electrical Works', shortLabel: 'Electrical' },
  { id: 'gps-tracking', label: 'GPS Tracking', shortLabel: 'GPS' },
  { id: 'general', label: 'General Works', shortLabel: 'General' },
];

export function getCategoryLabel(categoryId: string | null | undefined): string {
  if (!categoryId) return 'Uncategorized';
  const found = GALLERY_CATEGORIES.find((c) => c.id === categoryId);
  return found ? found.label : categoryId;
}

export function getCategoryShortLabel(categoryId: string | null | undefined): string {
  if (!categoryId) return 'Uncategorized';
  const found = GALLERY_CATEGORIES.find((c) => c.id === categoryId);
  return found ? found.shortLabel : categoryId;
}
