import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FaqItem[];
  includeJsonLd?: boolean;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  title = 'Frequently Asked Questions',
  subtitle = 'Find quick answers to common questions about image compression, conversion, and privacy.',
  faqs,
  includeJsonLd = true,
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <section className="my-16 max-w-4xl mx-auto w-full">
      {includeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              className="bg-white border border-slate-200/90 rounded-xl overflow-hidden transition-all shadow-2xs hover:border-slate-300"
            >
              <button
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-sm sm:text-base">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
