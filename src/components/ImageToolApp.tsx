import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  FileImage,
  Download,
  Trash2,
  Sliders,
  Maximize2,
  RefreshCw,
  Crop,
  RotateCw,
  RotateCcw,
  FileText,
  CheckCircle,
  Archive,
  ArrowRight,
  Info,
  Check,
  ChevronDown,
  Sparkles,
  Zap,
  AlertTriangle,
  X,
  Move,
  CornerDownRight,
} from 'lucide-react';
import {
  ProcessOptions,
  ProcessedResult,
  processSingleImage,
  formatBytes,
  triggerDownload,
  downloadAllAsZip,
  convertImagesToPdf,
} from '../utils/imageEngine';

interface ImageToolAppProps {
  initialSlug?: string;
  initialMode?: 'compress' | 'resize' | 'convert' | 'crop' | 'rotate' | 'quality_reduce' | 'pdf';
  initialFormat?: 'image/jpeg' | 'image/png' | 'image/webp' | 'original';
  initialQuality?: number;
  initialTargetSizeBytes?: number;
  onNavigate?: (path: string) => void;
}

export const ImageToolApp: React.FC<ImageToolAppProps> = ({
  initialSlug = 'image-compressor',
  initialMode = 'compress',
  initialFormat = 'original',
  initialQuality = 0.8,
  initialTargetSizeBytes,
  onNavigate,
}) => {
  // State for files & results
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeResultIndex, setActiveResultIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings
  const [mode, setMode] = useState<ProcessOptions['mode']>(initialMode);
  const [quality, setQuality] = useState<number>(initialQuality);
  const [outputFormat, setOutputFormat] = useState<ProcessOptions['outputFormat']>(initialFormat);
  const [targetSizePreset, setTargetSizePreset] = useState<string>(
    initialTargetSizeBytes ? String(initialTargetSizeBytes) : 'none',
  );
  const [customTargetKb, setCustomTargetKb] = useState<number>(200);

  // Presets
  const [activePreset, setActivePreset] = useState<string>('balanced');

  // Resize State
  const [resizeWidth, setResizeWidth] = useState<number>(1920);
  const [resizeHeight, setResizeHeight] = useState<number>(1080);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [originalAspect, setOriginalAspect] = useState<number>(16 / 9);

  // Rotate State
  const [rotateDeg, setRotateDeg] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Crop State
  const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '4:3' | '16:9'>('free');
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropWidth, setCropWidth] = useState<number>(800);
  const [cropHeight, setCropHeight] = useState<number>(600);
  const [isCroppingActive, setIsCroppingActive] = useState<boolean>(false);

  // PDF State
  const [pdfOrientation, setPdfOrientation] = useState<'portrait' | 'landscape' | 'auto'>('auto');

  // Drag & Drop
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Interactive Comparison Slider
  const [compareSliderPos, setCompareSliderPos] = useState<number>(50);
  const [compareMode, setCompareMode] = useState<'split' | 'toggle'>('split');
  const [toggleState, setToggleState] = useState<'before' | 'after'>('after');

  // Sync initial props when navigating between tools
  useEffect(() => {
    setMode(initialMode);
    setOutputFormat(initialFormat);
    setQuality(initialQuality);
    if (initialTargetSizeBytes) {
      setTargetSizePreset(String(initialTargetSizeBytes));
    }
  }, [initialMode, initialFormat, initialQuality, initialTargetSizeBytes]);

  // Execute processing on current files with optional direct overrides to prevent React stale closure lag
  const processFiles = useCallback(
    async (
      files: File[],
      overrides?: {
        mode?: ProcessOptions['mode'];
        quality?: number;
        outputFormat?: ProcessOptions['outputFormat'];
        targetSizeBytes?: number | null;
        resizeOptions?: ProcessOptions['resizeOptions'];
        rotateOptions?: ProcessOptions['rotateOptions'];
        cropOptions?: ProcessOptions['cropOptions'];
      },
    ) => {
      if (files.length === 0) return;
      setIsProcessing(true);
      setErrorMessage(null);

      const activeMode = overrides?.mode ?? mode;
      const activeQuality = overrides?.quality ?? quality;
      const activeFormat = overrides?.outputFormat ?? outputFormat;

      let targetBytes: number | undefined = undefined;
      if (overrides?.targetSizeBytes !== undefined) {
        targetBytes = overrides.targetSizeBytes === null ? undefined : overrides.targetSizeBytes;
      } else if (targetSizePreset === 'custom') {
        targetBytes = customTargetKb * 1024;
      } else if (targetSizePreset !== 'none') {
        targetBytes = parseInt(targetSizePreset, 10);
      }

      const activeResize =
        overrides?.resizeOptions ??
        (activeMode === 'resize'
          ? {
              width: scalePercent === 100 ? resizeWidth : undefined,
              height: scalePercent === 100 ? resizeHeight : undefined,
              maintainAspectRatio: maintainAspect,
              scalePercent: scalePercent !== 100 ? scalePercent : undefined,
            }
          : undefined);

      const activeRotate =
        overrides?.rotateOptions ??
        (activeMode === 'rotate'
          ? {
              degrees: rotateDeg,
              flipH,
              flipV,
            }
          : undefined);

      const activeCrop =
        overrides?.cropOptions ??
        (activeMode === 'crop' && isCroppingActive
          ? {
              x: cropX,
              y: cropY,
              width: cropWidth,
              height: cropHeight,
            }
          : undefined);

      const isHighPreset =
        activePreset === 'maximum' || activePreset === 'whatsapp' || activePreset === 'email';

      const options: ProcessOptions = {
        mode: activeMode,
        quality: activeQuality,
        outputFormat: activeFormat,
        targetSizeBytes: targetBytes,
        isHighCompressionPreset: isHighPreset,
        resizeOptions: activeResize,
        rotateOptions: activeRotate,
        cropOptions: activeCrop,
      };

      try {
        const newResults: ProcessedResult[] = [];
        for (const file of files) {
          const res = await processSingleImage(file, options);
          newResults.push(res);
        }
        setResults(newResults);
        if (newResults.length > 0) {
          setActiveResultIndex(0);
          const first = newResults[0];
          // Update natural dimensions for controls
          setResizeWidth(first.originalWidth);
          setResizeHeight(first.originalHeight);
          setOriginalAspect(first.originalWidth / first.originalHeight);
          if (!isCroppingActive) {
            setCropX(0);
            setCropY(0);
            setCropWidth(first.originalWidth);
            setCropHeight(first.originalHeight);
          }
        }
      } catch (err: any) {
        console.error('Processing error:', err);
        setErrorMessage(
          err.message || 'An unexpected error occurred while processing the images. Please check the file format.',
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [
      mode,
      quality,
      outputFormat,
      targetSizePreset,
      customTargetKb,
      resizeWidth,
      resizeHeight,
      maintainAspect,
      scalePercent,
      rotateDeg,
      flipH,
      flipV,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      isCroppingActive,
    ],
  );

  const handleApplySettings = () => {
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter(
      (f) =>
        f.type.startsWith('image/') ||
        f.name.toLowerCase().endsWith('.heic') ||
        f.name.toLowerCase().endsWith('.heif'),
    );
    if (validFiles.length === 0) {
      setErrorMessage('Please upload a supported image file (JPG, PNG, WebP, or HEIC).');
      return;
    }

    const combined = [...selectedFiles, ...validFiles];
    setSelectedFiles(combined);
    processFiles(combined);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const clearAll = () => {
    results.forEach((r) => {
      URL.revokeObjectURL(r.originalPreviewUrl);
      URL.revokeObjectURL(r.compressedUrl);
    });
    setSelectedFiles([]);
    setResults([]);
    setActiveResultIndex(0);
    setErrorMessage(null);
    setIsCroppingActive(false);
    setRotateDeg(0);
    setFlipH(false);
    setFlipV(false);
  };

  const removeSingleImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const itemToRemove = results[index];
    if (itemToRemove) {
      URL.revokeObjectURL(itemToRemove.originalPreviewUrl);
      URL.revokeObjectURL(itemToRemove.compressedUrl);
    }
    const newResults = results.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setResults(newResults);
    setActiveResultIndex(Math.max(0, Math.min(activeResultIndex, newResults.length - 1)));
  };

  const handleDownloadAllZip = () => {
    if (results.length === 0) return;
    downloadAllAsZip(results, 'quickpixel-optimized-images.zip');
  };

  const handleDownloadPdf = async () => {
    if (results.length === 0) return;
    try {
      setIsProcessing(true);
      const items = results.map((r) => ({ blob: r.compressedBlob, name: r.name }));
      const pdfBlob = await convertImagesToPdf(items, pdfOrientation);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      triggerDownload(pdfUrl, 'quickpixel-document.pdf');
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 15000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Preset Handlers with immediate re-processing
  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    let newQuality = quality;
    let newFormat = outputFormat;
    let newTargetBytes: number | null = null;

    if (preset === 'balanced') {
      newQuality = 0.82;
      newFormat = 'original';
      newTargetBytes = null;
      setTargetSizePreset('none');
    } else if (preset === 'website') {
      newQuality = 0.8;
      newFormat = 'image/webp';
      newTargetBytes = null;
      setTargetSizePreset('none');
    } else if (preset === 'email') {
      newQuality = 0.72;
      newFormat = 'image/jpeg';
      newTargetBytes = 500 * 1024;
      setTargetSizePreset(String(500 * 1024));
    } else if (preset === 'whatsapp') {
      newQuality = 0.75;
      newFormat = 'image/jpeg';
      newTargetBytes = 300 * 1024;
      setTargetSizePreset(String(300 * 1024));
    } else if (preset === 'social') {
      newQuality = 0.85;
      newFormat = 'image/jpeg';
      newTargetBytes = null;
      setTargetSizePreset('none');
    } else if (preset === 'maximum') {
      newQuality = 0.45;
      newTargetBytes = null;
      setTargetSizePreset('none');
    }

    setQuality(newQuality);
    setOutputFormat(newFormat);

    if (selectedFiles.length > 0) {
      processFiles(selectedFiles, {
        quality: newQuality,
        outputFormat: newFormat,
        targetSizeBytes: newTargetBytes,
      });
    }
  };

  const handleWidthChange = (val: number) => {
    const safeW = Math.max(1, Math.min(16000, val));
    setResizeWidth(safeW);
    if (maintainAspect && originalAspect > 0) {
      setResizeHeight(Math.max(1, Math.round(safeW / originalAspect)));
    }
  };

  const handleHeightChange = (val: number) => {
    const safeH = Math.max(1, Math.min(16000, val));
    setResizeHeight(safeH);
    if (maintainAspect && originalAspect > 0) {
      setResizeWidth(Math.max(1, Math.round(safeH * originalAspect)));
    }
  };

  // Crop Aspect ratio calculation helper
  const handleCropAspectSelect = (ratio: 'free' | '1:1' | '4:3' | '16:9') => {
    setCropAspect(ratio);
    if (!activeResult) return;
    const ow = activeResult.originalWidth;
    const oh = activeResult.originalHeight;
    let cw = ow;
    let ch = oh;

    if (ratio === '1:1') {
      const side = Math.min(ow, oh);
      cw = side;
      ch = side;
    } else if (ratio === '4:3') {
      if (ow / oh > 4 / 3) {
        ch = oh;
        cw = Math.round((oh * 4) / 3);
      } else {
        cw = ow;
        ch = Math.round((ow * 3) / 4);
      }
    } else if (ratio === '16:9') {
      if (ow / oh > 16 / 9) {
        ch = oh;
        cw = Math.round((oh * 16) / 9);
      } else {
        cw = ow;
        ch = Math.round((ow * 9) / 16);
      }
    }

    const cx = Math.max(0, Math.round((ow - cw) / 2));
    const cy = Math.max(0, Math.round((oh - ch) / 2));
    setCropX(cx);
    setCropY(cy);
    setCropWidth(cw);
    setCropHeight(ch);
  };

  const applyCropAction = () => {
    if (!activeResult) return;
    setIsCroppingActive(true);
    processFiles(selectedFiles, {
      mode: 'crop',
      cropOptions: {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
      },
    });
  };

  const resetCropAction = () => {
    if (!activeResult) return;
    setIsCroppingActive(false);
    setCropX(0);
    setCropY(0);
    setCropWidth(activeResult.originalWidth);
    setCropHeight(activeResult.originalHeight);
    processFiles(selectedFiles, {
      mode: 'compress',
    });
  };

  const activeResult = results[activeResultIndex] || null;

  // Calculate totals
  const totalOriginalBytes = results.reduce((acc, r) => acc + r.originalSize, 0);
  const totalCompressedBytes = results.reduce((acc, r) => acc + r.compressedSize, 0);
  const totalSavedBytes = Math.max(0, totalOriginalBytes - totalCompressedBytes);
  const overallSavedPercent =
    totalOriginalBytes > 0 ? Math.round((totalSavedBytes / totalOriginalBytes) * 100) : 0;

  return (
    <div className="w-full">
      {/* Upload Zone & Interactive App Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden transition-all">
        {/* Top Control Bar / Tool Mode Tabs */}
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setMode('compress');
                if (selectedFiles.length > 0) {
                  processFiles(selectedFiles, { mode: 'compress' });
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                mode === 'compress'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Compress
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('resize');
                if (selectedFiles.length > 0) {
                  processFiles(selectedFiles, { mode: 'resize' });
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                mode === 'resize'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Resize
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('crop');
                if (selectedFiles.length > 0) {
                  processFiles(selectedFiles, { mode: 'crop' });
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                mode === 'crop'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              Crop
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('convert');
                if (selectedFiles.length > 0) {
                  processFiles(selectedFiles, { mode: 'convert' });
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                mode === 'convert'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Convert
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('rotate');
                if (selectedFiles.length > 0) {
                  processFiles(selectedFiles, { mode: 'rotate' });
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                mode === 'rotate'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              Rotate / Flip
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('pdf');
                if (selectedFiles.length > 0) {
                  processFiles(selectedFiles, { mode: 'pdf' });
                }
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                mode === 'pdf'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              To PDF
            </button>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            {isProcessing ? (
              <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Optimizing in Browser...
              </span>
            ) : results.length > 0 ? (
              <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                {results.length} {results.length === 1 ? 'image' : 'images'} ready
              </span>
            ) : (
              <span>100% Client-Side In Browser</span>
            )}
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-3 text-xs text-red-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Drop Zone (Always visible when empty, compact when files exist) */}
        {selectedFiles.length === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer p-8 sm:p-14 text-center transition-all flex flex-col items-center justify-center border-2 border-dashed m-4 sm:m-6 rounded-xl ${
              isDragOver
                ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/40 hover:bg-blue-50/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFilesAdded(e.target.files)}
              multiple
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              Drop your image here
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              or <span className="text-blue-600 font-semibold underline decoration-blue-300 underline-offset-2">Choose Image</span> from your computer or phone
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-400 mb-4">
              <span>Supported formats:</span>
              <span className="text-slate-700 font-semibold">JPG • PNG • WebP • HEIC</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
              <span>No signup required</span>
              <span className="text-slate-300">·</span>
              <span>Free to use</span>
              <span className="text-slate-300">·</span>
              <span>Fast browser processing</span>
            </div>
          </div>
        ) : (
          /* Workspace with Uploaded Images */
          <div className="p-4 sm:p-6 space-y-6">
            {/* Action Bar: Stats + Batch Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Total Saved</span>
                  <div className="flex items-baseline gap-2">
                    {overallSavedPercent > 0 ? (
                      <>
                        <span className="text-2xl font-extrabold text-emerald-600">
                          -{overallSavedPercent}%
                        </span>
                        <span className="text-xs text-slate-500">
                          ({formatBytes(totalSavedBytes)} saved)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-extrabold text-slate-700">
                          0%
                        </span>
                        <span className="text-xs text-slate-500">
                          (Already optimal)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                <div className="text-xs text-slate-500 hidden sm:block">
                  <div>Original: <strong className="text-slate-700">{formatBytes(totalOriginalBytes)}</strong></div>
                  <div>Optimized: <strong className="text-slate-700">{formatBytes(totalCompressedBytes)}</strong></div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFilesAdded(e.target.files)}
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Add More
                </button>

                {mode === 'pdf' ? (
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDownloadAllZip}
                    disabled={results.length === 0}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Download All (ZIP)
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearAll}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear all images"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Multi-image Thumbnail Strip if > 1 image */}
            {results.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {results.map((res, idx) => (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setActiveResultIndex(idx)}
                    className={`shrink-0 flex items-center gap-2 p-1.5 pr-3 rounded-lg border text-left text-xs transition-all ${
                      idx === activeResultIndex
                        ? 'border-blue-600 bg-blue-50/70 shadow-2xs font-medium text-blue-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={res.compressedUrl}
                      alt={res.name}
                      className="w-8 h-8 rounded object-cover border border-slate-200"
                    />
                    <div className="truncate max-w-[120px]">
                      <div className="truncate">{res.name}</div>
                      <div className={`text-[10px] font-bold ${res.percentageSaved > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {res.percentageSaved > 0 ? `-${res.percentageSaved}%` : 'Optimal'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Main Interactive Workspace: Settings on Left/Top, Comparison Preview on Right/Bottom */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Settings Panel */}
              <div className="lg:col-span-5 space-y-5 bg-slate-50/60 p-4 sm:p-5 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    Optimization Settings
                  </h3>
                  <button
                    type="button"
                    onClick={handleApplySettings}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Apply Changes
                  </button>
                </div>

                {/* 1. Target Size Feature (High Priority) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Compress to Target Size
                    </label>
                    <span className="text-[11px] text-slate-500">Auto-calculated</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    {[
                      { label: 'Auto (None)', val: 'none' },
                      { label: 'Under 100 KB', val: String(100 * 1024) },
                      { label: 'Under 200 KB', val: String(200 * 1024) },
                      { label: 'Under 500 KB', val: String(500 * 1024) },
                      { label: 'Under 1 MB', val: String(1024 * 1024) },
                      { label: 'Under 2 MB', val: String(2 * 1024 * 1024) },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => {
                          setTargetSizePreset(item.val);
                          const bytes = item.val === 'none' ? null : parseInt(item.val, 10);
                          processFiles(selectedFiles, { targetSizeBytes: bytes });
                        }}
                        className={`py-1.5 px-2 rounded-md border text-center transition-colors font-medium ${
                          targetSizePreset === item.val
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Target Size */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetSizePreset('custom');
                        processFiles(selectedFiles, { targetSizeBytes: customTargetKb * 1024 });
                      }}
                      className={`text-xs px-2.5 py-1.5 rounded-md border font-medium ${
                        targetSizePreset === 'custom'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Custom Size
                    </button>
                    {targetSizePreset === 'custom' && (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="number"
                          min="10"
                          max="20000"
                          value={customTargetKb}
                          onChange={(e) => {
                            const val = Math.max(10, parseInt(e.target.value) || 10);
                            setCustomTargetKb(val);
                          }}
                          className="w-24 px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
                        />
                        <span className="text-xs text-slate-500 font-medium">KB</span>
                        <button
                          type="button"
                          onClick={() => processFiles(selectedFiles, { targetSizeBytes: customTargetKb * 1024 })}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Presets Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Optimization Presets
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {[
                      { id: 'balanced', label: 'Balanced Quality' },
                      { id: 'website', label: 'Compress for Website' },
                      { id: 'email', label: 'Compress for Email' },
                      { id: 'whatsapp', label: 'Compress for WhatsApp' },
                      { id: 'social', label: 'Compress for Social' },
                      { id: 'maximum', label: 'Maximum Compression' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => applyPreset(p.id)}
                        className={`py-1.5 px-2 rounded-md border text-left text-xs transition-colors font-medium truncate ${
                          activePreset === p.id
                            ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Quality Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Quality Level</span>
                    <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="1.0"
                    step="0.01"
                    value={quality}
                    onChange={(e) => {
                      const newQ = parseFloat(e.target.value);
                      setQuality(newQ);
                      setActivePreset('custom');
                    }}
                    onMouseUp={() => processFiles(selectedFiles, { quality })}
                    onTouchEnd={() => processFiles(selectedFiles, { quality })}
                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Smaller file</span>
                    <span>High fidelity</span>
                  </div>
                </div>

                {/* 4. Output Format */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Output Format
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[
                      { id: 'original', label: 'Original' },
                      { id: 'image/jpeg', label: 'JPG' },
                      { id: 'image/png', label: 'PNG' },
                      { id: 'image/webp', label: 'WebP' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => {
                          const newFmt = fmt.id as ProcessOptions['outputFormat'];
                          setOutputFormat(newFmt);
                          processFiles(selectedFiles, { outputFormat: newFmt });
                        }}
                        className={`py-1.5 rounded-md border font-medium transition-colors ${
                          outputFormat === fmt.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Resize Controls (if mode == resize) */}
                {mode === 'resize' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-700">Resize Dimensions</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-slate-500">Width (px)</span>
                        <input
                          type="number"
                          min="1"
                          max="16000"
                          value={resizeWidth}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500">Height (px)</span>
                        <input
                          type="number"
                          min="1"
                          max="16000"
                          value={resizeHeight}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
                          className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={maintainAspect}
                        onChange={(e) => setMaintainAspect(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>Maintain aspect ratio</span>
                    </label>

                    {/* Scale Presets */}
                    <div className="flex items-center gap-1 text-xs">
                      {[25, 50, 75, 100, 150, 200].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => {
                            setScalePercent(pct);
                            if (activeResult) {
                              const factor = pct / 100;
                              const w = Math.round(activeResult.originalWidth * factor);
                              const h = Math.round(activeResult.originalHeight * factor);
                              setResizeWidth(w);
                              setResizeHeight(h);
                              processFiles(selectedFiles, {
                                resizeOptions: {
                                  width: w,
                                  height: h,
                                  maintainAspectRatio: maintainAspect,
                                },
                              });
                            }
                          }}
                          className={`px-2 py-1 rounded text-[11px] border font-medium ${
                            scalePercent === pct ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Crop Controls (if mode == crop) */}
                {mode === 'crop' && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">Crop Controls</label>
                      {isCroppingActive && (
                        <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Crop Applied
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-xs">
                      {(['free', '1:1', '4:3', '16:9'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => handleCropAspectSelect(ratio)}
                          className={`py-1.5 rounded border text-center font-medium capitalize ${
                            cropAspect === ratio
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>

                    {/* Numeric Coordinate Controls */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500">Crop Width (px)</span>
                        <input
                          type="number"
                          min="1"
                          max={activeResult?.originalWidth || 8000}
                          value={cropWidth}
                          onChange={(e) => setCropWidth(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Crop Height (px)</span>
                        <input
                          type="number"
                          min="1"
                          max={activeResult?.originalHeight || 8000}
                          value={cropHeight}
                          onChange={(e) => setCropHeight(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Offset X (px)</span>
                        <input
                          type="number"
                          min="0"
                          value={cropX}
                          onChange={(e) => setCropX(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">Offset Y (px)</span>
                        <input
                          type="number"
                          min="0"
                          value={cropY}
                          onChange={(e) => setCropY(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={applyCropAction}
                        className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        Apply Crop
                      </button>
                      <button
                        type="button"
                        onClick={resetCropAction}
                        className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded border border-slate-300 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. Rotate / Flip Controls (if mode == rotate) */}
                {mode === 'rotate' && (
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Rotate & Flip Controls</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          const newDeg = (rotateDeg - 90 + 360) % 360;
                          setRotateDeg(newDeg);
                          processFiles(selectedFiles, {
                            rotateOptions: { degrees: newDeg, flipH, flipV },
                          });
                        }}
                        className="p-2 bg-white border border-slate-200 rounded font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                        Rotate Left (-90°)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newDeg = (rotateDeg + 90) % 360;
                          setRotateDeg(newDeg);
                          processFiles(selectedFiles, {
                            rotateOptions: { degrees: newDeg, flipH, flipV },
                          });
                        }}
                        className="p-2 bg-white border border-slate-200 rounded font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-blue-600" />
                        Rotate Right (+90°)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newDeg = (rotateDeg + 180) % 360;
                          setRotateDeg(newDeg);
                          processFiles(selectedFiles, {
                            rotateOptions: { degrees: newDeg, flipH, flipV },
                          });
                        }}
                        className="p-2 bg-white border border-slate-200 rounded font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-blue-600" />
                        Rotate 180°
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newH = !flipH;
                          setFlipH(newH);
                          processFiles(selectedFiles, {
                            rotateOptions: { degrees: rotateDeg, flipH: newH, flipV },
                          });
                        }}
                        className={`p-2 border rounded font-medium transition-colors ${
                          flipH ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        Flip Horizontal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newV = !flipV;
                          setFlipV(newV);
                          processFiles(selectedFiles, {
                            rotateOptions: { degrees: rotateDeg, flipH, flipV: newV },
                          });
                        }}
                        className={`p-2 border rounded font-medium transition-colors ${
                          flipV ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        Flip Vertical
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRotateDeg(0);
                          setFlipH(false);
                          setFlipV(false);
                          processFiles(selectedFiles, {
                            rotateOptions: { degrees: 0, flipH: false, flipV: false },
                          });
                        }}
                        className="p-2 bg-slate-100 border border-slate-200 rounded font-medium text-slate-700 hover:bg-slate-200"
                      >
                        Reset Orientation
                      </button>
                    </div>
                  </div>
                )}

                {/* 8. PDF Controls (if mode == pdf) */}
                {mode === 'pdf' && (
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-700">PDF Page Orientation</label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {['auto', 'portrait', 'landscape'].map((orient) => (
                        <button
                          key={orient}
                          type="button"
                          onClick={() => setPdfOrientation(orient as any)}
                          className={`py-1.5 rounded border capitalize font-medium ${
                            pdfOrientation === orient ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {orient}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleApplySettings}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Optimizing Image...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      Re-process Images
                    </>
                  )}
                </button>
              </div>

              {/* Preview & Result Card */}
              <div className="lg:col-span-7 space-y-4">
                {activeResult ? (
                  <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-800 flex flex-col">
                    {/* Header bar */}
                    <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-2 truncate max-w-[200px] sm:max-w-xs">
                        <FileImage className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="truncate font-medium text-white">{activeResult.name}</span>
                      </div>

                      {/* Comparison View Switcher */}
                      <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[11px]">
                        <button
                          type="button"
                          onClick={() => setCompareMode('split')}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            compareMode === 'split' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Split Slider
                        </button>
                        <button
                          type="button"
                          onClick={() => setCompareMode('toggle')}
                          className={`px-2 py-0.5 rounded transition-colors ${
                            compareMode === 'toggle' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Toggle
                        </button>
                      </div>
                    </div>

                    {/* Interactive Image Container */}
                    <div className="relative h-72 sm:h-96 w-full bg-slate-950 flex items-center justify-center overflow-hidden select-none">
                      {compareMode === 'split' ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Compressed Image (Background) */}
                          <img
                            src={activeResult.compressedUrl}
                            alt="Compressed preview"
                            className="absolute max-h-full max-w-full object-contain pointer-events-none"
                          />

                          {/* Original Image (Clipped Overlay) */}
                          <div
                            className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
                            style={{ clipPath: `inset(0 ${100 - compareSliderPos}% 0 0)` }}
                          >
                            <img
                              src={activeResult.originalPreviewUrl}
                              alt="Original preview"
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>

                          {/* Split Divider Handle */}
                          <div
                            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-md flex items-center justify-center"
                            style={{ left: `${compareSliderPos}%` }}
                          >
                            <div className="w-6 h-6 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center text-[10px] font-bold">
                              &harr;
                            </div>
                          </div>

                          {/* Slider Input overlay */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={compareSliderPos}
                            onChange={(e) => setCompareSliderPos(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                          />

                          {/* Labels */}
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none z-10">
                            Original: {formatBytes(activeResult.originalSize)}
                          </div>
                          <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded pointer-events-none z-10">
                            Optimized: {formatBytes(activeResult.compressedSize)}{' '}
                            {activeResult.percentageSaved > 0
                              ? `(-${activeResult.percentageSaved}%)`
                              : '(Optimal)'}
                          </div>
                        </div>
                      ) : (
                        /* Toggle Mode */
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={toggleState === 'before' ? activeResult.originalPreviewUrl : activeResult.compressedUrl}
                            alt={toggleState}
                            className="max-h-full max-w-full object-contain"
                          />
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 backdrop-blur-md p-1 rounded-lg">
                            <button
                              type="button"
                              onClick={() => setToggleState('before')}
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                toggleState === 'before' ? 'bg-white text-slate-900' : 'text-slate-300'
                              }`}
                            >
                              Before ({formatBytes(activeResult.originalSize)})
                            </button>
                            <button
                              type="button"
                              onClick={() => setToggleState('after')}
                              className={`px-3 py-1 rounded text-xs font-semibold ${
                                toggleState === 'after' ? 'bg-blue-600 text-white' : 'text-slate-300'
                              }`}
                            >
                              After ({formatBytes(activeResult.compressedSize)})
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status Note if image was already optimal or rescaled to fit target */}
                    {activeResult.statusMessage && (
                      <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{activeResult.statusMessage}</span>
                      </div>
                    )}

                    {/* Stats & Download Row */}
                    <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="grid grid-cols-3 gap-4 text-center sm:text-left w-full sm:w-auto">
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Dimensions</span>
                          <span className="text-xs text-slate-200 font-mono">
                            {activeResult.compressedWidth} &times; {activeResult.compressedHeight}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Format</span>
                          <span className="text-xs text-slate-200 font-mono">{activeResult.format}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Reduction</span>
                          <span
                            className={`text-xs font-bold ${
                              activeResult.percentageSaved > 0 ? 'text-emerald-400' : 'text-slate-300'
                            }`}
                          >
                            {activeResult.percentageSaved > 0
                              ? `-${activeResult.percentageSaved}%`
                              : '0% (Optimal)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => removeSingleImage(activeResultIndex)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg text-xs"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerDownload(activeResult.compressedUrl, activeResult.name)}
                          className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download Image
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No image preview available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
