/**
 * Client-side image compression and size check utility using the HTML5 Canvas API.
 * Compresses images before upload to save bandwidth, stay within hosting limits,
 * and ensure blazing-fast loading on the public gallery.
 */

export interface CompressionOptions {
  /** Maximum width in pixels (defaults to 1920) */
  maxWidth?: number;
  /** Maximum height in pixels (defaults to 1920) */
  maxHeight?: number;
  /** Compression quality between 0 and 1 (defaults to 0.85) */
  quality?: number;
  /** Skip compression if file size is below this threshold in bytes (defaults to 250KB) */
  minCompressBytes?: number;
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  wasCompressed: boolean;
  savedPercent: number;
}

/** Formats bytes into human-readable string (e.g. "1.8 MB", "340 KB") */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Compresses an image File using Canvas API.
 * Supports JPEG, PNG, WebP, etc.
 * Preserves GIFs and non-images without compression to avoid breaking animations.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {},
): Promise<CompressionResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    minCompressBytes = 250 * 1024, // 250 KB
  } = options;

  const originalSize = file.size;

  // Don't process non-images or animated GIFs
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      width: 0,
      height: 0,
      wasCompressed: false,
      savedPercent: 0,
    };
  }

  // If already smaller than threshold, keep original
  if (originalSize <= minCompressBytes) {
    return {
      file,
      originalSize,
      compressedSize: originalSize,
      width: 0,
      height: 0,
      wasCompressed: false,
      savedPercent: 0,
    };
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const originalWidth = width;
      const originalHeight = height;

      // Calculate new dimensions preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          file,
          originalSize,
          compressedSize: originalSize,
          width: originalWidth,
          height: originalHeight,
          wasCompressed: false,
          savedPercent: 0,
        });
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format (JPEG is universally supported and compresses photos best)
      const outputType = file.type === 'image/png' && !hasAlphaChannel(ctx, width, height)
        ? 'image/jpeg'
        : file.type === 'image/webp'
        ? 'image/webp'
        : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= originalSize) {
            // If compressed is larger or failed, keep original file
            resolve({
              file,
              originalSize,
              compressedSize: originalSize,
              width: originalWidth,
              height: originalHeight,
              wasCompressed: false,
              savedPercent: 0,
            });
            return;
          }

          // Build new filename with proper extension if type changed
          let newName = file.name;
          if (outputType === 'image/jpeg' && !/\.(jpe?g)$/i.test(newName)) {
            newName = newName.replace(/\.[^/.]+$/, '') + '.jpg';
          }

          const compressedFile = new File([blob], newName, {
            type: outputType,
            lastModified: Date.now(),
          });

          const savedPercent = Math.round(((originalSize - blob.size) / originalSize) * 100);

          resolve({
            file: compressedFile,
            originalSize,
            compressedSize: blob.size,
            width,
            height,
            wasCompressed: true,
            savedPercent,
          });
        },
        outputType,
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        file,
        originalSize,
        compressedSize: originalSize,
        width: 0,
        height: 0,
        wasCompressed: false,
        savedPercent: 0,
      });
    };

    img.src = objectUrl;
  });
}

/** Quick check to detect if canvas has transparent pixels */
function hasAlphaChannel(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    // Sample a few pixels across corners and center for performance
    const samplePoints = [
      [0, 0],
      [width - 1, 0],
      [0, height - 1],
      [width - 1, height - 1],
      [Math.floor(width / 2), Math.floor(height / 2)],
    ];
    for (const [x, y] of samplePoints) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[3] < 255) return true;
    }
    return false;
  } catch {
    return true;
  }
}
