import React from 'react';

interface WorkflowStepsProps {
  templateName: string;
  rosterCount: number;
  activeStudentName: string;
  activeTab: 'inspector' | 'participants' | 'templates';
  setActiveTab: (tab: 'inspector' | 'participants' | 'templates') => void;
}

export const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  templateName,
  rosterCount,
  activeStudentName,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-2.5 px-4 sm:px-6 transition-colors">
      <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
        {/* Steps */}
        <div className="flex items-center gap-2 sm:gap-6 flex-wrap">
          {/* Step 1 */}
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
              1
            </span>
            <span>Template:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{templateName}</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

          {/* Step 2 */}
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'participants'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
              2
            </span>
            <span>Roster:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{rosterCount} Students</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

          {/* Step 3 */}
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activeTab === 'inspector'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
              3
            </span>
            <span>Drag & Drop Fields on Canvas</span>
          </button>
        </div>

        {/* Right Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-slate-500 dark:text-slate-400">Active Preview:</span>
          <span className="font-semibold text-slate-900 dark:text-amber-400">{activeStudentName}</span>
        </div>
      </div>
    </div>
  );
};
