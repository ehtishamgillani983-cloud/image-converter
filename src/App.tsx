import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ToolPage } from './pages/ToolPage';
import { AllToolsPage } from './pages/AllToolsPage';
import { BlogHubPage } from './pages/BlogHubPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { getToolBySlug } from './data/toolsData';
import { getBlogPostBySlug } from './data/blogData';

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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Header currentPath={currentPath} onNavigate={navigateTo} />
      <main className="flex-1">{renderRoute()}</main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
