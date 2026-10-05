import React, { useState } from 'react';
import { X, Archive, FileText, Image, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BulkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onStartBulkExport: (format: 'png' | 'pdf') => Promise<void>;
  progress: { current: number; total: number; isExporting: boolean; done: boolean };
}

export const BulkExportModal: React.FC<BulkExportModalProps> = ({
  isOpen,
  onClose,
  selectedCount,
  onStartBulkExport,
  progress,
}) => {
  const [format, setFormat] = useState<'png' | 'pdf'>('png');

  if (!isOpen) return null;

  const percent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  const handleExport = async () => {
    await onStartBulkExport(format);
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Bulk Certificate Export
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Packaging {selectedCount} certificates into a ZIP archive
              </p>
            </div>
          </div>
          {!progress.isExporting && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!progress.isExporting && !progress.done && (
            <>
              {/* Format selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormat('png')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-center transition cursor-pointer ${
                      format === 'png'
                        ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/20 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <Image className="w-6 h-6 text-cyan-500" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        PNG Images
                      </span>
                      <span className="text-[10px] text-slate-500">
                        1920×1080 High-Res
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('pdf')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-center transition cursor-pointer ${
                      format === 'pdf'
                        ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/20 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <FileText className="w-6 h-6 text-red-500" />
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block">
                        PDF Documents
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Vector Print Ready
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Export Summary:
                </span>
                <p>• {selectedCount} unique student certificates will be generated</p>
                <p>• Each certificate includes individual verified QR codes</p>
                <p>• Packaged into a single downloadable .zip archive</p>
              </div>
            </>
          )}

          {/* Progress state */}
          {(progress.isExporting || progress.done) && (
            <div className="space-y-4 py-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  {progress.done ? 'Archive Complete!' : 'Rendering & Compressing...'}
                </span>
                <span className="text-amber-500 font-mono">
                  {progress.current} / {progress.total} ({percent}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-200"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {progress.done && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ZIP Download Started! Check your browser downloads.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex justify-end gap-2">
          {!progress.isExporting && !progress.done && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Download ZIP ({selectedCount})</span>
              </button>
            </>
          )}

          {progress.done && (
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
