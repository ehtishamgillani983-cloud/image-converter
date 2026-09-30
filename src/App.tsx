import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { getToolBySlug } from './data/toolsData';
import { getBlogPostBySlug } from './data/blogData';

// Lazy load secondary routes to ensure fast mobile initial payload
const ToolPage = lazy(() => import('./pages/ToolPage').then((m) => ({ default: m.ToolPage })));
const AllToolsPage = lazy(() => import('./pages/AllToolsPage').then((m) => ({ default: m.AllToolsPage })));
const BlogHubPage = lazy(() => import('./pages/BlogHubPage').then((m) => ({ default: m.BlogHubPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })));
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[45vh] w-full">
    <div className="flex flex-col items-center gap-2.5">
      <div className="w-7 h-7 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      <span className="text-xs font-medium text-slate-500">Loading...</span>
    </div>
  </div>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (path === currentPath) return;
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Route matching
  const renderRoute = () => {
    const cleanPath = currentPath.replace(/\/+$/, '') || '/';

    // 1. Home
    if (cleanPath === '/') {
      return <HomePage onNavigate={navigateTo} />;
    }

    // 2. All Tools Directory
    if (cleanPath === '/tools') {
      return <AllToolsPage onNavigate={navigateTo} />;
    }

    // 3. Blog Hub
    if (cleanPath === '/blog') {
      return <BlogHubPage onNavigate={navigateTo} />;
    }

    // 4. Individual Blog Post
    if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace('/blog/', '');
      const post = getBlogPostBySlug(slug);
      if (post) {
        return <BlogPostPage post={post} onNavigate={navigateTo} />;
      }
      return <NotFoundPage onNavigate={navigateTo} />;
    }

    // 5. Legal & Utility Pages
    if (cleanPath === '/privacy') {
      return <LegalPage type="privacy" onNavigate={navigateTo} />;
    }
    if (cleanPath === '/terms') {
      return <LegalPage type="terms" onNavigate={navigateTo} />;
    }
    if (cleanPath === '/contact') {
      return <LegalPage type="contact" onNavigate={navigateTo} />;
    }
    if (cleanPath === '/sitemap') {
      return <LegalPage type="sitemap" onNavigate={navigateTo} />;
    }

    // 6. Individual Tool Pages
    const toolSlug = cleanPath.replace(/^\//, '');
    const tool = getToolBySlug(toolSlug);
    if (tool) {
      return <ToolPage tool={tool} onNavigate={navigateTo} />;
    }

    // 7. Not Found
    return <NotFoundPage onNavigate={navigateTo} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased w-full overflow-x-hidden">
      <Header currentPath={currentPath} onNavigate={navigateTo} />
      <main className="flex-1 w-full overflow-x-hidden">
        <Suspense fallback={<PageLoadingFallback />}>
          {renderRoute()}
        </Suspense>
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
