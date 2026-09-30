import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowRight, Search, Clock, Calendar, User } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface BlogHubPageProps {
  onNavigate: (path: string) => void;
}

export const BlogHubPage: React.FC<BlogHubPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'Image Optimization Blog & Guides | QuickPixel Tools';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredPosts = BLOG_POSTS.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs items={[{ name: 'Blog', url: '/blog' }]} onNavigate={onNavigate} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto my-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Image Optimization Guides &amp; Tutorials
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          In-depth tutorials, performance analyses, and technical guides on image compression, next-gen formats, and web speed optimization.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search guides (e.g. 200KB, WebP, JPG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs text-slate-800"
          />
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>{post.category}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5 leading-snug">
                <a
                  href={`/blog/${post.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/blog/${post.slug}`);
                  }}
                >
                  {post.title}
                </a>
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                {post.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span className="text-slate-400 font-normal">{post.publishDate}</span>
              <a
                href={`/blog/${post.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/blog/${post.slug}`);
                }}
                className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
