import React, { useState } from 'react';
import { Menu, X, Layers, Image as ImageIcon, Zap, Maximize2, Repeat, BookOpen } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={(e) => handleNav('/', e)}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                QuickPixel<span className="text-blue-600">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-600 -mt-1">
                Image Tools
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <a
              href="/image-compressor"
              onClick={(e) => handleNav('/image-compressor', e)}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 hover:bg-slate-100 ${
                currentPath === '/image-compressor' ? 'text-blue-600 font-semibold bg-blue-50/70' : ''
              }`}
            >
              Image Compressor
            </a>
            <a
              href="/jpg-to-png"
              onClick={(e) => handleNav('/jpg-to-png', e)}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 hover:bg-slate-100 ${
                currentPath.includes('to-') ? 'text-blue-600 font-semibold bg-blue-50/70' : ''
              }`}
            >
              Image Converter
            </a>
            <a
              href="/image-resizer"
              onClick={(e) => handleNav('/image-resizer', e)}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 hover:bg-slate-100 ${
                currentPath === '/image-resizer' ? 'text-blue-600 font-semibold bg-blue-50/70' : ''
              }`}
            >
              Image Resizer
            </a>
            <a
              href="/tools"
              onClick={(e) => handleNav('/tools', e)}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 hover:bg-slate-100 ${
                currentPath === '/tools' ? 'text-blue-600 font-semibold bg-blue-50/70' : ''
              }`}
            >
              All Tools
            </a>
            <a
              href="/blog"
              onClick={(e) => handleNav('/blog', e)}
              className={`px-3 py-2 rounded-lg transition-colors hover:text-slate-900 hover:bg-slate-100 ${
                currentPath.startsWith('/blog') ? 'text-blue-600 font-semibold bg-blue-50/70' : ''
              }`}
            >
              Blog
            </a>
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/image-compressor"
              onClick={(e) => handleNav('/image-compressor', e)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              Compress Image
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <a
            href="/image-compressor"
            onClick={(e) => handleNav('/image-compressor', e)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            <Zap className="w-4 h-4 text-blue-600" />
            Image Compressor
          </a>
          <a
            href="/image-resizer"
            onClick={(e) => handleNav('/image-resizer', e)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            <Maximize2 className="w-4 h-4 text-blue-600" />
            Image Resizer
          </a>
          <a
            href="/jpg-to-png"
            onClick={(e) => handleNav('/jpg-to-png', e)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            <Repeat className="w-4 h-4 text-blue-600" />
            Image Converter
          </a>
          <a
            href="/tools"
            onClick={(e) => handleNav('/tools', e)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            All 20+ Tools
          </a>
          <a
            href="/blog"
            onClick={(e) => handleNav('/blog', e)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            Optimization Blog
          </a>
          <div className="pt-3 border-t border-slate-100">
            <a
              href="/image-compressor"
              onClick={(e) => handleNav('/image-compressor', e)}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
            >
              Compress Image
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
