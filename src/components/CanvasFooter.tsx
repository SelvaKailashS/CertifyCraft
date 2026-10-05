import React from 'react';
import {
  FileText,
  Image,
  Archive,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { Participant } from '../types';

interface CanvasFooterProps {
  activeParticipant: Participant;
  selectedElementName: string;
  selectedCount: number;
  onDownloadPng: () => void;
  onDownloadPdf: () => void;
  onDownloadBulkZip: () => void;
}

export const CanvasFooter: React.FC<CanvasFooterProps> = ({
  activeParticipant,
  selectedElementName,
  selectedCount,
  onDownloadPng,
  onDownloadPdf,
  onDownloadBulkZip,
}) => {
  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs px-2 text-slate-600 dark:text-slate-400">
        <div>
          <span>Previewing: </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {activeParticipant.name}
          </span>{' '}
          <span>({activeParticipant.college})</span>
        </div>
        <div>
          <span>Selected: </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {selectedElementName}
          </span>
        </div>
      </div>

      {/* Export Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Export Certificate for: {activeParticipant.name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            High-resolution vector output with scannable QR verification code.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={onDownloadPng}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition shadow-xs cursor-pointer"
          >
            <Image className="w-4 h-4 text-cyan-500" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition shadow-xs cursor-pointer"
          >
            <FileText className="w-4 h-4 text-red-500" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={onDownloadBulkZip}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 transition shadow-sm cursor-pointer"
          >
            <Archive className="w-4 h-4" />
            <span>Bulk ZIP ({selectedCount})</span>
          </button>
        </div>
      </div>

      {/* Feature Highlight Cards (Exact match to video) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
          <div className="mt-0.5 text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-slate-900 dark:text-white">
              Any Excel / CSV
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Upload spreadsheets with student names and colleges from any event.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
          <div className="mt-0.5 text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-slate-900 dark:text-white">
              Visual Placement
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Drag text boxes right on the template with live position coordinates.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3">
          <div className="mt-0.5 text-blue-500">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-slate-900 dark:text-white">
              Verified QR Codes
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Every certificate includes a tamper-proof scannable verification link.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
