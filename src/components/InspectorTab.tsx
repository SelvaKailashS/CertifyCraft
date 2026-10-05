import React from 'react';
import {
  RotateCcw,
  Plus,
  Type,
  QrCode,
  Eye,
  EyeOff,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import type { CanvasElement } from '../types';

interface InspectorTabProps {
  elements: CanvasElement[];
  selectedElementId: string;
  onSelectElement: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: () => void;
  onResetElements: () => void;
}

const COLOR_SWATCHES = [
  '#f8bf24', // Gold
  '#38bdf8', // Neon Cyan
  '#34d399', // Emerald
  '#ef4444', // Crimson
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#ffffff', // White
  '#94a3b8', // Slate Gray
  '#0f172a', // Dark Navy
];

export const InspectorTab: React.FC<InspectorTabProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onAddElement,
  onResetElements,
}) => {
  const selectedElement = elements.find((el) => el.id === selectedElementId) || elements[0];

  return (
    <div className="space-y-6">
      {/* Canvas Elements Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Canvas Elements
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetElements}
              title="Reset elements to template default"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onAddElement}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-amber-400 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Field</span>
            </button>
          </div>
        </div>

        {/* Element Chips */}
        <div className="flex flex-wrap gap-1.5">
          {elements.map((el) => {
            const isSelected = el.id === selectedElement?.id;
            return (
              <button
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {el.type === 'qr' ? (
                  <QrCode className="w-3.5 h-3.5 opacity-80" />
                ) : (
                  <Type className="w-3.5 h-3.5 opacity-80" />
                )}
                <span>{el.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedElement && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
          {/* Active Field Header & Actions */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/70">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {selectedElement.label}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                X: {Math.round(selectedElement.x)}% | Y: {Math.round(selectedElement.y)}%
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  onUpdateElement(selectedElement.id, {
                    visible: !selectedElement.visible,
                  })
                }
                title={selectedElement.visible ? 'Hide Element' : 'Show Element'}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              >
                {selectedElement.visible ? (
                  <Eye className="w-4 h-4 text-emerald-500" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <button
                onClick={() => onDeleteElement(selectedElement.id)}
                title="Delete Field"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Data Source */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Dynamic Data Source
            </label>
            <select
              value={selectedElement.dataSource}
              onChange={(e) =>
                onUpdateElement(selectedElement.id, {
                  dataSource: e.target.value as any,
                })
              }
              className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="name">Participant Name (from Excel)</option>
              <option value="college">College / University (from Excel)</option>
              <option value="certificateId">Certificate ID (from Excel)</option>
              <option value="eventTitle">Event Title</option>
              <option value="rank">Rank / Award / Position</option>
              <option value="description">Event Description</option>
              <option value="date">Issue Date</option>
              <option value="header">Certificate Header</option>
              <option value="subtitle">Certificate Subtitle</option>
              <option value="custom">Static Custom Text</option>
              <option value="qr">Dynamic QR Code (Verify URL)</option>
            </select>
          </div>

          {/* Static value input if custom */}
          {selectedElement.dataSource === 'custom' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Static Text Content
              </label>
              <input
                type="text"
                value={selectedElement.staticValue || ''}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    staticValue: e.target.value,
                  })
                }
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Font Family & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Font Family
              </label>
              <select
                value={selectedElement.fontFamily}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    fontFamily: e.target.value,
                  })
                }
                className="w-full text-xs font-medium px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="Cinzel">CINZEL (SERIF)</option>
                <option value="Inter">INTER (SANS)</option>
                <option value="Playfair Display">PLAYFAIR DISPLAY</option>
                <option value="Montserrat">MONTSERRAT</option>
                <option value="Great Vibes">GREAT VIBES (SCRIPT)</option>
                <option value="Orbitron">ORBITRON (CYBER)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Font Weight
              </label>
              <select
                value={selectedElement.fontWeight}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    fontWeight: e.target.value,
                  })
                }
                className="w-full text-xs font-medium px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">SemiBold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">ExtraBold (800)</option>
              </select>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Font Size
              </label>
              <span className="text-xs font-bold text-slate-800 dark:text-amber-400">
                {selectedElement.fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              value={selectedElement.fontSize}
              onChange={(e) =>
                onUpdateElement(selectedElement.id, {
                  fontSize: Number(e.target.value),
                })
              }
              className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Text Alignment & Case */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Text Alignment & Case
            </label>
            <div className="flex items-center gap-2">
              {/* Alignment */}
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'left' })}
                  className={`p-1.5 rounded-md ${
                    selectedElement.textAlign === 'left'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'center' })}
                  className={`p-1.5 rounded-md ${
                    selectedElement.textAlign === 'center'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'right' })}
                  className={`p-1.5 rounded-md ${
                    selectedElement.textAlign === 'right'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Case */}
              <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onUpdateElement(selectedElement.id, { textCase: 'uppercase' })}
                  className={`px-2 py-1 rounded-md ${
                    selectedElement.textCase === 'uppercase'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  AA
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateElement(selectedElement.id, { textCase: 'capitalize' })}
                  className={`px-2 py-1 rounded-md ${
                    selectedElement.textCase === 'capitalize'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  Aa
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateElement(selectedElement.id, { textCase: 'none' })}
                  className={`px-2 py-1 rounded-md ${
                    selectedElement.textCase === 'none'
                      ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                  }`}
                >
                  aa
                </button>
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Color
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onUpdateElement(selectedElement.id, { color })}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full border transition cursor-pointer ${
                      selectedElement.color.toLowerCase() === color.toLowerCase()
                        ? 'ring-2 ring-amber-500 scale-110 border-white'
                        : 'border-slate-400/40 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-xs text-slate-400 font-mono">#</span>
                <input
                  type="text"
                  value={selectedElement.color.replace('#', '')}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      color: `#${e.target.value}`,
                    })
                  }
                  className="w-18 text-xs font-mono uppercase px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Precise Coordinates */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                X Position (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(selectedElement.x)}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    x: Number(e.target.value),
                  })
                }
                className="w-full text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Y Position (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(selectedElement.y)}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    y: Number(e.target.value),
                  })
                }
                className="w-full text-xs font-medium px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
