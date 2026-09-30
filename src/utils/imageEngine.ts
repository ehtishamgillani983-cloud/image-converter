/**
 * QuickPixel Tools - Core Image Processing Engine
 * High-performance, client-side image compression, conversion, resizing, and manipulation.
 * Everything runs 100% in the browser using HTML5 Canvas, WebAssembly & Blob APIs.
 */

export interface ProcessOptions {
  mode: 'compress' | 'resize' | 'convert' | 'crop' | 'rotate' | 'quality_reduce' | 'pdf';
  quality: number; // 0.05 to 1.0
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'original';
  targetSizeBytes?: number; // target size in bytes (e.g. 200 * 1024 for 200KB)
  resizeOptions?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
    scalePercent?: number;
  };
  cropOptions?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotateOptions?: {
    degrees: number; // 0, 90, 180, 270
    flipH?: boolean;
    flipV?: boolean;
  };
  pdfOptions?: {
    orientation?: 'portrait' | 'landscape' | 'auto';
    margin?: number;
  };
}

export interface ProcessedResult {
  id: string;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalType: string;
  originalPreviewUrl: string;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  compressedBlob: Blob;
  compressedUrl: string;
  percentageSaved: number;
  format: string;
  processingTimeMs: number;
  error?: string;
}

/**
 * Format bytes to human readable string (e.g. 1.45 MB, 320 KB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Safe Image Loader with robust HEIC / Apple photo support
 */
export async function loadImageFromFile(file: File): Promise<{
  img: HTMLImageElement;
  width: number;
  height: number;
  previewUrl: string;
}> {
  let fileToLoad: File | Blob = file;

  // Handle HEIC / HEIF
  const isHeic =
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  if (isHeic) {
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default || heic2anyModule;
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      fileToLoad = Array.isArray(converted) ? converted[0] : converted;
    } catch (e) {
      console.warn('HEIC in-browser conversion warning:', e);
      throw new Error(
        'Unable to decode HEIC image directly in this browser. Please export as JPG or use a WebP/PNG image.',
      );
    }
  }

  const previewUrl = URL.createObjectURL(fileToLoad);
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve({
        img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        previewUrl,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(previewUrl);
      reject(new Error(`Failed to load "${file.name}". Please ensure it is a valid image file.`));
    };
    img.src = previewUrl;
  });
}

/**
 * Resolve target output MIME type
 */
function resolveMimeType(
  originalType: string,
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'original',
): string {
  if (outputFormat === 'original') {
    if (originalType === 'image/png') return 'image/png';
    if (originalType === 'image/webp') return 'image/webp';
    return 'image/jpeg';
  }
  return outputFormat;
}

/**
 * Render canvas to blob with given mimeType and quality
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas rendering to blob failed'));
        }
      },
      mimeType,
      quality,
    );
  });
}

/**
 * Deep clone a canvas for non-destructive quantization or testing
 */
function cloneCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const copy = document.createElement('canvas');
  copy.width = sourceCanvas.width;
  copy.height = sourceCanvas.height;
  const ctx = copy.getContext('2d', { willReadFrequently: true });
  if (ctx) {
    ctx.drawImage(sourceCanvas, 0, 0);
  }
  return copy;
}

/**
 * Quantize canvas ImageData colors for client-side PNG compression.
 * In HTML5 Canvas, canvas.toBlob('image/png', quality) ignores quality param.
 * This performs color reduction directly on RGBA buffer for PNG deflation.
 */
