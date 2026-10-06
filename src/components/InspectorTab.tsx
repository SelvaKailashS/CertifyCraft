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
  PenTool,
} from 'lucide-react';
import type { CanvasElement, Participant } from '../types';

interface InspectorTabProps {
  elements: CanvasElement[];
  selectedElementId: string;
  onSelectElement: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: () => void;
  onResetElements: () => void;
  participant?: Participant;
  onUpdateParticipant?: (updates: Partial<Participant>) => void;
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
  participant,
  onUpdateParticipant,
}) => {
  const selectedElement =
    elements.find((el) => el.id === selectedElementId) || elements[0];

  return (
    <div className="space-y-3.5">
      {/* Top Bar: Actions */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Field Customizer & Styling
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetElements}
            title="Reset elements to template default"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={onAddElement}
            title="Add a new custom text field"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-emerald-400 transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Field</span>
          </button>
        </div>
      </div>

      {/* Field Selector Pills */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Select Field to Edit:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {elements.map((el) => {
            const isSelected = el.id === selectedElement?.id;
            return (
              <button
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                {el.type === 'qr' ? (
                  <QrCode className="w-3 h-3 opacity-80" />
                ) : el.type === 'signature' ? (
                  <PenTool className="w-3 h-3 opacity-80" />
                ) : (
                  <Type className="w-3 h-3 opacity-80" />
                )}
                <span>{el.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selected Field Controls */}
      {selectedElement && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3.5 shadow-xs">
          {/* Header & Controls */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-700/70">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                {selectedElement.type === 'qr' ? (
                  <QrCode className="w-4 h-4 text-emerald-500" />
                ) : selectedElement.type === 'signature' ? (
                  <PenTool className="w-4 h-4 text-amber-500" />
                ) : (
                  <Type className="w-4 h-4 text-cyan-500" />
                )}
                <span>{selectedElement.label}</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                X: {Math.round(selectedElement.x)}% &bull; Y: {Math.round(selectedElement.y)}%
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  onUpdateElement(selectedElement.id, {
                    visible: !selectedElement.visible,
                  })
                }
                title={selectedElement.visible ? 'Hide Element' : 'Show Element'}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
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
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Content Inputs depending on element type */}
          {selectedElement.type === 'signature' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Signatory Name
                </label>
                <input
                  type="text"
                  value={selectedElement.signatoryName || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, { signatoryName: e.target.value })
                  }
                  placeholder="e.g. Dr. Sarah Mitchell"
                  className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={selectedElement.signatoryTitle || selectedElement.staticValue || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, {
                      signatoryTitle: e.target.value,
                      staticValue: e.target.value,
                    })
                  }
                  placeholder="e.g. ORGANIZING CHAIR"
                  className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          ) : selectedElement.type === 'qr' ? (
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Verification URL / Prefix
                </label>
                <input
                  type="text"
                  value={selectedElement.qrUrl || ''}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, { qrUrl: e.target.value })
                  }
                  placeholder="https://verify.certifycraft.org/verify?id={id}"
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    QR Code Size
                  </label>
                  <span className="text-xs font-bold text-slate-800 dark:text-emerald-400 font-mono">
                    {selectedElement.fontSize || 64}px
                  </span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="128"
                  value={selectedElement.fontSize || 64}
                  onChange={(e) =>
                    onUpdateElement(selectedElement.id, { fontSize: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          ) : selectedElement.id === 'name' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Participant Name (Preview Student)
              </label>
              <input
                type="text"
                value={participant?.name || ''}
                onChange={(e) =>
                  onUpdateParticipant && onUpdateParticipant({ name: e.target.value })
                }
                placeholder="e.g. Aarav Sharma"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                During automated dispatch, this is dynamically replaced with each student&apos;s name.
              </span>
            </div>
          ) : selectedElement.id === 'college' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / Institution (Preview)
              </label>
              <input
                type="text"
                value={participant?.college || ''}
                onChange={(e) =>
                  onUpdateParticipant && onUpdateParticipant({ college: e.target.value })
                }
                placeholder="e.g. Indian Institute of Technology, Bombay"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          ) : selectedElement.id === 'description' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Description Text
              </label>
              <textarea
                rows={2}
                value={participant?.description || selectedElement.staticValue || ''}
                onChange={(e) => {
                  if (onUpdateParticipant) onUpdateParticipant({ description: e.target.value });
                  onUpdateElement(selectedElement.id, { staticValue: e.target.value });
                }}
                placeholder="e.g. for actively participating and showcasing exceptional engineering skills during the event."
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          ) : selectedElement.id === 'eventTitle' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={participant?.eventTitle || selectedElement.staticValue || ''}
                onChange={(e) => {
                  if (onUpdateParticipant) onUpdateParticipant({ eventTitle: e.target.value });
                  onUpdateElement(selectedElement.id, { staticValue: e.target.value });
                }}
                placeholder="e.g. National 36-Hour AI Hackathon"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          ) : selectedElement.id === 'date' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Date Text
              </label>
              <input
                type="text"
                value={participant?.date || selectedElement.staticValue || ''}
                onChange={(e) => {
                  if (onUpdateParticipant) onUpdateParticipant({ date: e.target.value });
                  onUpdateElement(selectedElement.id, { staticValue: e.target.value });
                }}
                placeholder="e.g. October 15, 2026"
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          ) : selectedElement.id === 'certificateId' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Certificate ID (Sample)
              </label>
              <input
                type="text"
                value={participant?.certificateId || selectedElement.staticValue || ''}
                onChange={(e) => {
                  if (onUpdateParticipant) onUpdateParticipant({ certificateId: e.target.value });
                  onUpdateElement(selectedElement.id, { staticValue: e.target.value });
                }}
                placeholder="e.g. CC-HKT-2026-081"
                className="w-full text-xs font-mono px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Field Text Content
              </label>
              <input
                type="text"
                value={selectedElement.staticValue || ''}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    staticValue: e.target.value,
                  })
                }
                placeholder={`Enter custom text for ${selectedElement.label}...`}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          )}

          {/* Typography: Font Family & Font Weight (For text & signatures) */}
          {selectedElement.type !== 'qr' && (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Font Family
                  </label>
                  <select
                    value={selectedElement.fontFamily}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        fontFamily: e.target.value,
                      })
                    }
                    className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Cinzel">Cinzel (Formal Serif)</option>
                    <option value="Inter">Inter (Clean Sans)</option>
                    <option value="Playfair Display">Playfair Display (Luxury)</option>
                    <option value="Montserrat">Montserrat (Modern)</option>
                    <option value="Great Vibes">Great Vibes (Calligraphy)</option>
                    <option value="Orbitron">Orbitron (Cyber Tech)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Font Weight
                  </label>
                  <select
                    value={selectedElement.fontWeight}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        fontWeight: e.target.value,
                      })
                    }
                    className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
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

              {/* Font Size Slider */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Font Size
                  </label>
                  <span className="text-xs font-bold text-slate-800 dark:text-emerald-400 font-mono">
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
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Color Selection & Swatches */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Text Color
                </label>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {COLOR_SWATCHES.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => onUpdateElement(selectedElement.id, { color: hex })}
                      className={`w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 transition cursor-pointer ${
                        selectedElement.color.toLowerCase() === hex.toLowerCase()
                          ? 'ring-2 ring-emerald-500 scale-110'
                          : ''
                      }`}
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, { color: e.target.value })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={selectedElement.color}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, { color: e.target.value })
                    }
                    className="flex-1 text-xs font-mono px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Text Alignment & Text Case */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alignment
                  </label>
                  <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden p-0.5 bg-white dark:bg-slate-900">
                    <button
                      onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'left' })}
                      className={`flex-1 py-1 flex items-center justify-center transition cursor-pointer ${
                        selectedElement.textAlign === 'left'
                          ? 'bg-emerald-500 text-slate-950 font-bold rounded'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'center' })}
                      className={`flex-1 py-1 flex items-center justify-center transition cursor-pointer ${
                        selectedElement.textAlign === 'center'
                          ? 'bg-emerald-500 text-slate-950 font-bold rounded'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'right' })}
                      className={`flex-1 py-1 flex items-center justify-center transition cursor-pointer ${
                        selectedElement.textAlign === 'right'
                          ? 'bg-emerald-500 text-slate-950 font-bold rounded'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Text Case
                  </label>
                  <select
                    value={selectedElement.textCase || 'none'}
                    onChange={(e) =>
                      onUpdateElement(selectedElement.id, {
                        textCase: e.target.value as any,
                      })
                    }
                    className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="none">As Typed</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="capitalize">Capitalize Each Word</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Position Sliders */}
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Horizontal (X): {Math.round(selectedElement.x)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedElement.x}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, { x: Number(e.target.value) })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Vertical (Y): {Math.round(selectedElement.y)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedElement.y}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, { y: Number(e.target.value) })
                }
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
