import React from 'react';
import { ArrowRight, Minimize2, FileImage, Image as ImageIcon, Zap, Target, Maximize2, Repeat, Sparkles, Smartphone, FileText, Crop, RotateCw, Sliders } from 'lucide-react';
import { ToolDef, getToolBySlug } from '../data/toolsData';

interface RelatedToolsSectionProps {
  currentSlug: string;
  relatedSlugs: string[];
  onNavigate: (path: string) => void;
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

export const RelatedToolsSection: React.FC<RelatedToolsSectionProps> = ({
  currentSlug,
  relatedSlugs,
  onNavigate,
}) => {
  const tools = relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDef => !!t && t.slug !== currentSlug)
    .slice(0, 6);

  if (tools.length === 0) return null;

  return (
    <section className="my-16 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Related Image Tools
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explore more free utilities to optimize, convert, and format your graphics.
          </p>
        </div>
        <a
          href="/tools"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/tools');
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
        >
          View all 20+ tools
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <a
            key={tool.slug}
            href={`/${tool.slug}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(`/${tool.slug}`);
            }}
            aria-label={`Open ${tool.name} tool`}
            className="group p-5 bg-white border border-slate-200/90 hover:border-blue-300 rounded-xl transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  {ICON_MAP[tool.iconName] || <Zap className="w-5 h-5 text-blue-600" />}
                </div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 capitalize">
                  {tool.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {tool.shortDesc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Open {tool.name}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
