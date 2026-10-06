import React, { useState } from 'react';
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
  Sliders,
  FileEdit,
  PenTool,
  Award,
  Calendar,
  Building,
  User,
  Hash,
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
  const [viewMode, setViewMode] = useState<'all' | 'style'>('all');

  const selectedElement =
    elements.find((el) => el.id === selectedElementId) || elements[0];

  // Helper to get element by id or dataSource
  const getEl = (id: string) => elements.find((el) => el.id === id);

  return (
    <div className="space-y-4">
      {/* Top Header: Tab Mode Switcher + Action Buttons */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setViewMode('all')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5 text-emerald-500" />
            <span>Edit All 12 Fields</span>
          </button>
          <button
            onClick={() => setViewMode('style')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'style'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Fonts & Styling</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetElements}
            title="Reset all elements to template defaults"
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onAddElement}
            title="Add a new custom text field"
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-emerald-400 transition cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>+ Add Field</span>
          </button>
        </div>
      </div>

      {/* Quick Element Selector Pills */}
      <div>
        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Select Field to Highlight on Canvas:
        </label>
        <div className="flex flex-wrap gap-1">
          {elements.map((el) => {
            const isSelected = el.id === selectedElement?.id;
            return (
              <button
                key={el.id}
                onClick={() => {
                  onSelectElement(el.id);
                  setViewMode('style');
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {el.type === 'qr' ? (
                  <QrCode className="w-3 h-3 opacity-70" />
                ) : el.type === 'signature' ? (
                  <PenTool className="w-3 h-3 opacity-70" />
                ) : (
                  <Type className="w-3 h-3 opacity-70" />
                )}
                <span>{el.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: DIRECT EDITING OPTION FOR ALL 12 CERTIFICATE FIELDS */}
      {/* ========================================================================= */}
      {viewMode === 'all' && (
        <div className="space-y-3 pt-1">
          {/* 1. Top Badge */}
          {getEl('top-tag') && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-500" />
                  Top Badge / Tag
                </span>
                <button
                  onClick={() => {
                    onSelectElement('top-tag');
                    setViewMode('style');
                  }}
                  className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                >
                  Style Font & Color →
                </button>
              </div>
              <input
                type="text"
                value={getEl('top-tag')?.staticValue || ''}
                onChange={(e) =>
                  onUpdateElement('top-tag', { staticValue: e.target.value })
                }
                placeholder="e.g. ANNUAL INNOVATION HACKATHON"
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* 2. Certificate Header */}
          {getEl('header') && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-amber-500" />
                  Certificate Header
                </span>
                <button
                  onClick={() => {
                    onSelectElement('header');
                    setViewMode('style');
                  }}
                  className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  Style Font & Color →
                </button>
              </div>
              <input
                type="text"
                value={getEl('header')?.staticValue || ''}
                onChange={(e) =>
                  onUpdateElement('header', { staticValue: e.target.value })
                }
                placeholder="e.g. CERTIFICATE OF PARTICIPATION / EXCELLENCE"
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* 3. Subtitle */}
          {getEl('subtitle') && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-slate-400" />
                  Subtitle
                </span>
                <button
                  onClick={() => {
                    onSelectElement('subtitle');
                    setViewMode('style');
                  }}
                  className="text-[10px] text-slate-500 dark:text-slate-400 hover:underline font-semibold"
                >
                  Style Font & Color →
                </button>
              </div>
              <input
                type="text"
                value={getEl('subtitle')?.staticValue || ''}
                onChange={(e) =>
                  onUpdateElement('subtitle', { staticValue: e.target.value })
                }
                placeholder="e.g. THIS CERTIFICATE IS PROUDLY PRESENTED TO"
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* 4. Participant Name */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                Participant Name (Preview)
              </span>
              <button
                onClick={() => {
                  onSelectElement('name');
                  setViewMode('style');
                }}
                className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-semibold"
              >
                Style Font & Color →
              </button>
            </div>
            <input
              type="text"
              value={participant?.name || ''}
              onChange={(e) =>
                onUpdateParticipant && onUpdateParticipant({ name: e.target.value })
              }
              placeholder="e.g. Aarav Sharma"
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 block">
              Auto-replaced for each student during automated dispatch.
            </span>
          </div>

          {/* 5. College / Institution */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-500" />
                College / Institution
              </span>
              <button
                onClick={() => {
                  onSelectElement('college');
                  setViewMode('style');
                }}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Style Font & Color →
              </button>
            </div>
            <input
              type="text"
              value={participant?.college || ''}
              onChange={(e) =>
                onUpdateParticipant && onUpdateParticipant({ college: e.target.value })
              }
              placeholder="e.g. Indian Institute of Technology, Bombay"
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* 6. Event Description */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-emerald-500" />
                Event Description
              </span>
              <button
                onClick={() => {
                  onSelectElement('description');
                  setViewMode('style');
                }}
                className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                Style Font & Color →
              </button>
            </div>
            <textarea
              rows={2}
              value={participant?.description || ''}
              onChange={(e) =>
                onUpdateParticipant && onUpdateParticipant({ description: e.target.value })
              }
              placeholder="e.g. for actively participating and showcasing exceptional engineering skills during the event."
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* 7. Event Title */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Event Title
              </span>
              <button
                onClick={() => {
                  onSelectElement('eventTitle');
                  setViewMode('style');
                }}
                className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-semibold"
              >
                Style Font & Color →
              </button>
            </div>
            <input
              type="text"
              value={participant?.eventTitle || ''}
              onChange={(e) =>
                onUpdateParticipant && onUpdateParticipant({ eventTitle: e.target.value })
              }
              placeholder="e.g. National 36-Hour AI Hackathon"
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* 8. Issue Date */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                Issue Date
              </span>
              <button
                onClick={() => {
                  onSelectElement('date');
                  setViewMode('style');
                }}
                className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Style Font & Color →
              </button>
            </div>
            <input
              type="text"
              value={participant?.date || ''}
              onChange={(e) =>
                onUpdateParticipant && onUpdateParticipant({ date: e.target.value })
              }
              placeholder="e.g. October 15, 2026"
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          {/* 9. Certificate ID */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Certificate ID (Sample)
              </span>
              <button
                onClick={() => {
                  onSelectElement('certificateId');
                  setViewMode('style');
                }}
                className="text-[10px] text-slate-500 dark:text-slate-400 hover:underline font-semibold"
              >
                Style Font & Color →
              </button>
            </div>
            <input
              type="text"
              value={participant?.certificateId || ''}
              onChange={(e) =>
                onUpdateParticipant && onUpdateParticipant({ certificateId: e.target.value })
              }
              placeholder="e.g. CC-HKT-2026-081"
              className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
            />
          </div>

          {/* 10. QR Code */}
          {getEl('qr') && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                  QR Code Verification
                </span>
                <span className="text-[10px] text-slate-400">Scannable</span>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  QR Size: {getEl('qr')?.fontSize || 64}px
                </label>
                <input
                  type="range"
                  min="32"
                  max="128"
                  value={getEl('qr')?.fontSize || 64}
                  onChange={(e) =>
                    onUpdateElement('qr', { fontSize: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 11. Chair Signature */}
          {getEl('sig1') && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-amber-500" />
                  Chair Signature
                </span>
                <button
                  onClick={() => {
                    onSelectElement('sig1');
                    setViewMode('style');
                  }}
                  className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                >
                  Position & Color →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    value={getEl('sig1')?.signatoryName || 'Dr. Sarah Mitchell'}
                    onChange={(e) =>
                      onUpdateElement('sig1', { signatoryName: e.target.value })
                    }
                    placeholder="e.g. Dr. Sarah Mitchell"
                    className="w-full text-xs font-medium px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={getEl('sig1')?.signatoryTitle || getEl('sig1')?.staticValue || 'ORGANIZING CHAIR'}
                    onChange={(e) =>
                      onUpdateElement('sig1', {
                        signatoryTitle: e.target.value,
                        staticValue: e.target.value,
                      })
                    }
                    placeholder="e.g. ORGANIZING CHAIR"
                    className="w-full text-xs font-medium px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 12. Faculty Convener */}
          {getEl('sig2') && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <PenTool className="w-3.5 h-3.5 text-purple-500" />
                  Faculty Convener Signature
                </span>
                <button
                  onClick={() => {
                    onSelectElement('sig2');
                    setViewMode('style');
                  }}
                  className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  Position & Color →
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    value={getEl('sig2')?.signatoryName || 'Prof. Rajesh Khanna'}
                    onChange={(e) =>
                      onUpdateElement('sig2', { signatoryName: e.target.value })
                    }
                    placeholder="e.g. Prof. Rajesh Khanna"
                    className="w-full text-xs font-medium px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={getEl('sig2')?.signatoryTitle || getEl('sig2')?.staticValue || 'FACULTY CONVENER'}
                    onChange={(e) =>
                      onUpdateElement('sig2', {
                        signatoryTitle: e.target.value,
                        staticValue: e.target.value,
                      })
                    }
                    placeholder="e.g. FACULTY CONVENER"
                    className="w-full text-xs font-medium px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: TYPOGRAPHY, COLOR, AND POSITION STYLING FOR ACTIVE ELEMENT */}
      {/* ========================================================================= */}
      {viewMode === 'style' && selectedElement && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
          {/* Active Field Header & Actions */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700/70">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Styling: {selectedElement.label}
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

          {/* Text Content Input for Active Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
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
              className="w-full text-xs font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Font Family & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Font Family
              </label>
              <select
                value={selectedElement.fontFamily}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    fontFamily: e.target.value,
                  })
                }
                className="w-full text-xs font-medium px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
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
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Font Weight
              </label>
              <select
                value={selectedElement.fontWeight}
                onChange={(e) =>
                  onUpdateElement(selectedElement.id, {
                    fontWeight: e.target.value,
                  })
                }
                className="w-full text-xs font-medium px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
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
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
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
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
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

          {/* Text Alignment & Text Transform */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Alignment
              </label>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden p-0.5 bg-white dark:bg-slate-900">
                <button
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'left' })}
                  className={`flex-1 py-1 flex items-center justify-center transition cursor-pointer ${
                    selectedElement.textAlign === 'left'
                      ? 'bg-emerald-500 text-slate-950 font-bold rounded'
                      : 'text-slate-500'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'center' })}
                  className={`flex-1 py-1 flex items-center justify-center transition cursor-pointer ${
                    selectedElement.textAlign === 'center'
                      ? 'bg-emerald-500 text-slate-950 font-bold rounded'
                      : 'text-slate-500'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onUpdateElement(selectedElement.id, { textAlign: 'right' })}
                  className={`flex-1 py-1 flex items-center justify-center transition cursor-pointer ${
                    selectedElement.textAlign === 'right'
                      ? 'bg-emerald-500 text-slate-950 font-bold rounded'
                      : 'text-slate-500'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
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

          {/* Position Sliders */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200 dark:border-slate-700/60">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
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
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
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
