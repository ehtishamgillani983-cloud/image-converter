import React, { useState, useEffect, useMemo } from 'react';
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
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const faqSchema = useMemo(
    () => ({
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
    }),
    [faqs],
  );

  useEffect(() => {
    if (!includeJsonLd || faqs.length === 0) return;

    let headScript = document.getElementById('faqpage-jsonld-schema') as HTMLScriptElement | null;
    if (!headScript) {
      headScript = document.createElement('script');
      headScript.id = 'faqpage-jsonld-schema';
      headScript.type = 'application/ld+json';
      document.head.appendChild(headScript);
    }
    headScript.textContent = JSON.stringify(faqSchema);

    return () => {
      const existing = document.getElementById('faqpage-jsonld-schema');
      if (existing) existing.remove();
    };
  }, [faqSchema, includeJsonLd, faqs]);

  return (
    <section className="my-16 max-w-4xl mx-auto w-full" aria-label="Frequently Asked Questions">
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
          const questionId = `faq-q-${index}`;
          const answerId = `faq-a-${index}`;
          return (
            <div
              key={index}
              className={`bg-white border rounded-xl overflow-hidden transition-all shadow-2xs ${
                isOpen ? 'border-blue-200 ring-1 ring-blue-500/10' : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                id={questionId}
                aria-controls={answerId}
                aria-expanded={isOpen}
                onClick={() => toggleIndex(index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span className="text-sm sm:text-base text-slate-900">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                className={`px-5 pb-5 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 ${
                  isOpen ? 'block' : 'hidden'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
