import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Send,
  Terminal,
  Clock,
  Copy,
  Check,
  Server,
  Edit3,
  UserPlus,
  Trash2,
  ListFilter,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Participant, ColumnMapping } from '../types';
import type { AutomationConfig, AutomationLog } from '../utils/automationUtils';
import {
  DEFAULT_CONFIG,
  dispatchToWebhook,
  generatePdfBase64,
} from '../utils/automationUtils';
import { N8N_WORKFLOW_TEMPLATE } from '../utils/n8nWorkflow';
import { DEMO_PARTICIPANTS } from '../data/mockData';

interface AutomationControlPanelProps {
  participants: Participant[];
  setParticipants: (list: Participant[]) => void;
  activeParticipant: Participant;
  setActiveParticipant: (p: Participant) => void;
  columnMapping: ColumnMapping;
  setColumnMapping: (mapping: ColumnMapping) => void;
  renderCurrentSvg: (p: Participant) => Promise<SVGSVGElement>;
}

export const AutomationControlPanel: React.FC<AutomationControlPanelProps> = ({
  participants,
  setParticipants,
  activeParticipant,
  setActiveParticipant,
  columnMapping,
  setColumnMapping,
  renderCurrentSvg,
}) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);

  // Webhook and email configuration
  const [config, setConfig] = useState<AutomationConfig>(() => {
    const saved = localStorage.getItem('certifycraft_n8n_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      ...DEFAULT_CONFIG,
      webhookUrl: 'http://localhost:5678/webhook/certifycraft-email',
    };
  });

  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  // Student Input Mode Tab: 'upload' | 'paste' | 'single'
  const [studentInputMode, setStudentInputMode] = useState<'upload' | 'paste' | 'single'>('upload');
  const [showRosterTable, setShowRosterTable] = useState(false);

  // Bulk manual paste text
  const [bulkPasteText, setBulkPasteText] = useState('');
  
  // Single student manual entry
  const [singleStudent, setSingleStudent] = useState({
    name: '',
    email: '',
    college: '',
    rank: 'Participant',
    certificateId: '',
  });

  // Dispatch state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [logs, setLogs] = useState<AutomationLog[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);

  // Save config changes to localStorage
  const handleConfigChange = (updates: Partial<AutomationConfig>) => {
    const next = { ...config, ...updates };
    setConfig(next);
    localStorage.setItem('certifycraft_n8n_config', JSON.stringify(next));
  };

  const handleCopyN8nWorkflow = () => {
    navigator.clipboard.writeText(JSON.stringify(N8N_WORKFLOW_TEMPLATE, null, 2));
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2500);
  };

  // Handle Excel upload
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

          const mapped: Participant[] = data.map((row, idx) => ({
            id: String(idx + 1),
            name: String(row[nameCol] || `Participant ${idx + 1}`),
            college: String(row[collegeCol] || 'University'),
            email: String(row[emailCol] || `student${idx + 1}@example.com`),
            certificateId: String(row[idCol] || `CC-2026-${String(idx + 1).padStart(4, '0')}`),
            eventTitle: String(row[eventCol] || activeParticipant?.eventTitle || 'National Hackathon'),
            date: String(row[dateCol] || activeParticipant?.date || 'October 15, 2026'),
            rank: String(row[rankCol] || 'Participant'),
            description: 'for actively participating and showcasing exceptional engineering skills during the event.',
          }));

          setParticipants(mapped);
          if (mapped.length > 0) {
            setActiveParticipant(mapped[0]);
          }
          setCurrentIndex(0);
          setSentCount(0);
          setFailedCount(0);
          setLogs([]);
        }
      } catch (err) {
        console.error('Error parsing spreadsheet:', err);
        alert('Failed to parse file. Please upload a valid .xlsx, .xls, or .csv file.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  // Parse bulk pasted text (comma, tab, semicolon separated)
  const parsePastedStudents = (text: string): Participant[] => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    const parsed: Participant[] = [];

    lines.forEach((line, idx) => {
      // Skip header if line has both name and email
      const lower = line.toLowerCase();
      if (idx === 0 && lower.includes('name') && lower.includes('email')) {
        return;
      }

      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t').map((s) => s.trim());
      } else if (line.includes(',')) {
        parts = line.split(',').map((s) => s.trim());
      } else if (line.includes(';')) {
        parts = line.split(';').map((s) => s.trim());
      } else {
        parts = [line];
      }

      if (parts.length === 0 || !parts[0]) return;

      const name = parts[0];
      const emailCandidate = parts.find((p) => p.includes('@')) || parts[1] || `student${idx + 1}@example.com`;
      const college = (parts[1] && !parts[1].includes('@') ? parts[1] : parts[2]) || 'University';
      const rank = parts[3] || 'Participant';
      const certId = parts[4] || `CC-2026-${String(Date.now() % 10000 + idx).padStart(4, '0')}`;

      parsed.push({
        id: String(Date.now() + idx),
        name,
        email: emailCandidate,
        college,
        certificateId: certId,
        eventTitle: activeParticipant?.eventTitle || 'National Hackathon',
        date: activeParticipant?.date || 'October 15, 2026',
        rank,
        description: 'for actively participating and showcasing exceptional engineering skills during the event.',
      });
    });

    return parsed;
  };

  const handleApplyPastedStudents = (replace: boolean) => {
    const parsed = parsePastedStudents(bulkPasteText);
    if (parsed.length === 0) {
      alert('Could not parse any student records. Format: Name, Email, College, Award/Rank');
      return;
    }

    if (replace) {
      setParticipants(parsed);
      setActiveParticipant(parsed[0]);
      setCurrentIndex(0);
      setSentCount(0);
      setFailedCount(0);
      setLogs([]);
    } else {
      setParticipants([...participants, ...parsed]);
    }

    setBulkPasteText('');
    alert(`Successfully ${replace ? 'loaded' : 'added'} ${parsed.length} students!`);
  };

  // Add single student
  const handleAddSingleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleStudent.name.trim() || !singleStudent.email.trim()) {
      alert('Please enter at least Student Name and Email.');
      return;
    }

    const newStudent: Participant = {
      id: String(Date.now()),
      name: singleStudent.name.trim(),
      email: singleStudent.email.trim(),
      college: singleStudent.college.trim() || 'University',
      rank: singleStudent.rank.trim() || 'Participant',
      certificateId: singleStudent.certificateId.trim() || `CC-2026-${String(participants.length + 1).padStart(4, '0')}`,
      eventTitle: activeParticipant?.eventTitle || 'National Hackathon',
      date: activeParticipant?.date || 'October 15, 2026',
      description: 'for actively participating and showcasing exceptional engineering skills during the event.',
    };

    setParticipants([newStudent, ...participants]);
    setActiveParticipant(newStudent);
    setSingleStudent({ name: '', email: '', college: '', rank: 'Participant', certificateId: '' });
  };

  const handleDeleteStudent = (id: string) => {
    const updated = participants.filter((p) => p.id !== id);
    setParticipants(updated);
    if (activeParticipant.id === id && updated.length > 0) {
      setActiveParticipant(updated[0]);
    }
  };

  // Test webhook with 1 single student
  const handleSendTestWebhook = async () => {
    if (!config.webhookUrl || !config.webhookUrl.startsWith('http')) {
      alert('Please enter your n8n Webhook URL first.');
      return;
    }

    const targetRecipient: Participant = {
      ...activeParticipant,
      email: testEmail.trim() || activeParticipant.email,
    };

    setIsTesting(true);
    setTestStatus('Generating PDF certificate...');

    try {
      const svg = await renderCurrentSvg(targetRecipient);
      const pdfBase64 = await generatePdfBase64(svg);

      setTestStatus(`Dispatching to n8n webhook (${targetRecipient.email})...`);
      const res = await dispatchToWebhook(config.webhookUrl, targetRecipient, pdfBase64, config);

      if (res.success) {
        setTestStatus(`✅ Success! Webhook triggered. Certificate PDF sent to ${targetRecipient.email}`);
      } else {
        setTestStatus(`❌ Error: ${res.statusText}`);
      }
    } catch (err: any) {
      setTestStatus(`❌ Error: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Start Batch Automation Dispatch for ALL participants
  const handleStartBatchAutomation = async () => {
    if (!config.webhookUrl || !config.webhookUrl.startsWith('http')) {
      alert('Please enter your n8n Webhook URL before starting.');
      return;
    }
    if (participants.length === 0) {
      alert('Please upload or enter student details first.');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    abortControllerRef.current = false;
    isPausedRef.current = false;

    let success = sentCount;
    let failure = failedCount;

    for (let i = currentIndex; i < participants.length; i++) {
      if (abortControllerRef.current) break;

      while (isPausedRef.current) {
        await new Promise((r) => setTimeout(r, 400));
        if (abortControllerRef.current) break;
      }
      if (abortControllerRef.current) break;

      const p = participants[i];
      setCurrentIndex(i + 1);
      setActiveParticipant(p);

      const logId = `${p.id}-${Date.now()}`;
      setLogs((prev) => [
        {
          id: logId,
          studentName: p.name,
          studentEmail: p.email,
          status: 'generating',
          message: 'Rendering PDF...',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 49),
      ]);

      try {
        const svg = await renderCurrentSvg(p);
        const pdfBase64 = await generatePdfBase64(svg);

        // Update status to sending so the user sees it is actively transmitting
        setLogs((prev) =>
          prev.map((l) =>
            l.id === logId
              ? { ...l, status: 'generating', message: `Sending email to ${p.email}...` }
              : l
          )
        );

        const res = await dispatchToWebhook(config.webhookUrl, p, pdfBase64, config);

        if (res.success) {
          success++;
          setSentCount(success);
          setLogs((prev) =>
            prev.map((l) =>
              l.id === logId
                ? { ...l, status: 'success', message: `Email Sent & Delivered to ${p.email}` }
                : l
            )
          );
        } else {
          failure++;
          setFailedCount(failure);
          setLogs((prev) =>
            prev.map((l) =>
              l.id === logId ? { ...l, status: 'failed', message: res.statusText || 'Delivery error' } : l
            )
          );
        }
      } catch (err: any) {
        failure++;
        setFailedCount(failure);
        setLogs((prev) =>
          prev.map((l) =>
            l.id === logId ? { ...l, status: 'failed', message: err.message || 'Generation error' } : l
          )
        );
      }

      if (config.delayMs > 0 && i < participants.length - 1) {
        await new Promise((r) => setTimeout(r, config.delayMs));
      }
    }

    setIsRunning(false);
  };

  const handlePause = () => {
    isPausedRef.current = !isPaused;
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    abortControllerRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleResetProgress = () => {
    setCurrentIndex(0);
    setSentCount(0);
    setFailedCount(0);
    setLogs([]);
  };

  const percentComplete =
    participants.length > 0 ? Math.round((currentIndex / participants.length) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* SECTION 1: n8n Webhook Settings */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Server className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                n8n Automation Engine
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Local automation — 100% free & unlimited email dispatches
              </p>
            </div>
          </div>
          <button
            onClick={handleCopyN8nWorkflow}
            title="Copy n8n 1-Click Workflow JSON"
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
          >
            {copiedWorkflow ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWorkflow ? 'Copied Workflow!' : 'Copy Workflow'}</span>
          </button>
        </div>

        {/* Webhook URL Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target n8n Webhook URL
          </label>
          <input
            type="url"
            value={config.webhookUrl}
            onChange={(e) => handleConfigChange({ webhookUrl: e.target.value })}
            placeholder="http://localhost:5678/webhook/certifycraft-email"
            className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Email Subject Template */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Subject
          </label>
          <input
            type="text"
            value={config.emailSubject}
            onChange={(e) => handleConfigChange({ emailSubject: e.target.value })}
            placeholder="Your Certificate of Participation - {eventTitle}"
            className="w-full text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        {/* Test Email Verification Box */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Enter your email to test 1 certificate..."
            className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
          />
          <button
            onClick={handleSendTestWebhook}
            disabled={isTesting || isRunning}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isTesting ? 'Sending...' : 'Send Test PDF'}</span>
          </button>
        </div>

        {testStatus && (
          <div className="text-xs p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200">
            {testStatus}
          </div>
        )}
      </div>

      {/* SECTION 2: Student Details & Bulk Entry */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Student Details Entry
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload Excel or paste 1,000s of student details directly
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700">
            {participants.length} Students Loaded
          </span>
        </div>

        {/* Tab switch: Upload vs Manual Bulk Paste vs Single */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
          <button
            onClick={() => setStudentInputMode('upload')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              studentInputMode === 'upload'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>
          <button
            onClick={() => setStudentInputMode('paste')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              studentInputMode === 'paste'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Paste Bulk Details</span>
          </button>
          <button
            onClick={() => setStudentInputMode('single')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              studentInputMode === 'single'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Single</span>
          </button>
        </div>

        {/* 1. Upload Excel/CSV */}
        {studentInputMode === 'upload' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-xs cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Excel / CSV (.xlsx, .csv)</span>
              </button>

              <button
                onClick={() => {
                  setParticipants(DEMO_PARTICIPANTS);
                  setActiveParticipant(DEMO_PARTICIPANTS[0]);
                  setCurrentIndex(0);
                  setSentCount(0);
                  setFailedCount(0);
                }}
                className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              >
                Demo (8 Students)
              </button>
            </div>

            {/* Column Mapping Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block">Name Column</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{columnMapping.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Email Column</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{columnMapping.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">College Column</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{columnMapping.college}</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Manual Paste Bulk Students Box */}
        {studentInputMode === 'paste' && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Paste student rows (copy from Excel or write comma/tab separated):
              </label>
              {bulkPasteText.trim() && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  ~{parsePastedStudents(bulkPasteText).length} rows detected
                </span>
              )}
            </div>
            <textarea
              rows={4}
              value={bulkPasteText}
              onChange={(e) => setBulkPasteText(e.target.value)}
              placeholder={`Format: Name, Email, College, Award, Certificate ID\nExample:\nAarav Sharma, aarav@iitb.ac.in, IIT Bombay, 1st Place, CC-2026-001\nSneha Patel, sneha@nitk.edu.in, NIT Karnataka, 2nd Place, CC-2026-002`}
              className="w-full text-xs font-mono p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleApplyPastedStudents(true)}
                disabled={!bulkPasteText.trim()}
                className="flex-1 py-1.5 px-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer disabled:opacity-50"
              >
                Load Pasted Students (Replace List)
              </button>
              <button
                onClick={() => handleApplyPastedStudents(false)}
                disabled={!bulkPasteText.trim()}
                className="py-1.5 px-3 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition cursor-pointer disabled:opacity-50"
              >
                + Append to List
              </button>
            </div>
          </div>
        )}

        {/* 3. Add Single Student Form */}
        {studentInputMode === 'single' && (
          <form onSubmit={handleAddSingleStudent} className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Student Name *"
                value={singleStudent.name}
                onChange={(e) => setSingleStudent({ ...singleStudent, name: e.target.value })}
                required
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={singleStudent.email}
                onChange={(e) => setSingleStudent({ ...singleStudent, email: e.target.value })}
                required
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="College / University"
                value={singleStudent.college}
                onChange={(e) => setSingleStudent({ ...singleStudent, college: e.target.value })}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Award / Rank (e.g. Winner)"
                value={singleStudent.rank}
                onChange={(e) => setSingleStudent({ ...singleStudent, rank: e.target.value })}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Certificate ID (optional)"
                value={singleStudent.certificateId}
                onChange={(e) => setSingleStudent({ ...singleStudent, certificateId: e.target.value })}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition cursor-pointer"
            >
              + Add Student to Batch Roster
            </button>
          </form>
        )}

        {/* View / Manage Roster Button */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <button
            onClick={() => setShowRosterTable(!showRosterTable)}
            className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{showRosterTable ? 'Hide Student List' : `View Loaded Students (${participants.length})`}</span>
          </button>
          {participants.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all loaded students?')) {
                  setParticipants([]);
                  setCurrentIndex(0);
                  setSentCount(0);
                  setFailedCount(0);
                }
              }}
              className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Expandable Student Roster Table */}
        {showRosterTable && participants.length > 0 && (
          <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 sticky top-0">
                <tr>
                  <th className="p-1.5">#</th>
                  <th className="p-1.5">Name</th>
                  <th className="p-1.5">Email</th>
                  <th className="p-1.5">College</th>
                  <th className="p-1.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {participants.map((p, idx) => (
                  <tr
                    key={p.id}
                    onClick={() => setActiveParticipant(p)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer ${
                      activeParticipant.id === p.id ? 'bg-emerald-50/60 dark:bg-emerald-950/30' : ''
                    }`}
                  >
                    <td className="p-1.5 text-slate-400">{idx + 1}</td>
                    <td className="p-1.5 font-semibold text-slate-900 dark:text-white truncate max-w-[100px]">
                      {p.name}
                    </td>
                    <td className="p-1.5 text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                      {p.email}
                    </td>
                    <td className="p-1.5 text-slate-500 truncate max-w-[90px]">{p.college}</td>
                    <td className="p-1.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudent(p.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-0.5 cursor-pointer"
                        title="Remove student"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 3: Live Batch Automation Dispatch Console */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Live Automation Dispatcher
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Generates vector PDF & delivers via n8n for each student
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRunning && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Active
              </span>
            )}
          </div>
        </div>

        {/* Counter Stats */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">{participants.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold block">Sent</span>
            <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">{sentCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40">
            <span className="text-[10px] text-red-600 dark:text-red-400 uppercase font-bold block">Failed</span>
            <span className="font-bold text-sm text-red-700 dark:text-red-400">{failedCount}</span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-bold block">Remaining</span>
            <span className="font-bold text-sm text-amber-700 dark:text-amber-400">
              {Math.max(0, participants.length - currentIndex)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">
              {isRunning
                ? `Dispatching to ${activeParticipant.name} (${activeParticipant.email})...`
                : currentIndex >= participants.length && participants.length > 0
                ? 'All Certificates Dispatched!'
                : 'Ready to Launch'}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              {currentIndex} / {participants.length} ({percentComplete}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* Automation Control Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {!isRunning ? (
            <button
              onClick={handleStartBatchAutomation}
              disabled={participants.length === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {currentIndex > 0 && currentIndex < participants.length
                  ? `Resume Dispatch (${participants.length - currentIndex} remaining)`
                  : `🚀 Start Automated Dispatch (${participants.length} Students)`}
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={handlePause}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              <button
                onClick={handleStop}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
              >
                Stop
              </button>
            </>
          )}

          {currentIndex > 0 && !isRunning && (
            <button
              onClick={handleResetProgress}
              title="Reset progress to student 1"
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Terminal Log Stream */}
        {logs.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Real-Time Dispatch Log
            </span>
            <div className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] max-h-36 overflow-y-auto space-y-1 border border-slate-800">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    {log.status === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                    {log.status === 'failed' && <AlertCircle className="w-3 h-3 text-red-400 shrink-0" />}
                    {log.status === 'generating' && <Clock className="w-3 h-3 text-emerald-400 animate-spin shrink-0" />}
                    <span className="font-semibold text-white">{log.studentName}:</span>
                    <span className="text-slate-400 truncate">{log.message}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
