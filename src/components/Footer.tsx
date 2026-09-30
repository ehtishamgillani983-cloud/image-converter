import React from 'react';
import { ShieldCheck, Lock, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-24 border-t border-slate-800">
      {/* Privacy Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm">
                <strong>Privacy Guaranteed:</strong> Your images are processed directly in your browser whenever possible. Your files are not permanently stored on our servers.
              </p>
            </div>
            <a
              href="/privacy"
              onClick={(e) => handleNav('/privacy', e)}
              className="text-xs text-blue-400 hover:text-blue-300 whitespace-nowrap underline"
            >
              Read our Privacy Policy &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">QuickPixel Tools</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-4">
              Free online image tools for compressing, converting and resizing JPG, PNG, WebP, and HEIC images online. Fast, simple, and privacy-friendly.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side In-Browser Processing</span>
            </div>
          </div>

          {/* Compressors Col */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Compression</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/image-compressor" onClick={(e) => handleNav('/image-compressor', e)} className="hover:text-white transition-colors">
                  Image Compressor
                </a>
              </li>
              <li>
                <a href="/compress-jpg" onClick={(e) => handleNav('/compress-jpg', e)} className="hover:text-white transition-colors">
                  Compress JPG
                </a>
              </li>
              <li>
                <a href="/compress-png" onClick={(e) => handleNav('/compress-png', e)} className="hover:text-white transition-colors">
                  Compress PNG
                </a>
              </li>
              <li>
                <a href="/compress-webp" onClick={(e) => handleNav('/compress-webp', e)} className="hover:text-white transition-colors">
                  Compress WebP
                </a>
              </li>
              <li>
                <a href="/compress-image-to-200kb" onClick={(e) => handleNav('/compress-image-to-200kb', e)} className="hover:text-white transition-colors">
                  Compress to 200KB
                </a>
              </li>
              <li>
                <a href="/compress-image-to-100kb" onClick={(e) => handleNav('/compress-image-to-100kb', e)} className="hover:text-white transition-colors">
                  Compress to 100KB
                </a>
              </li>
            </ul>
          </div>

          {/* Converters & Resizers Col */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Convert & Resize</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/image-resizer" onClick={(e) => handleNav('/image-resizer', e)} className="hover:text-white transition-colors">
                  Image Resizer
                </a>
              </li>
              <li>
                <a href="/jpg-to-png" onClick={(e) => handleNav('/jpg-to-png', e)} className="hover:text-white transition-colors">
                  JPG to PNG
                </a>
              </li>
              <li>
                <a href="/png-to-jpg" onClick={(e) => handleNav('/png-to-jpg', e)} className="hover:text-white transition-colors">
                  PNG to JPG
                </a>
              </li>
              <li>
                <a href="/jpg-to-webp" onClick={(e) => handleNav('/jpg-to-webp', e)} className="hover:text-white transition-colors">
                  JPG to WebP
                </a>
              </li>
              <li>
                <a href="/heic-to-jpg" onClick={(e) => handleNav('/heic-to-jpg', e)} className="hover:text-white transition-colors">
                  HEIC to JPG
                </a>
              </li>
              <li>
                <a href="/image-to-pdf" onClick={(e) => handleNav('/image-to-pdf', e)} className="hover:text-white transition-colors">
                  Image to PDF
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Legal Col */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/tools" onClick={(e) => handleNav('/tools', e)} className="hover:text-white transition-colors">
                  All 20+ Tools
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => handleNav('/blog', e)} className="hover:text-white transition-colors">
                  Optimization Blog
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => handleNav('/privacy', e)} className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => handleNav('/terms', e)} className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleNav('/contact', e)} className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/sitemap" onClick={(e) => handleNav('/sitemap', e)} className="hover:text-white transition-colors">
                  HTML Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} QuickPixel Tools. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for speed, privacy & performance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
