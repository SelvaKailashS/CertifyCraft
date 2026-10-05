import React, { useRef } from 'react';
import { Upload, Check, Sparkles } from 'lucide-react';
import { PRESET_TEMPLATES } from '../templates/presets';
import type { Template } from '../types';

interface TemplatesTabProps {
  currentTemplate: Template;
  onSelectTemplate: (template: Template) => void;
  onUploadCustomBg: (dataUrl: string) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({
  currentTemplate,
  onSelectTemplate,
  onUploadCustomBg,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        onUploadCustomBg(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Header & Custom Upload */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Certificate Template
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select a preset design or upload your custom branded background
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleCustomUpload}
          accept="image/*,.svg"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Custom Template</span>
        </button>
      </div>

      {/* Preset Templates Grid */}
      <div className="grid grid-cols-2 gap-3">
        {PRESET_TEMPLATES.map((tpl) => {
          const isSelected = currentTemplate.id === tpl.id;

          const badgeColor = {
            HACKATHON: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
            SPORTS: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
            WORKSHOP: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            ACADEMIC: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            CUSTOM: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          }[tpl.category];

          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className={`group relative rounded-xl border p-3.5 flex flex-col justify-between transition cursor-pointer text-left ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30 bg-slate-900 text-white dark:bg-slate-900'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
              }`}
            >
              {/* Category & Selection Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
                  {tpl.category}
                </span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Template Preview Representation */}
              <div
                className="w-full h-24 rounded-lg mb-2.5 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden border border-slate-700/50"
                style={{ backgroundColor: tpl.themeColor }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-1 opacity-80"
                  style={{ border: `1.5px solid ${tpl.accentColor}` }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: tpl.accentColor }} />
                </div>
                <div className="text-[11px] font-bold text-white tracking-wide truncate max-w-full">
                  CERTIFICATE
                </div>
                <div
                  className="text-[10px] font-semibold truncate max-w-full"
                  style={{ color: tpl.accentColor }}
                >
                  {tpl.name}
                </div>
                <span className="text-[8px] text-slate-400 mt-0.5">1920x1080 Vector SVG</span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-bold text-xs truncate mb-0.5">
                  {tpl.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {tpl.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
