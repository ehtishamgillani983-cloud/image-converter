import React, { useEffect } from 'react';
import { Check, ArrowRight, ShieldCheck, Zap, Layers, FileCode } from 'lucide-react';
import { ToolDef } from '../data/toolsData';
import { ImageToolApp } from '../components/ImageToolApp';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FaqSection } from '../components/FaqSection';
import { RelatedToolsSection } from '../components/RelatedToolsSection';
import { AdPlaceholder } from '../components/AdPlaceholder';
import { getSiteOrigin } from '../utils/seo';

interface ToolPageProps {
  tool: ToolDef;
  onNavigate: (path: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, onNavigate }) => {
  const origin = getSiteOrigin();

  // Update document title and canonical URL dynamically for client-side navigation
  useEffect(() => {
    document.title = tool.metaTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', tool.metaDescription);

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    const allKeywords = [tool.primaryKeyword, ...tool.secondaryKeywords].join(', ');
    metaKeywords.setAttribute('content', allKeywords);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('content', `${origin}/${tool.slug}`);

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', tool.metaTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', tool.metaDescription);

    // Sync WebApplication JSON-LD into document.head
    let webAppScript = document.getElementById('webapp-head-jsonld') as HTMLScriptElement | null;
    if (!webAppScript) {
      webAppScript = document.createElement('script');
      webAppScript.id = 'webapp-head-jsonld';
      webAppScript.type = 'application/ld+json';
      document.head.appendChild(webAppScript);
    }
    webAppScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.name,
      url: `${origin}/${tool.slug}`,
      description: tool.metaDescription,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });

    // Scroll to top on page switch
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      const script = document.getElementById('webapp-head-jsonld');
      if (script) script.remove();
    };
  }, [tool, origin]);

  // SoftwareApplication / WebApplication Schema.org
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: `${origin}/${tool.slug}`,
    description: tool.metaDescription,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { name: 'Tools', url: '/tools' },
            { name: tool.name, url: `/${tool.slug}` },
          ]}
          onNavigate={onNavigate}
        />

        {/* Hero / Header */}
        <header className="pt-4 pb-6 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {tool.h1}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {tool.subtitle}
          </p>
        </header>

        {/* Functional Tool Above The Fold */}
        <section className="mb-10">
          <ImageToolApp
            key={tool.slug}
            initialSlug={tool.slug}
            initialMode={tool.defaultMode}
            initialFormat={tool.defaultFormat}
            initialQuality={tool.defaultQuality}
            initialTargetSizeBytes={tool.defaultTargetSizeBytes}
            onNavigate={onNavigate}
          />
        </section>

        {/* Supported Formats & Technical Specifications */}
        <section className="my-10 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Supported Formats &amp; Technical Specifications
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Input Formats
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tool.supportedInputFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 bg-blue-100/70 text-blue-700 font-semibold text-xs rounded-md"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Output Format
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tool.supportedOutputFormats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 bg-emerald-100/70 text-emerald-700 font-semibold text-xs rounded-md"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Maximum File Size
              </span>
              <p className="text-xs font-medium text-slate-700 leading-snug">
                {tool.maxFileSize}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Processing Engine
              </span>
              <p className="text-xs font-medium text-slate-700 leading-snug">
                100% Client-Side In-Browser (Zero Server Uploads)
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
        <section className="my-10 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Key Features of {tool.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tool.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Polite Ad Placement */}
        <AdPlaceholder slotName="Sponsored Utility Link" />

        {/* How-to Step Guide */}
        <section className="my-12">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            How to Use {tool.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tool.stepGuide.map((stepItem, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200/90 text-center shadow-2xs"
              >
                <div className="w-9 h-9 mx-auto rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-3">
                  {stepItem.step}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{stepItem.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Explanatory Content Sections */}
        <article className="my-12 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              About {tool.name}
            </h2>
            <div
              className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: tool.overviewHtml }}
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Why Use QuickPixel Tools for {tool.name}?
            </h2>
            <div
              className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{ __html: tool.whyUseHtml }}
            />
          </div>
        </article>

        {/* Common Use Cases */}
        {tool.commonUseCases && tool.commonUseCases.length > 0 && (
          <section className="my-12">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Common Use Cases for {tool.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tool.commonUseCases.map((useCase, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2 text-blue-600">
                      {useCase.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {useCase.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Privacy Note */}
        <section className="my-10 bg-slate-100/70 border border-slate-200 p-6 rounded-xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Your Privacy is Protected</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your images are processed directly inside your browser whenever possible using client-side JavaScript APIs. Your files are not permanently stored on our servers.
            </p>
          </div>
        </section>

        {/* Polite Ad Placement */}
        <AdPlaceholder slotName="Sponsored Utility Link" />

        {/* FAQs */}
        {tool.faqs.length > 0 && (
          <FaqSection
            title={`Frequently Asked Questions About ${tool.name}`}
            faqs={tool.faqs}
          />
        )}

        {/* Related Tools */}
        <RelatedToolsSection
          currentSlug={tool.slug}
          relatedSlugs={tool.relatedSlugs}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};
