import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Sparkles,
  Download,
  CheckCircle2,
  Search,
  CheckSquare,
  Square,
  Eye,
  FileText,
  Image,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Participant, ColumnMapping } from '../types';
import { DEMO_PARTICIPANTS, generateStressTestParticipants } from '../data/mockData';
import { downloadSampleExcel } from '../utils/exportUtils';

interface ParticipantsTabProps {
  participants: Participant[];
  setParticipants: (list: Participant[]) => void;
  selectedParticipantIds: string[];
  setSelectedParticipantIds: (ids: string[]) => void;
  activeParticipant: Participant;
  setActiveParticipant: (p: Participant) => void;
  columnMapping: ColumnMapping;
  setColumnMapping: (mapping: ColumnMapping) => void;
  onDownloadSinglePng: (p: Participant) => void;
  onDownloadSinglePdf: (p: Participant) => void;
}

export const ParticipantsTab: React.FC<ParticipantsTabProps> = ({
  participants,
  setParticipants,
  selectedParticipantIds,
  setSelectedParticipantIds,
  activeParticipant,
  setActiveParticipant,
  columnMapping,
  setColumnMapping,
  onDownloadSinglePng,
  onDownloadSinglePdf,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableColumns, setAvailableColumns] = useState<string[]>([
    'Student Name',
    'College / University',
    'Event Name',
    'Date',
    'Rank / Award',
    'Certificate ID',
    'Student Email',
  ]);

  // Handle spreadsheet file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

        if (data.length > 0) {
          const cols = Object.keys(data[0]);
          setAvailableColumns(cols);

          // Smart auto-mapping
          const findCol = (keys: string[]) =>
            cols.find((c) => keys.some((k) => c.toLowerCase().includes(k))) || cols[0] || '';

          const nameCol = findCol(['student', 'name', 'participant']);
          const collegeCol = findCol(['college', 'university', 'inst', 'org']);
          const eventCol = findCol(['event', 'competition', 'hackathon', 'title']);
          const dateCol = findCol(['date', 'time', 'issued']);
          const rankCol = findCol(['rank', 'award', 'position', 'place']);
          const idCol = findCol(['certificate', 'id', 'cert', 'code']);
          const emailCol = findCol(['email', 'mail']);

          setColumnMapping({
            name: nameCol,
            college: collegeCol,
            eventTitle: eventCol,
            date: dateCol,
            rank: rankCol,
            certificateId: idCol,
            email: emailCol,
          });

          // Convert to participants
          const mapped: Participant[] = data.map((row, idx) => ({
            id: String(idx + 1),
            name: String(row[nameCol] || `Participant ${idx + 1}`),
            college: String(row[collegeCol] || 'University'),
            email: String(row[emailCol] || `student${idx + 1}@example.com`),
            certificateId: String(row[idCol] || `CC-2026-${String(idx + 1).padStart(4, '0')}`),
            eventTitle: String(row[eventCol] || 'National AI Hackathon'),
            date: String(row[dateCol] || 'October 15, 2026'),
            rank: String(row[rankCol] || 'Participant'),
            description: 'for actively participating and showcasing exceptional engineering skills during the event.',
          }));

          setParticipants(mapped);
          setSelectedParticipantIds(mapped.map((p) => p.id));
          if (mapped.length > 0) {
            setActiveParticipant(mapped[0]);
          }
        }
      } catch (err) {
        console.error('Error parsing spreadsheet:', err);
        alert('Failed to parse file. Please upload a valid .xlsx, .xls, or .csv file.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Filter participants
  const filteredParticipants = participants.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.college.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.certificateId.toLowerCase().includes(q) ||
      p.rank.toLowerCase().includes(q)
    );
  });

  const toggleSelectAll = () => {
    if (selectedParticipantIds.length === participants.length) {
      setSelectedParticipantIds([]);
    } else {
      setSelectedParticipantIds(participants.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedParticipantIds.includes(id)) {
      setSelectedParticipantIds(selectedParticipantIds.filter((item) => item !== id));
    } else {
      setSelectedParticipantIds([...selectedParticipantIds, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Spreadsheet Drop Zone */}
      <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/30 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Drop your student Excel or CSV spreadsheet here
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Supports <span className="font-mono font-medium">.xlsx</span>,{' '}
            <span className="font-mono font-medium">.xls</span>, and{' '}
            <span className="font-mono font-medium">.csv</span> files
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Browse File</span>
          </button>

          <button
            onClick={() => {
              setParticipants(DEMO_PARTICIPANTS);
              setSelectedParticipantIds(DEMO_PARTICIPANTS.map((p) => p.id));
              setActiveParticipant(DEMO_PARTICIPANTS[0]);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Demo (8 Students)</span>
          </button>
        </div>

        {/* Stress test button */}
        <div className="pt-1">
          <button
            onClick={() => {
              const stress = generateStressTestParticipants(4000);
              setParticipants(stress);
              setSelectedParticipantIds(stress.map((p) => p.id));
              setActiveParticipant(stress[0]);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40 hover:bg-amber-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load 4,000 Students (Stress Test)</span>
          </button>
        </div>

        <div>
          <button
            onClick={downloadSampleExcel}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-2 flex items-center justify-center gap-1 mx-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Sample .xlsx</span>
          </button>
        </div>

        {/* Loaded Status Badge */}
        <div className="pt-2 flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Sample Demo Roster</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
              {participants.length} Students Loaded
            </span>
          </div>
          <button
            onClick={() => {
              setParticipants(DEMO_PARTICIPANTS);
              setSelectedParticipantIds(DEMO_PARTICIPANTS.map((p) => p.id));
              setActiveParticipant(DEMO_PARTICIPANTS[0]);
            }}
            className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold text-xs cursor-pointer"
          >
            Reset to Demo
          </button>
        </div>
      </div>

      {/* Column Mapping Section */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Column Mapping
          </h4>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            Smart-Mapped
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Match the spreadsheet columns with your certificate fields.
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Participant Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Participant Name <span className="text-red-500">*Required</span>
            </label>
            <select
              value={columnMapping.name}
              onChange={(e) => setColumnMapping({ ...columnMapping, name: e.target.value })}
              className="w-full font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* College / Institution */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              College / Institution <span className="text-red-500">*Required</span>
            </label>
            <select
              value={columnMapping.college}
              onChange={(e) => setColumnMapping({ ...columnMapping, college: e.target.value })}
              className="w-full font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Event Name */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Event Name
            </label>
            <select
              value={columnMapping.eventTitle}
              onChange={(e) => setColumnMapping({ ...columnMapping, eventTitle: e.target.value })}
              className="w-full font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <select
              value={columnMapping.date}
              onChange={(e) => setColumnMapping({ ...columnMapping, date: e.target.value })}
              className="w-full font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Rank / Award */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Rank / Award / Position
            </label>
            <select
              value={columnMapping.rank}
              onChange={(e) => setColumnMapping({ ...columnMapping, rank: e.target.value })}
              className="w-full font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Certificate ID */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Certificate ID
            </label>
            <select
              value={columnMapping.certificateId}
              onChange={(e) => setColumnMapping({ ...columnMapping, certificateId: e.target.value })}
              className="w-full font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Student Email */}
          <div className="col-span-2">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student Email <span className="text-amber-500 font-normal">For Make Automation</span>
            </label>
            <select
              value={columnMapping.email}
              onChange={(e) => setColumnMapping({ ...columnMapping, email: e.target.value })}
              className="w-full font-medium px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            >
              {availableColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Participant List & Search */}
      <div className="space-y-3">
        {/* Search & Selection Header */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, college, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-24 py-2 text-xs font-medium rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
            {filteredParticipants.length} matching
          </span>
        </div>

        {/* Selection Bar */}
        <div className="flex items-center justify-between text-xs px-1">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {selectedParticipantIds.length === participants.length ? (
              <CheckSquare className="w-4 h-4 text-amber-500" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>
              {selectedParticipantIds.length === participants.length ? 'Deselect All' : 'Select All'}
            </span>
          </button>
          <span className="font-semibold text-slate-800 dark:text-amber-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
            {selectedParticipantIds.length} Selected
          </span>
        </div>

        {/* Cards List */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {filteredParticipants.slice(0, 50).map((p) => {
            const isSelected = selectedParticipantIds.includes(p.id);
            const isPreviewing = activeParticipant.id === p.id;

            return (
              <div
                key={p.id}
                className={`p-3 rounded-xl border transition ${
                  isPreviewing
                    ? 'border-amber-400 bg-amber-50/40 dark:border-amber-500/50 dark:bg-amber-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => toggleSelectOne(p.id)}
                      className="mt-0.5 cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {p.name}
                        </span>
                        {isPreviewing && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950">
                            Previewing
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>🏛️ {p.college}</span>
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                        <span>✉️ {p.email}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {p.certificateId}
                        </span>
                        {p.rank && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                            🏆 {p.rank}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => setActiveParticipant(p)}
                      title="Preview on canvas"
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>
                    <button
                      onClick={() => onDownloadSinglePdf(p)}
                      title="Download PDF"
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition font-medium cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => onDownloadSinglePng(p)}
                      title="Download PNG"
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition font-medium cursor-pointer"
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>PNG</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
