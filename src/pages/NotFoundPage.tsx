import React, { useEffect } from 'react';
import { HelpCircle, ArrowRight, Home, Zap } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = '404 - Page Not Found | QuickPixel Tools';
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
        <HelpCircle className="w-8 h-8" />
      </div>
      <span className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">Error 404</span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2 mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
        The tool or page you requested could not be located. It may have been moved or updated.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Go to Homepage
        </button>
        <button
          type="button"
          onClick={() => onNavigate('/tools')}
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-blue-600" />
          View All Tools
        </button>
      </div>
    </div>
  );
};
