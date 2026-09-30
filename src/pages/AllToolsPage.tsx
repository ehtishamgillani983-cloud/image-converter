import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Layers, Minimize2, FileImage, Image as ImageIcon, Zap, Target, Maximize2, Repeat, Sparkles, Smartphone, FileText, Crop, RotateCw, Sliders } from 'lucide-react';
import { TOOLS_DATA, TOOL_CATEGORIES, ToolDef } from '../data/toolsData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getSiteOrigin } from '../utils/seo';

interface AllToolsPageProps {
  onNavigate: (path: string) => void;
  initialCategory?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Minimize2: <Minimize2 className="w-5 h-5 text-blue-600" />,
  FileImage: <FileImage className="w-5 h-5 text-blue-600" />,
  Image: <ImageIcon className="w-5 h-5 text-blue-600" />,
  Zap: <Zap className="w-5 h-5 text-blue-600" />,
  Target: <Target className="w-5 h-5 text-blue-600" />,
  Maximize2: <Maximize2 className="w-5 h-5 text-blue-600" />,
  Repeat: <Repeat className="w-5 h-5 text-blue-600" />,
  Sparkles: <Sparkles className="w-5 h-5 text-blue-600" />,
  Smartphone: <Smartphone className="w-5 h-5 text-blue-600" />,
  FileText: <FileText className="w-5 h-5 text-blue-600" />,
  Crop: <Crop className="w-5 h-5 text-blue-600" />,
  RotateCw: <RotateCw className="w-5 h-5 text-blue-600" />,
  Sliders: <Sliders className="w-5 h-5 text-blue-600" />,
};

export const AllToolsPage: React.FC<AllToolsPageProps> = ({
  onNavigate,
  initialCategory = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    document.title = 'All Online Image Tools – Free Image Optimizer Suite | QuickPixel Tools';
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('content', `${getSiteOrigin()}/tools`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesCategory =
      activeCategory === 'all' || tool.category === activeCategory;
    const matchesQuery =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <Breadcrumbs items={[{ name: 'All Tools', url: '/tools' }]} onNavigate={onNavigate} />

      <div className="text-center max-w-2xl mx-auto my-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          All Free Online Image Tools
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base">
          Browse our complete suite of browser-based utilities to compress, convert, resize, crop, and transform your digital images.
        </p>
      </div>

      {/* Search Bar & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tools (e.g. 200KB, PNG, Resize)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.slug}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    {ICON_MAP[tool.iconName] || <Zap className="w-5 h-5 text-blue-600" />}
                  </div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 capitalize">
                    {tool.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {tool.name}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Free &bull; In-browser</span>
                <a
                  href={`/${tool.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/${tool.slug}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all group-hover:shadow-2xs"
                >
                  <span>Use Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-sm">No tools found matching "{searchQuery}".</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            Reset search and filters
          </button>
        </div>
      )}
    </div>
  );
};
