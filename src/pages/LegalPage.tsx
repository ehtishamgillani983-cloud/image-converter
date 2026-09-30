import React, { useEffect } from 'react';
import { ShieldCheck, FileText, Mail, Map, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { TOOLS_DATA } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';
import { getSiteOrigin } from '../utils/seo';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'contact' | 'sitemap';
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  useEffect(() => {
    let title = 'Privacy Policy | QuickPixel Tools';
    if (type === 'terms') title = 'Terms of Service | QuickPixel Tools';
    if (type === 'contact') title = 'Contact & Support | QuickPixel Tools';
    if (type === 'sitemap') title = 'HTML Sitemap | QuickPixel Tools';
    document.title = title;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('content', `${getSiteOrigin()}/${type}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type]);

  if (type === 'sitemap') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ name: 'Sitemap', url: '/sitemap' }]} onNavigate={onNavigate} />

        <div className="my-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">QuickPixel HTML Sitemap</h1>
          <p className="mt-2 text-sm text-slate-600">
            Direct navigation links to all public image compression tools, format converters, and optimization tutorials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
          {/* Tools List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Image Tools &amp; Converters ({TOOLS_DATA.length})
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Homepage &bull; Free Online Image Compressor
                </a>
              </li>
              <li>
                <a
                  href="/tools"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/tools');
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  All Tools Hub Directory
                </a>
              </li>
              {TOOLS_DATA.map((t) => (
                <li key={t.slug}>
                  <a
                    href={`/${t.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/${t.slug}`);
                    }}
                    className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    {t.name} &ndash; <span className="text-slate-400">{t.metaTitle.split('|')[0]}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog Articles */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Optimization Guides &amp; Blog ({BLOG_POSTS.length})
            </h2>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/blog"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/blog');
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Blog Hub Directory
                </a>
              </li>
              {BLOG_POSTS.map((p) => (
                <li key={p.slug}>
                  <a
                    href={`/blog/${p.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/blog/${p.slug}`);
                    }}
                    className="text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'privacy') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ name: 'Privacy Policy', url: '/privacy' }]} onNavigate={onNavigate} />

        <article className="my-8 bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-2xs prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
          <div className="flex items-center gap-3 not-prose mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 m-0">Privacy Policy</h1>
              <p className="text-xs text-slate-500 m-0">Last updated: September 28, 2026</p>
            </div>
          </div>

          <h2>1. Core Privacy Promise: In-Browser Processing</h2>
          <p>
            At QuickPixel Tools, privacy is our foundational architecture. <strong>Your images are processed directly inside your browser whenever possible. Your files are not permanently stored on our servers.</strong>
          </p>
          <p>
            When you select or drag photos into our tools, modern HTML5 Canvas, WebAssembly, and Blob technologies compress, resize, and convert your images using the computing power of your own device (desktop or mobile). The byte stream remains in your local RAM memory and never transmits to external storage volumes.
          </p>

          <h2>2. Information We Do Not Collect</h2>
          <ul>
            <li>We do not collect or archive user-uploaded photographs or artwork.</li>
            <li>We do not require user accounts, passwords, or telephone numbers.</li>
            <li>We do not scan your images for biometric recognition or AI dataset training.</li>
          </ul>

          <h2>3. Web Analytics &amp; Cookies</h2>
          <p>
            To monitor site uptime, detect client errors, and assess page performance, we may use privacy-preserving anonymized web analytics. These aggregate statistics evaluate general metrics (e.g. browser type, country of origin, session duration) without identifying individual persons.
          </p>

          <h2>4. Third-Party Advertisements</h2>
          <p>
            QuickPixel Tools may display non-intrusive banner advertisements to fund free hosting. Third-party ad vendors may use standard cookies to serve ads based on prior web visits. You can opt out of personalized advertising by visiting your browser settings or aboutads.info.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions about our privacy practices, contact us at <code className="text-blue-600">support@quickpixel.ai.studio</code>.
          </p>
        </article>
      </div>
    );
  }

  if (type === 'terms') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ name: 'Terms of Service', url: '/terms' }]} onNavigate={onNavigate} />

        <article className="my-8 bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-2xs prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4">
          <div className="flex items-center gap-3 not-prose mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 m-0">Terms of Service</h1>
              <p className="text-xs text-slate-500 m-0">Last updated: September 28, 2026</p>
            </div>
          </div>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using QuickPixel Tools, you agree to comply with and be bound by these Terms of Service. If you do not agree, please discontinue use of the website.
          </p>

          <h2>2. License and Acceptable Use</h2>
          <p>
            QuickPixel Tools grants you a personal, non-exclusive, revocable license to utilize our browser-based image utilities for personal or commercial purposes. You agree not to attempt to reverse engineer, disrupt our website infrastructure, or introduce malicious payloads.
          </p>

          <h2>3. Intellectual Property Rights</h2>
          <p>
            You retain 100% of your ownership and copyright in all images, photos, and assets you process with QuickPixel Tools. We claim no ownership, license, or distribution rights over your content.
          </p>

          <h2>4. Disclaimer of Warranties</h2>
          <p>
            QuickPixel Tools is provided on an "as is" and "as available" basis without warranties of any kind. While we rigorously test our image compression algorithms, we recommend maintaining original backups of critical photographic archives before applying permanent overwrites.
          </p>
        </article>
      </div>
    );
  }

  // Contact Page
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs items={[{ name: 'Contact', url: '/contact' }]} onNavigate={onNavigate} />

      <div className="my-8 bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-2xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contact QuickPixel Tools</h1>
            <p className="text-xs text-slate-500">We appreciate bug reports, feature requests, and optimization feedback.</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Thank you! Your feedback has been received.');
          }}
          className="space-y-4 text-xs sm:text-sm"
        >
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
            <input
              type="text"
              required
              placeholder="Alex Johnson"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Message</label>
            <textarea
              rows={5}
              required
              placeholder="Tell us what tool or feature you'd like to see next..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-2xs"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};
