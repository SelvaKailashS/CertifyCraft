import React from 'react';
import { QrCode, FileSpreadsheet, Zap, Moon, Sun, DownloadCloud } from 'lucide-react';
import { downloadSampleExcel } from '../utils/exportUtils';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  participantCount: number;
  onOpenVerifier: () => void;
  onOpenMake: () => void;
  onOpenBulkExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  participantCount,
  onOpenVerifier,
  onOpenMake,
  onOpenBulkExport,
}) => {
  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold flex items-center justify-center tracking-tight shadow-md">
            CC
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              CertifyCraft
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Studio
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {/* QR Verifier Portal */}
          <button
            onClick={onOpenVerifier}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/60 transition shadow-xs"
          >
            <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">QR Verifier Portal</span>
          </button>

          {/* Sample Excel */}
          <button
            onClick={downloadSampleExcel}
            title="Download formatted sample spreadsheet (.xlsx)"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Sample Excel</span>
          </button>

          {/* Make.com Automation */}
          <button
            onClick={onOpenMake}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 transition shadow-xs"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="hidden sm:inline">Make.com Automation</span>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Bulk Export Button */}
          <button
            onClick={onOpenBulkExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 transition shadow-sm"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Bulk Export ({participantCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
