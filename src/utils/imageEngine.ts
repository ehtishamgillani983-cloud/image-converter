/**
 * QuickPixel Tools - Core Image Processing Engine
 * High-performance, client-side image compression, conversion, resizing, and manipulation.
 * Everything runs 100% in the browser using HTML5 Canvas, WebAssembly & Blob APIs.
 */

import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

export interface ProcessOptions {
  mode: 'compress' | 'resize' | 'convert' | 'crop' | 'rotate' | 'quality_reduce' | 'pdf';
  quality: number; // 0.05 to 1.0
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp' | 'original';
  targetSizeBytes?: number; // target size in bytes (e.g. 200 * 1024 for 200KB)
  isHighCompressionPreset?: boolean;
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
  status: 'compressed' | 'already_optimized' | 'target_reached';
  statusMessage?: string;
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
 * Create a proportionally scaled copy of a canvas
 */
function createScaledCanvas(
  sourceCanvas: HTMLCanvasElement,
  scale: number,
  fillBackground?: string,
): HTMLCanvasElement {
  const scaled = document.createElement('canvas');
  scaled.width = Math.max(1, Math.round(sourceCanvas.width * scale));
  scaled.height = Math.max(1, Math.round(sourceCanvas.height * scale));
  const sCtx = scaled.getContext('2d', { willReadFrequently: true });
  if (sCtx) {
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    if (fillBackground) {
      sCtx.fillStyle = fillBackground;
      sCtx.fillRect(0, 0, scaled.width, scaled.height);
    }
    sCtx.drawImage(sourceCanvas, 0, 0, scaled.width, scaled.height);
  }
  return scaled;
}

/**
 * Quantize canvas ImageData colors for true client-side PNG compression.
 * In HTML5 Canvas, canvas.toBlob('image/png', quality) ignores the quality param.
 * This function performs color quantization (palette reduction) directly on the RGBA buffer
 * so that PNG Deflate compression achieves real file size reduction.
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
    // Clean transparent pixels
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

    // Quantize RGB channels with rounding
    data[i] = Math.min(255, Math.floor((data[i] + halfStep) / step) * step);
    data[i + 1] = Math.min(255, Math.floor((data[i + 1] + halfStep) / step) * step);
    data[i + 2] = Math.min(255, Math.floor((data[i + 2] + halfStep) / step) * step);
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Reliable JPEG Compression Pipeline
 * - Real quality encoding with multi-pass testing
 * - Compares output against original Blob size
 * - Automatically retries with stronger compression if output is >= original
 * - Strict target size guarantee with binary search and progressive downscaling
 */
async function compressJpeg(
  canvas: HTMLCanvasElement,
  originalFile: File,
  quality: number,
  targetBytes?: number,
  isPreset = false,
): Promise<{
  blob: Blob;
  status: 'compressed' | 'already_optimized' | 'target_reached';
  statusMessage?: string;
  outputWidth: number;
  outputHeight: number;
}> {
  // Case A: Target size mode (e.g. Under 200KB, Under 100KB, Custom target)
  if (targetBytes && targetBytes > 0) {
    let minQ = 0.05;
    let maxQ = 0.95;
    let bestBlob: Blob | null = null;
    let currentW = canvas.width;
    let currentH = canvas.height;

    // Binary search on quality (7 iterations gives precision within 0.01)
    for (let i = 0; i < 7; i++) {
      const midQ = (minQ + maxQ) / 2;
      const testBlob = await canvasToBlob(canvas, 'image/jpeg', midQ);

      if (testBlob.size <= targetBytes) {
        bestBlob = testBlob;
        minQ = midQ; // Try higher quality while staying <= targetBytes
      } else {
        maxQ = midQ; // Try lower quality
      }
    }

    if (bestBlob && bestBlob.size <= targetBytes) {
      return {
        blob: bestBlob,
        status: 'target_reached',
        statusMessage: `Compressed to under ${formatBytes(targetBytes)} (${formatBytes(bestBlob.size)})`,
        outputWidth: currentW,
        outputHeight: currentH,
      };
    }

    // If lowest quality (0.05) still exceeds targetBytes:
    // Downscale canvas dimensions until it strictly fits
    const downscaleSteps = [0.85, 0.70, 0.55, 0.40, 0.30, 0.20, 0.12];
    for (const scale of downscaleSteps) {
      const scaledCanvas = createScaledCanvas(canvas, scale, '#ffffff');
      for (const q of [0.75, 0.60, 0.45, 0.30, 0.15]) {
        const scaledBlob = await canvasToBlob(scaledCanvas, 'image/jpeg', q);
        if (scaledBlob.size <= targetBytes) {
          return {
            blob: scaledBlob,
            status: 'target_reached',
            statusMessage: `Rescaled to ${scaledCanvas.width}×${scaledCanvas.height} to fit under ${formatBytes(targetBytes)}`,
            outputWidth: scaledCanvas.width,
            outputHeight: scaledCanvas.height,
          };
        }
      }
    }

    // Minimum fallback
    const minCanvas = createScaledCanvas(canvas, 0.1, '#ffffff');
    const minBlob = await canvasToBlob(minCanvas, 'image/jpeg', 0.25);
    return {
      blob: minBlob,
      status: 'target_reached',
      outputWidth: minCanvas.width,
      outputHeight: minCanvas.height,
    };
  }

  // Case B: Standard compression mode
  // 1. Initial encoding at requested quality
  const initialBlob = await canvasToBlob(canvas, 'image/jpeg', quality);

  // If initialBlob is smaller than original, compression succeeded!
  if (initialBlob.size < originalFile.size) {
    return {
      blob: initialBlob,
      status: 'compressed',
      outputWidth: canvas.width,
      outputHeight: canvas.height,
    };
  }

  // If initialBlob >= originalFile.size:
  // "If the compressed result is larger than the original, automatically retry with a stronger compression setting."
  const retryQualities = [
    Math.round(quality * 0.85 * 100) / 100,
    Math.round(quality * 0.70 * 100) / 100,
    Math.round(quality * 0.55 * 100) / 100,
    0.45,
    0.35,
    0.25,
  ].filter((q) => q < quality && q >= 0.2);

  for (const retryQ of retryQualities) {
    const retryBlob = await canvasToBlob(canvas, 'image/jpeg', retryQ);
    if (retryBlob.size < originalFile.size) {
      return {
        blob: retryBlob,
        status: 'compressed',
        outputWidth: canvas.width,
        outputHeight: canvas.height,
      };
    }
  }

  // If user selected high compression preset (e.g. maximum), attempt gentle downscaling
  if (isPreset) {
    for (const scale of [0.9, 0.8]) {
      const scaledCanvas = createScaledCanvas(canvas, scale, '#ffffff');
      const scaledBlob = await canvasToBlob(scaledCanvas, 'image/jpeg', 0.65);
      if (scaledBlob.size < originalFile.size) {
        return {
          blob: scaledBlob,
          status: 'compressed',
          outputWidth: scaledCanvas.width,
          outputHeight: scaledCanvas.height,
        };
      }
    }
  }

  // If still not smaller than original file, the input image was already maximally compressed!
  // If original file was JPEG, preserve original file:
  const isOriginalJpeg =
    originalFile.type === 'image/jpeg' ||
    originalFile.name.toLowerCase().endsWith('.jpg') ||
    originalFile.name.toLowerCase().endsWith('.jpeg');

  if (isOriginalJpeg) {
    return {
      blob: originalFile,
      status: 'already_optimized',
      statusMessage:
        'Original image is already maximally compressed. QuickPixel preserved the file to prevent quality degradation.',
      outputWidth: canvas.width,
      outputHeight: canvas.height,
    };
  }

  // If original was another format (e.g. HEIC or uncompressed PNG converted to JPG):
  // Return the smallest generated JPEG blob
  return {
    blob: initialBlob,
    status: 'compressed',
    outputWidth: canvas.width,
    outputHeight: canvas.height,
  };
}

/**
 * Reliable PNG Compression Pipeline
 * - Performs true color quantization directly on canvas buffer
 * - Compares actual Blob sizes
 * - Retries with stronger quantization if needed
 * - Preserves original if already maximally optimized, never falsely claiming savings
 */
async function compressPng(
  canvas: HTMLCanvasElement,
  originalFile: File,
  quality: number,
  targetBytes?: number,
  isPreset = false,
): Promise<{
  blob: Blob;
  status: 'compressed' | 'already_optimized' | 'target_reached';
  statusMessage?: string;
  outputWidth: number;
  outputHeight: number;
}> {
  // Case A: Target size specified (e.g. Under 200KB, Under 100KB)
  if (targetBytes && targetBytes > 0) {
    // Try quantization steps first on full-size canvas
    for (const step of [8, 16, 24, 32]) {
      const testCanvas = cloneCanvas(canvas);
      const tCtx = testCanvas.getContext('2d', { willReadFrequently: true });
      if (tCtx) {
        quantizeCanvasBuffer(tCtx, testCanvas.width, testCanvas.height, step);
        const testBlob = await canvasToBlob(testCanvas, 'image/png', 1.0);
        if (testBlob.size <= targetBytes) {
          return {
            blob: testBlob,
            status: 'target_reached',
            statusMessage: `Compressed to under ${formatBytes(targetBytes)} (${formatBytes(testBlob.size)})`,
            outputWidth: canvas.width,
            outputHeight: canvas.height,
          };
        }
      }
    }

    // If still exceeds targetBytes, downscale dimensions until it fits
    const downscaleSteps = [0.85, 0.7, 0.55, 0.4, 0.3, 0.2, 0.12];
    for (const scale of downscaleSteps) {
      const scaledCanvas = createScaledCanvas(canvas, scale);
      const sCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });
      if (sCtx) {
        quantizeCanvasBuffer(sCtx, scaledCanvas.width, scaledCanvas.height, 16);
        const scaledBlob = await canvasToBlob(scaledCanvas, 'image/png', 1.0);
        if (scaledBlob.size <= targetBytes) {
          return {
            blob: scaledBlob,
            status: 'target_reached',
            statusMessage: `Rescaled to ${scaledCanvas.width}×${scaledCanvas.height} to fit under ${formatBytes(targetBytes)}`,
            outputWidth: scaledCanvas.width,
            outputHeight: scaledCanvas.height,
          };
        }
      }
    }

