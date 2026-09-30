import React, { useEffect } from 'react';
import { Clock, Calendar, User, ArrowRight, Zap, Share2 } from 'lucide-react';
import { BlogPost, BLOG_POSTS } from '../data/blogData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { getSiteOrigin } from '../utils/seo';

interface BlogPostPageProps {
  post: BlogPost;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, onNavigate }) => {
  const origin = getSiteOrigin();

  useEffect(() => {
    document.title = `${post.title} | QuickPixel Tools Blog`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', post.metaDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('content', `${origin}/blog/${post.slug}`);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post, origin]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'QuickPixel Tools',
      url: `${origin}/`,
    },
    datePublished: post.publishDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${origin}/blog/${post.slug}`,
    },
  };

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Breadcrumbs
        items={[
          { name: 'Blog', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Article Header */}
      <header className="my-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
          <span>{post.category}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{post.author}</span>
          </div>
          <span className="text-slate-300">&middot;</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.publishDate}</span>
          </div>
          <span className="text-slate-300">&middot;</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>

      {/* Target Tool Action Banner */}
      <aside className="my-8 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Try {post.targetToolName} Free</h4>
            <p className="text-xs text-slate-600">Compress or convert directly in your browser with zero file uploads.</p>
          </div>
        </div>
        <a
          href={`/${post.targetToolSlug}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(`/${post.targetToolSlug}`);
          }}
          className="whitespace-nowrap px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <span>Open Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </aside>

      {/* Main Formatted Article Content */}
      <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>

      {/* Polite Ad Placement */}
      <AdPlaceholder slotName="Sponsored Content Break" />

      {/* More Guides */}
      <section className="my-16 pt-10 border-t border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Related Optimization Guides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {relatedPosts.map((rPost) => (
            <a
              key={rPost.slug}
              href={`/blog/${rPost.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/blog/${rPost.slug}`);
              }}
              className="p-5 bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {rPost.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  {rPost.title}
                </h4>
              </div>
              <div className="mt-3 flex items-center text-xs font-semibold text-blue-600 gap-1">
                <span>Read More</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