function quantizeCanvasBuffer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  step: number,
) {
  if (step <= 1) return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const len = data.length;
  const halfStep = Math.floor(step / 2);

  for (let i = 0; i < len; i += 4) {
    const a = data[i + 3];
    if (a < 16) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
      continue;
    } else if (a > 240) {
      data[i + 3] = 255;
    } else {
      data[i + 3] = Math.min(255, Math.floor((a + halfStep) / step) * step);
    }

    data[i] = Math.min(255, Math.floor((data[i] + halfStep) / step) * step);
    data[i + 1] = Math.min(255, Math.floor((data[i + 1] + halfStep) / step) * step);
    data[i + 2] = Math.min(255, Math.floor((data[i + 2] + halfStep) / step) * step);
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Main Image Processing Routine
 */
export async function processSingleImage(
  file: File,
  options: ProcessOptions,
): Promise<ProcessedResult> {
  const startTime = performance.now();
  const { img, width: origW, height: origH, previewUrl } = await loadImageFromFile(file);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D context is unavailable in your browser.');
  }

  // 1. Calculate Target Dimensions
  let targetW = origW;
  let targetH = origH;

  if (options.cropOptions) {
    const { x, y, width: cW, height: cH } = options.cropOptions;
    const safeX = Math.max(0, Math.min(x, origW - 1));
    const safeY = Math.max(0, Math.min(y, origH - 1));
    targetW = Math.max(1, Math.min(cW, origW - safeX));
    targetH = Math.max(1, Math.min(cH, origH - safeY));
  } else if (options.resizeOptions) {
    const { width, height, maintainAspectRatio, scalePercent } = options.resizeOptions;
    if (scalePercent && scalePercent > 0 && scalePercent !== 100) {
      const factor = scalePercent / 100;
      targetW = Math.max(1, Math.round(origW * factor));
      targetH = Math.max(1, Math.round(origH * factor));
    } else if (width && height) {
      targetW = Math.max(1, width);
      targetH = Math.max(1, height);
    } else if (width && !height) {
      targetW = Math.max(1, width);
      targetH = maintainAspectRatio ? Math.max(1, Math.round((origH * width) / origW)) : origH;
    } else if (!width && height) {
      targetH = Math.max(1, height);
      targetW = maintainAspectRatio ? Math.max(1, Math.round((origW * height) / origH)) : origW;
    }
  }

  // 2. Handle Rotation & Orientation
  const degrees = options.rotateOptions?.degrees || 0;
  const flipH = options.rotateOptions?.flipH || false;
  const flipV = options.rotateOptions?.flipV || false;

  const is90or270 = degrees === 90 || degrees === 270;
  canvas.width = is90or270 ? targetH : targetW;
  canvas.height = is90or270 ? targetW : targetH;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  if (degrees !== 0) {
    ctx.rotate((degrees * Math.PI) / 180);
  }
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

  const mimeType = resolveMimeType(file.type, options.outputFormat);

  // If outputting JPEG, fill clean white background to avoid transparent black artifacts
  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-targetW / 2, -targetH / 2, targetW, targetH);
  }

  // Draw source image or cropped region
  if (options.cropOptions) {
    const { x, y } = options.cropOptions;
    ctx.drawImage(img, x, y, targetW, targetH, -targetW / 2, -targetH / 2, targetW, targetH);
  } else {
    ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
  }

  ctx.restore();

  // 3. Compress / Export to Blob
  let finalBlob: Blob;
  const finalQuality = Math.min(Math.max(options.quality, 0.05), 1.0);

  // If Target Size (in bytes) is requested (e.g. Under 200KB, Under 100KB, etc.)
  if (options.targetSizeBytes && options.targetSizeBytes > 0) {
    let minQ = 0.05;
    let maxQ = 0.95;
    let bestBlob: Blob | null = null;

    // Binary search on quality to find best match under target size
    for (let i = 0; i < 6; i++) {
      const midQ = (minQ + maxQ) / 2;
      let testBlob: Blob;

      if (mimeType === 'image/png') {
        const testCanvas = cloneCanvas(canvas);
        const tCtx = testCanvas.getContext('2d', { willReadFrequently: true });
        if (tCtx) {
          quantizeCanvasBuffer(
            tCtx,
            testCanvas.width,
            testCanvas.height,
            Math.max(2, Math.round((1 - midQ) * 32)),
          );
        }
        testBlob = await canvasToBlob(testCanvas, mimeType, 1.0);
      } else {
        testBlob = await canvasToBlob(canvas, mimeType, midQ);
      }

      if (testBlob.size <= options.targetSizeBytes) {
        bestBlob = testBlob;
        minQ = midQ;
      } else {
        maxQ = midQ;
      }
    }

    if (bestBlob) {
      finalBlob = bestBlob;
    } else {
      // Fallback to lowest possible quality
      if (mimeType === 'image/png') {
        const testCanvas = cloneCanvas(canvas);
        const tCtx = testCanvas.getContext('2d', { willReadFrequently: true });
        if (tCtx) {
          quantizeCanvasBuffer(tCtx, testCanvas.width, testCanvas.height, 32);
        }
        finalBlob = await canvasToBlob(testCanvas, mimeType, 1.0);
      } else {
        finalBlob = await canvasToBlob(canvas, mimeType, 0.05);
      }
    }
  } else {
    // Normal quality-based compression/export
    if (mimeType === 'image/png') {
      const testCanvas = cloneCanvas(canvas);
      const tCtx = testCanvas.getContext('2d', { willReadFrequently: true });
      if (tCtx && finalQuality < 0.98) {
        quantizeCanvasBuffer(
          tCtx,
          testCanvas.width,
          testCanvas.height,
          Math.max(2, Math.round((1 - finalQuality) * 32)),
        );
      }
      finalBlob = await canvasToBlob(testCanvas, mimeType, 1.0);
    } else {
      finalBlob = await canvasToBlob(canvas, mimeType, finalQuality);
    }
  }

  const endTime = performance.now();
  const compressedUrl = URL.createObjectURL(finalBlob);

  const percentageSaved =
    finalBlob.size < file.size
      ? Math.max(0, Math.round(((file.size - finalBlob.size) / file.size) * 100))
      : 0;

  return {
    id: Math.random().toString(36).substring(2, 9),
    name: getOutputFilename(file.name, mimeType),
    originalSize: file.size,
    originalWidth: origW,
    originalHeight: origH,
    originalType: file.type,
    originalPreviewUrl: previewUrl,
    compressedSize: finalBlob.size,
    compressedWidth: canvas.width,
    compressedHeight: canvas.height,
    compressedBlob: finalBlob,
    compressedUrl,
    percentageSaved,
    format: mimeType.split('/')[1]?.toUpperCase() || 'JPEG',
    processingTimeMs: Math.round(endTime - startTime),
  };
}