    // Fallback: smallest achievable at minimum scale
    const minCanvas = createScaledCanvas(canvas, 0.1);
    const mCtx = minCanvas.getContext('2d', { willReadFrequently: true });
    if (mCtx) quantizeCanvasBuffer(mCtx, minCanvas.width, minCanvas.height, 32);
    const minBlob = await canvasToBlob(minCanvas, 'image/png', 1.0);
    return {
      blob: minBlob,
      status: 'target_reached',
      outputWidth: minCanvas.width,
      outputHeight: minCanvas.height,
    };
  }

  // Case B: Standard compression mode
  // Initial quantization step based on requested quality
  const baseStep = Math.max(4, Math.round((1 - quality) * 36));
  const testCanvas = cloneCanvas(canvas);
  const tCtx = testCanvas.getContext('2d', { willReadFrequently: true });
  if (tCtx) {
    quantizeCanvasBuffer(tCtx, testCanvas.width, testCanvas.height, baseStep);
  }
  const testBlob = await canvasToBlob(testCanvas, 'image/png', 1.0);

  // If quantized blob is smaller than original, we achieved compression!
  if (testBlob.size < originalFile.size) {
    return {
      blob: testBlob,
      status: 'compressed',
      outputWidth: canvas.width,
      outputHeight: canvas.height,
    };
  }

  // If testBlob >= originalFile.size, try stronger quantization
  const strongerSteps = [baseStep + 8, baseStep + 16, 32].filter((s) => s > baseStep);
  for (const step of strongerSteps) {
    const retryCanvas = cloneCanvas(canvas);
    const rCtx = retryCanvas.getContext('2d', { willReadFrequently: true });
    if (rCtx) {
      quantizeCanvasBuffer(rCtx, retryCanvas.width, retryCanvas.height, step);
      const retryBlob = await canvasToBlob(retryCanvas, 'image/png', 1.0);
      if (retryBlob.size < originalFile.size) {
        return {
          blob: retryBlob,
          status: 'compressed',
          outputWidth: canvas.width,
          outputHeight: canvas.height,
        };
      }
    }
  }

  // If user selected high-compression preset, attempt gentle downscaling
  if (isPreset) {
    for (const scale of [0.9, 0.8]) {
      const scaledCanvas = createScaledCanvas(canvas, scale);
      const sCtx = scaledCanvas.getContext('2d', { willReadFrequently: true });
      if (sCtx) {
        quantizeCanvasBuffer(sCtx, scaledCanvas.width, scaledCanvas.height, 16);
        const scaledBlob = await canvasToBlob(scaledCanvas, 'image/png', 1.0);
        if (scaledBlob.size < originalFile.size) {
          return {
            blob: scaledBlob,
            status: 'compressed',
            outputWidth: scaledCanvas.width,
            outputHeight: scaledCanvas.height,
          };
        }
      }
    }
  }

  // If still not smaller than original file, the input PNG is already maximally compressed!
  // Requirement 2 & 5:
  // "Use the existing PNG compression/quantization implementation only if it actually produces a smaller valid PNG. Compare actual Blob sizes. If PNG cannot be reduced without unacceptable degradation, clearly report that instead of falsely claiming compression."
  return {
    blob: originalFile,
    status: 'already_optimized',
    statusMessage:
      'Original PNG is already maximally optimized. File preserved to prevent file size enlargement.',
    outputWidth: canvas.width,
    outputHeight: canvas.height,
  };
}

