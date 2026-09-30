import React from 'react';
import {
  Zap,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Gauge,
  Mail,
  HardDrive,
  Share2,
  FileCheck,
  Layers,
  BookOpen,
} from 'lucide-react';
import { ImageToolApp } from '../components/ImageToolApp';
import { FaqSection } from '../components/FaqSection';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { TOOLS_DATA } from '../data/toolsData';
import { BLOG_POSTS } from '../data/blogData';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const homeFaqs = [
    {
      question: 'What is an image compressor?',
      answer:
        'An image compressor is an online tool that eliminates redundant pixel data, color entropy, and camera metadata from image files. This significantly lowers file size (often by 70% or more) while keeping the visual fidelity virtually identical to the original image.',
    },
    {
      question: 'How do I compress an image online?',
      answer:
        'Simply drop your JPG, PNG, WebP, or HEIC photo into the upload box at the top of this page. QuickPixel Tools immediately compresses the file in your browser. You can tweak the quality slider or pick a preset, and then click Download.',
    },
    {
      question: 'How can I reduce image size?',
      answer:
        'You can reduce image size by compressing pixel data, downscaling excessive dimensions (e.g. from 4000px down to 1920px), or converting heavy formats like PNG into next-generation WebP or compressed JPG.',
    },
    {
      question: 'Can I compress JPG images?',
      answer:
        'Yes! QuickPixel Tools has a dedicated high-efficiency JPG compressor that uses optimized quantization matrices to shrink JPGs without ugly macroblocking or color banding.',
    },
    {
      question: 'Can I compress PNG images?',
      answer:
        'Yes. You can compress PNGs while preserving 100% transparent backgrounds. You can also convert heavy PNG logos into lightweight WebP graphics with full alpha transparency.',
    },
    {
      question: 'Can I compress WebP images?',
      answer:
        'Yes. WebP is Google modern web image standard. QuickPixel allows you to compress, encode, and fine-tune WebP files for maximum Google PageSpeed performance.',
    },
    {
      question: 'How do I compress an image to 200KB?',
      answer:
        'Select the "Under 200 KB" option in our "Compress Image to Target Size" menu, or visit our dedicated /compress-image-to-200kb page. Our iterative algorithm automatically finds the best quality setting to land strictly under 200 KB.',
    },
    {
      question: 'How do I compress an image to 100KB?',
      answer:
        'Choose "Under 100 KB" from the target size options. The compressor adjusts quality and pixel resolution to ensure your photo or signature fits within the 100 KB ceiling required by registration portals.',
    },
    {
      question: 'How do I compress an image without losing quality?',
      answer:
        'Human vision is less perceptive to high-frequency color variations than edge contrast. QuickPixel uses perceptual thresholding to strip imperceptible data while keeping edges and colors sharp, achieving up to 80% compression with no perceptible loss.',
    },
    {
      question: 'Is QuickPixel Tools free?',
      answer:
        'Yes, QuickPixel Tools is 100% free with no hidden fees, subscriptions, or watermarks.',
    },
    {
      question: 'Do I need to create an account?',
      answer:
        'No. There is no registration, login, or email capture required. The tool is immediately available above the fold.',
    },
    {
      question: 'Are my images stored?',
      answer:
        'No. Your images are processed directly inside your browser whenever possible using modern client-side HTML5 APIs. Your files are not permanently stored on our servers.',
    },
  ];

  const featuredTools = TOOLS_DATA.slice(0, 8);
  const featuredArticles = BLOG_POSTS.slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="pt-8 pb-6 sm:pt-12 sm:pb-8 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Free Online Image Compressor &amp; Image Tools
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Compress images, convert image formats and resize photos online for free. Fast, simple and privacy-friendly.
        </p>

        {/* Action CTAs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#tool"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('tool-container')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Compress Image
          </a>
          <button
            type="button"
            onClick={() => onNavigate('/tools')}
            className="px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl border border-slate-300 transition-colors flex items-center gap-2"
          >
            Convert Image
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </section>

      {/* Tool Container Above The Fold */}
      <section id="tool-container" className="max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <ImageToolApp onNavigate={onNavigate} />
      </section>

      {/* Polite Ad Placement */}
      <div className="px-4">
        <AdPlaceholder slotName="Sponsored by FastEdge CDN" />
      </div>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant In-Browser Speed</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No waiting in slow upload queues. Optimization occurs right on your computer or phone using multi-threaded WebAssembly and Canvas pipelines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Privacy &amp; Security First</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your images are processed directly in your browser whenever possible. Your sensitive files and personal photos are not permanently stored on remote servers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Target File Size Precision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Need images under 200KB, 500KB, or 1MB for portals? Our smart iterative solver hits your exact file size ceiling with maximum visual clarity.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Content: What Is an Image Compressor? */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 my-16">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/90 shadow-2xs prose prose-slate max-w-none">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            What Is an Image Compressor?
          </h2>
          <p className="text-slate-600 leading-relaxed text-base">
            An <strong>image compressor</strong> is a digital utility designed to minimize the byte size of graphics, photos, and digital assets without degrading their aesthetic quality. Modern smartphones and professional cameras capture photographs with millions of pixels, creating uncompressed files that range between 5MB and 25MB each.
          </p>
          <p className="text-slate-600 leading-relaxed text-base">
            These colossal files contain massive quantities of imperceptible color nuances and camera metadata. Image compression algorithms reorganize spatial frequencies, apply chroma subsampling, and quantize subtle color gradients, allowing the file to shed up to 85% of its original size while appearing virtually indistinguishable to the naked eye.
          </p>
        </div>
      </section>

      {/* Why Compress Images? */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Compress Images?
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Optimizing your photos delivers immediate practical benefits across websites, email, and mobile devices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200/90">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Faster Website Loading</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Images represent over 45% of total webpage weight. Lean images improve Largest Contentful Paint (LCP) and boost overall SEO rankings.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200/90">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Smaller Email Attachments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never bounce an email due to strict 20MB or 25MB attachment restrictions. Compress dozens of high-res photos into a light bundle.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200/90">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Easier Sharing &amp; Uploads</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send photos across messaging apps like WhatsApp and Slack in milliseconds, saving cellular data caps for both you and your recipients.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200/90">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Portal Upload Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Easily meet rigid file size caps (such as &lt;200KB or &lt;100KB) on government forms, passport applications, and university portals.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200/90">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Reduced Storage Requirements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reclaim gigabytes of storage on your phone, hard drives, and cloud backups (Google Drive, Dropbox, iCloud) without sacrificing photo memories.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200/90">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Better Mobile Experience</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mobile visitors on slower 3G/4G connections can browse responsive pages smoothly without stuttering or long image pop-in delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Compress an Image (3-Step Guide) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 my-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Compress an Image
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Optimize your images in 3 simple steps right inside your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200/90 text-center relative">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Upload your image</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drag and drop single or multiple JPG, PNG, WebP, or HEIC files onto the tool above.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 text-center relative">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Choose compression level</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adjust the quality slider, choose a preset (Website, Email, Balanced), or pick an exact target size like 200KB.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/90 text-center relative">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Download the compressed image</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Preview before/after quality with our interactive split slider and download single images or all as a ZIP archive.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Image Formats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 my-16">
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-2xs">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Supported Image Formats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1 text-blue-600">JPG / JPEG</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The world standard for digital photography. Excellent lossy compression that preserves natural gradients and portraits.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1 text-blue-600">PNG</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lossless graphics format ideal for logos, app interfaces, icons, and text with transparent backgrounds.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1 text-blue-600">WebP</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Google modern image format providing 25%–35% smaller file sizes than JPG with both lossy and lossless support.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-1 text-blue-600">HEIC / HEIF</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apple default camera container format. QuickPixel decodes HEIC locally and converts it to universal JPEG.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Explanation: Image Compression Without Losing Quality */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 my-16">
        <div className="bg-blue-50/60 border border-blue-100 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Image Compression Without Losing Quality
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            In digital imaging, compression can drastically reduce file size while striving to preserve visual quality. However, results vary depending on the original photograph, lighting, and compression level.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            By eliminating invisible color frequencies and camera metadata, our algorithm retains high-contrast edge clarity and facial sharpness while shedding up to 80% of unnecessary bytes. You can inspect the side-by-side comparison slider on every processed file before downloading.
          </p>
        </div>
      </section>

      {/* Polite Ad Placement */}
      <div className="px-4">
        <AdPlaceholder slotName="Sponsored Utility Link" />
      </div>

      {/* Popular Tools Directory Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Image Optimization Tools
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Dedicated tools customized for specific formats, conversions, and strict target limits.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/tools')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            Explore all 20+ tools
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTools.map((tool) => (
            <a
              key={tool.slug}
              href={`/${tool.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/${tool.slug}`);
              }}
              className="p-5 bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2 capitalize">
                  {tool.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {tool.shortDesc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Use Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Blog Guides */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 my-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Image Optimization Guides &amp; Tutorials
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Read actionable articles written by web performance specialists.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/blog')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            View all guides
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredArticles.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`/blog/${post.slug}`);
              }}
              className="p-6 bg-white border border-slate-200/90 hover:border-blue-400 rounded-xl transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span>{post.category}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="px-4 sm:px-6">
        <FaqSection faqs={homeFaqs} />
      </section>
    </div>
  );
};
