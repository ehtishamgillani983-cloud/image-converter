import React from 'react';

interface AdPlaceholderProps {
  slotName?: string;
  format?: 'horizontal-banner' | 'in-feed' | 'rectangle';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  slotName = 'Sponsored',
  format = 'horizontal-banner',
  className = '',
}) => {
  return (
    <div
      className={`my-8 max-w-5xl mx-auto w-full overflow-hidden transition-all ${className}`}
      aria-label="Advertisement Banner"
    >
      <div className="bg-slate-50/80 border border-dashed border-slate-200 rounded-xl p-3 sm:p-4 text-center">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
          <span>{slotName}</span>
          <span className="text-[10px] text-slate-300">Responsive Ad Slot</span>
        </div>
        <div
          className={`flex items-center justify-center bg-white border border-slate-100 rounded-lg shadow-2xs text-xs text-slate-400 font-medium ${
            format === 'horizontal-banner' ? 'h-20 sm:h-24' : 'h-48'
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-slate-500 font-semibold">QuickPixel Fast Web Hosting & CDN</span>
            <span className="text-[11px] text-slate-400">Lightning-fast edge delivery for compressed images</span>
          </div>
        </div>
      </div>
    </div>
  );
};
