import React, { useEffect, useState } from 'react';
import { BookOpen, ArrowRight, Search, Clock, Calendar, User, Zap, HelpCircle } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FaqSection } from '../components/FaqSection';
import { getSiteOrigin } from '../utils/seo';

interface BlogHubPageProps {
  onNavigate: (path: string) => void;
}

export const BlogHubPage: React.FC<BlogHubPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const origin = getSiteOrigin();

  useEffect(() => {
    // 1. Exact SEO title
    document.title = 'Image Optimization Guides & Tutorials | QuickPixel Tools Blog';

    // 2. Exact meta description based on primary and secondary keywords
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Read in-depth image optimization guides and tutorials. Learn how to compress images, choose between JPG, PNG, and WebP, and accelerate web page load speeds.',
    );

    // 3. Meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content',
      'image optimization tutorials, how to compress images guide, web image optimization best practices, JPG vs PNG vs WebP guide, reduce photo file size tutorials',
    );

    // 4. Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('content', `${origin}/blog`);

    // 5. OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Image Optimization Guides & Tutorials | QuickPixel Tools Blog');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc)
      ogDesc.setAttribute(
        'content',
        'Read in-depth image optimization guides and tutorials. Learn how to compress images, choose between JPG, PNG, and WebP, and accelerate web page load speeds.',
      );

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [origin]);

  const filteredPosts = BLOG_POSTS.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const blogFaqs = [
    {
      question: 'Why is image optimization important for websites?',
      answer:
        'Images typically make up over 45% of total webpage payload. Uncompressed images slow down page rendering, damage Google Core Web Vitals (specifically Largest Contentful Paint), increase mobile bounce rates, and incur higher server bandwidth costs.',
    },
    {
      question: 'Which image format should I choose: JPG, PNG, or WebP?',
      answer:
        'Use JPG for photographic content and complex gradients. Use PNG for logos, vector exports, and user interfaces requiring transparent backgrounds. Use WebP for modern web publishing, as it delivers 25% to 35% smaller files than JPG and PNG with full transparency support.',
    },
    {
      question: 'How much can I reduce image file size without losing quality?',
      answer:
        'Using perceptual quantization and chroma subsampling, you can safely reduce image file sizes by 65% to 80% with visual differences virtually imperceptible to human eyes at standard viewing distances.',
    },
    {
      question: 'Do these guides require installing desktop software?',
      answer:
        'No. All techniques discussed in our tutorials can be executed immediately in your browser using QuickPixel Tools client-side utilities without installing software or creating an account.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs items={[{ name: 'Blog', url: '/blog' }]} onNavigate={onNavigate} />

      {/* Header with Exact H1 */}
      <header className="text-center max-w-3xl mx-auto my-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Image Optimization Guides &amp; Tutorials
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Master the fundamentals of digital imagery. Explore step-by-step tutorials on perceptual compression, modern WebP formats, image resizing, and Google Core Web Vitals optimization.
        </p>
      </header>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tutorials (e.g. 200KB, WebP, JPG, PNG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs text-slate-800"
          />
        </div>
      </div>

      {/* Featured Educational Articles Grid */}
      <section className="mb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
          Latest Practical Tutorials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-blue-600">{post.category}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5 leading-snug">
                  <a
                    href={`/blog/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`/blog/${post.slug}`);
                    }}
                  >
                    {post.title}
                  </a>
                </h3>
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
                  <span>Read Tutorial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Core Image Optimization Knowledge Sections */}
      <section className="my-16 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-2xs">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Web Image Optimization Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 text-blue-600">
              1. Format Strategy
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Match the graphic format to the subject matter. Converting photos to WebP saves 30% bandwidth, while PNG preserves sharp vector edges and transparent backgrounds.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 text-blue-600">
              2. Dimension Downscaling
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never serve a 4000px camera photo into an 800px column. Downscaling pixel dimensions reduces file weight by over 75% before compression even starts.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2 text-blue-600">
              3. Perceptual Quantization
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tuning compression quality to the 78%–85% window strips imperceptible high-frequency color variations while retaining razor-sharp outlines.
            </p>
          </div>
        </div>

        {/* Quick links to core tools */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Popular Companion Tools:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href="/image-compressor"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/image-compressor');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
            >
              Image Compressor
            </a>
            <a
              href="/compress-jpg"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/compress-jpg');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
            >
              Compress JPG
            </a>
            <a
              href="/compress-png"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/compress-png');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
            >
              Compress PNG
            </a>
            <a
              href="/jpg-to-webp"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/jpg-to-webp');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
            >
              JPG to WebP
            </a>
            <a
              href="/image-resizer"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/image-resizer');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition-colors"
            >
              Image Resizer
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="my-12">
        <FaqSection
          title="Frequently Asked Questions About Image Optimization"
          subtitle="Answers to common questions about reducing file size, format selection, and web performance."
          faqs={blogFaqs}
        />
      </section>
    </div>
  );
};