/**
 * Generate output filename with proper extension
 */
export function getOutputFilename(originalName: string, mimeType: string): string {
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  let ext = 'jpg';
  if (mimeType === 'image/png') ext = 'png';
  if (mimeType === 'image/webp') ext = 'webp';
  return `${baseName}-quickpixel.${ext}`;
}

/**
 * Convert multiple processed images into a clean PDF document
 */
export async function convertImagesToPdf(
  images: { blob: Blob; name: string }[],
  orientation: 'portrait' | 'landscape' | 'auto' = 'auto',
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    const dataUrl = await blobToDataUrl(item.blob);
    const imgProps = await getImageProperties(dataUrl);

    let pageOrientation: 'p' | 'l' = 'p';
    if (orientation === 'landscape') pageOrientation = 'l';
    else if (orientation === 'portrait') pageOrientation = 'p';
    else {
      pageOrientation = imgProps.width > imgProps.height ? 'l' : 'p';
    }

    if (i > 0) {
      pdf.addPage('a4', pageOrientation);
    } else {
      if (pageOrientation === 'l') {
        pdf.deletePage(1);
        pdf.addPage('a4', 'l');
      }
    }

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const maxW = pageWidth - margin * 2;
    const maxH = pageHeight - margin * 2;

    const ratio = Math.min(maxW / imgProps.width, maxH / imgProps.height);
    const finalW = imgProps.width * ratio;
    const finalH = imgProps.height * ratio;
    const posX = (pageWidth - finalW) / 2;
    const posY = (pageHeight - finalH) / 2;

    let safeDataUrl = dataUrl;
    let format: 'JPEG' | 'PNG' = 'JPEG';

    if (item.blob.type.includes('png')) {
      format = 'PNG';
    } else {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = imgProps.width;
      offscreenCanvas.height = imgProps.height;
      const oCtx = offscreenCanvas.getContext('2d');
      if (oCtx) {
        oCtx.fillStyle = '#ffffff';
        oCtx.fillRect(0, 0, imgProps.width, imgProps.height);
        const imgEl = new Image();
        imgEl.src = dataUrl;
        await new Promise((res) => {
          imgEl.onload = res;
          imgEl.onerror = res;
        });
        oCtx.drawImage(imgEl, 0, 0);
        safeDataUrl = offscreenCanvas.toDataURL('image/jpeg', 0.92);
        format = 'JPEG';
      }
    }

    pdf.addImage(safeDataUrl, format, posX, posY, finalW, finalH);
  }

  return pdf.output('blob');
}

/**
 * Download a single processed image or PDF
 */
export function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download all processed images as a single ZIP archive
 */
export async function downloadAllAsZip(
  results: ProcessedResult[],
  archiveName: string = 'quickpixel-images.zip',
) {
  const jszipModule = await import('jszip');
  const JSZip = (jszipModule && 'default' in jszipModule ? jszipModule.default : jszipModule) as typeof import('jszip');
  const zip = new JSZip();
  results.forEach((res, index) => {
    const ext = res.format.toLowerCase() === 'jpeg' ? 'jpg' : res.format.toLowerCase();
    const baseName = res.name.endsWith(`.${ext}`) ? res.name : `${res.name}.${ext}`;
    const uniqueName =
      results.filter((r) => r.name === res.name).length > 1 ? `${index + 1}-${baseName}` : baseName;
    zip.file(uniqueName, res.compressedBlob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(zipBlob);
  triggerDownload(zipUrl, archiveName);
  setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
}

// Helpers
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getImageProperties(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = dataUrl;
  });
}
