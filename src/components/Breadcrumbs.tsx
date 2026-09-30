import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  const allItems: BreadcrumbItem[] = [{ name: 'Home', url: '/' }, ...items];

  // Schema.org BreadcrumbList JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://quickpixel.ai.studio${item.url}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={item.url} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                {isLast ? (
                  <span className="font-medium text-slate-800 truncate max-w-[200px] sm:max-w-md" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <a
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.url);
                    }}
                    className="hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    {index === 0 && <Home className="w-3 h-3" />}
                    <span>{item.name}</span>
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