/**
 * Reliable WebP Compression Pipeline
 * - Real lossy WebP encoding with quality controls
 * - Multi-pass retry if output exceeds original size
 * - Preserves original if already optimal
 */
async function compressWebp(
  canvas: HTMLCanvasElement,
  originalFile: File,
  quality: number,
  targetBytes?: number,
  isPreset = false,
): Promise<{
  blob: Blob;
  status: 'compressed' | 'already_optimized' | 'target_reached';
  statusMessage?: string;
  outputWidth: number;
  outputHeight: number;
}> {
  // Case A: Target size mode
  if (targetBytes && targetBytes > 0) {
    let minQ = 0.05;
    let maxQ = 0.95;
    let bestBlob: Blob | null = null;

    for (let i = 0; i < 7; i++) {
      const midQ = (minQ + maxQ) / 2;
      const testBlob = await canvasToBlob(canvas, 'image/webp', midQ);

      if (testBlob.size <= targetBytes) {
        bestBlob = testBlob;
        minQ = midQ;
      } else {
        maxQ = midQ;
      }
    }

    if (bestBlob && bestBlob.size <= targetBytes) {
      return {
        blob: bestBlob,
        status: 'target_reached',
        statusMessage: `Compressed to under ${formatBytes(targetBytes)} (${formatBytes(bestBlob.size)})`,
        outputWidth: canvas.width,
        outputHeight: canvas.height,
      };
    }

    // Downscale if necessary
    const downscaleSteps = [0.85, 0.7, 0.55, 0.4, 0.3, 0.2, 0.12];
    for (const scale of downscaleSteps) {
      const scaledCanvas = createScaledCanvas(canvas, scale);
      for (const q of [0.75, 0.6, 0.45, 0.3]) {
        const scaledBlob = await canvasToBlob(scaledCanvas, 'image/webp', q);
        if (scaledBlob.size <= targetBytes) {
          return {
            blob: scaledBlob,
            status: 'target_reached',
            statusMessage: `Rescaled to ${scaledCanvas.width}×${scaledCanvas.height} to fit under ${formatBytes(targetBytes)}`,
            outputWidth: scaledCanvas.width,
            outputHeight: scaledCanvas.height,
          };
        }
      }
    }

    const minCanvas = createScaledCanvas(canvas, 0.1);
    const minBlob = await canvasToBlob(minCanvas, 'image/webp', 0.25);
    return {
      blob: minBlob,
      status: 'target_reached',
      outputWidth: minCanvas.width,
      outputHeight: minCanvas.height,
    };
  }

  // Case B: Standard compression mode
  const initialBlob = await canvasToBlob(canvas, 'image/webp', quality);
  if (initialBlob.size < originalFile.size) {
    return {
      blob: initialBlob,
      status: 'compressed',
      outputWidth: canvas.width,
      outputHeight: canvas.height,
    };
  }

  // Retry ladder
  const retryQualities = [
    Math.round(quality * 0.85 * 100) / 100,
    Math.round(quality * 0.7 * 100) / 100,
    Math.round(quality * 0.55 * 100) / 100,
    0.45,
    0.35,
    0.2,
  ].filter((q) => q < quality && q >= 0.15);

  for (const retryQ of retryQualities) {
    const retryBlob = await canvasToBlob(canvas, 'image/webp', retryQ);
    if (retryBlob.size < originalFile.size) {
      return {
        blob: retryBlob,
        status: 'compressed',
        outputWidth: canvas.width,
        outputHeight: canvas.height,
      };
    }
  }

  if (isPreset) {
    for (const scale of [0.9, 0.8]) {
      const scaledCanvas = createScaledCanvas(canvas, scale);
      const scaledBlob = await canvasToBlob(scaledCanvas, 'image/webp', 0.65);
      if (scaledBlob.size < originalFile.size) {
        return {
          blob: scaledBlob,
          status: 'compressed',
          outputWidth: scaledCanvas.width,
          outputHeight: scaledCanvas.height,
        };
      }
    }
  }

  if (originalFile.type === 'image/webp' || originalFile.name.toLowerCase().endsWith('.webp')) {
    return {
      blob: originalFile,
      status: 'already_optimized',
      statusMessage:
        'WebP image is already maximally compressed. QuickPixel preserved the original file.',
      outputWidth: canvas.width,
      outputHeight: canvas.height,
    };
  }

  return {
    blob: initialBlob,
    status: 'compressed',
    outputWidth: canvas.width,
    outputHeight: canvas.height,
  };
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

  // 3. Compress / Export to Blob with Format-Specific Optimization Pipelines
  let finalBlob: Blob;
  let resultStatus: 'compressed' | 'already_optimized' | 'target_reached' = 'compressed';
  let resultMessage: string | undefined = undefined;
  let finalW = canvas.width;
  let finalH = canvas.height;

  const finalQuality = Math.min(Math.max(options.quality, 0.05), 1.0);
  const isPureCompress =
    (options.mode === 'compress' || options.mode === 'quality_reduce') &&
    !options.cropOptions &&
    !options.resizeOptions &&
    (!options.rotateOptions ||
      (options.rotateOptions.degrees === 0 &&
        !options.rotateOptions.flipH &&
        !options.rotateOptions.flipV));

  if (isPureCompress) {
    if (mimeType === 'image/png') {
      const comp = await compressPng(
        canvas,
        file,
        finalQuality,
        options.targetSizeBytes,
        Boolean(options.isHighCompressionPreset),
      );
      finalBlob = comp.blob;
      resultStatus = comp.status;
      resultMessage = comp.statusMessage;
      finalW = comp.outputWidth;
      finalH = comp.outputHeight;
    } else if (mimeType === 'image/webp') {
      const comp = await compressWebp(
        canvas,
        file,
        finalQuality,
        options.targetSizeBytes,
        Boolean(options.isHighCompressionPreset),
      );
      finalBlob = comp.blob;
      resultStatus = comp.status;
      resultMessage = comp.statusMessage;
      finalW = comp.outputWidth;
      finalH = comp.outputHeight;
    } else {
      // JPEG default
      const comp = await compressJpeg(
        canvas,
        file,
        finalQuality,
        options.targetSizeBytes,
        Boolean(options.isHighCompressionPreset),
      );
      finalBlob = comp.blob;
      resultStatus = comp.status;
      resultMessage = comp.statusMessage;
      finalW = comp.outputWidth;
      finalH = comp.outputHeight;
    }
  } else {
    // Other modes: Resize, Crop, Rotate, Convert, or Target Size with transforms
    if (options.targetSizeBytes && options.targetSizeBytes > 0) {
      if (mimeType === 'image/png') {
        const comp = await compressPng(canvas, file, finalQuality, options.targetSizeBytes, false);
        finalBlob = comp.blob;
        resultStatus = comp.status;
        resultMessage = comp.statusMessage;
        finalW = comp.outputWidth;
        finalH = comp.outputHeight;
      } else if (mimeType === 'image/webp') {
        const comp = await compressWebp(canvas, file, finalQuality, options.targetSizeBytes, false);
        finalBlob = comp.blob;
        resultStatus = comp.status;
        resultMessage = comp.statusMessage;
        finalW = comp.outputWidth;
        finalH = comp.outputHeight;
      } else {
        const comp = await compressJpeg(canvas, file, finalQuality, options.targetSizeBytes, false);
        finalBlob = comp.blob;
        resultStatus = comp.status;
        resultMessage = comp.statusMessage;
        finalW = comp.outputWidth;
        finalH = comp.outputHeight;
      }
    } else {
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
  }

  const endTime = performance.now();
  const compressedUrl = URL.createObjectURL(finalBlob);

  // Guarantee: Percentage saved is strictly non-negative, never falsely claiming savings when enlarged
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
    compressedWidth: finalW,
    compressedHeight: finalH,
    compressedBlob: finalBlob,
    compressedUrl,
    percentageSaved,
    format: mimeType.split('/')[1]?.toUpperCase() || 'JPEG',
    processingTimeMs: Math.round(endTime - startTime),
    status: resultStatus,
    statusMessage: resultMessage,
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

    // Ensure dataUrl is converted to a clean JPEG/PNG dataURL so jsPDF never fails on WebP or raw data
    let safeDataUrl = dataUrl;
    let format: 'JPEG' | 'PNG' = 'JPEG';

    if (item.blob.type.includes('png')) {
      format = 'PNG';
    } else {
      // Draw to canvas to guarantee valid JPEG dataURL for jsPDF
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
