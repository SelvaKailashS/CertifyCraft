import { useState, useRef, useEffect } from 'react';
import { Sliders, Users, Layers } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { WorkflowSteps } from './components/WorkflowSteps';
import { InspectorTab } from './components/InspectorTab';
import { ParticipantsTab } from './components/ParticipantsTab';
import { TemplatesTab } from './components/TemplatesTab';
import { CertificateCanvas } from './components/CertificateCanvas';
import { CanvasFooter } from './components/CanvasFooter';
import { QRVerifierModal } from './components/QRVerifierModal';
import { MakeAutomationModal } from './components/MakeAutomationModal';
import { BulkExportModal } from './components/BulkExportModal';
import { DEMO_PARTICIPANTS } from './data/mockData';
import { PRESET_TEMPLATES, DEFAULT_HACKATHON_ELEMENTS } from './templates/presets';
import type { Template, Participant, CanvasElement, ColumnMapping } from './types';
import { exportToPng, exportToPdf, exportBulkZip } from './utils/exportUtils';

export function App() {
  // Light theme by default (matches demo video)
  const [darkMode, setDarkMode] = useState(false);

  // Template & Elements state
  const [currentTemplate, setCurrentTemplate] = useState<Template>(PRESET_TEMPLATES[0]);
  const [elements, setElements] = useState<CanvasElement[]>(
    JSON.parse(JSON.stringify(DEFAULT_HACKATHON_ELEMENTS))
  );
  const [selectedElementId, setSelectedElementId] = useState<string>('name');

  // Participants & Roster state
  const [participants, setParticipants] = useState<Participant[]>(DEMO_PARTICIPANTS);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>(
    DEMO_PARTICIPANTS.map((p) => p.id)
  );
  const [activeParticipant, setActiveParticipant] = useState<Participant>(DEMO_PARTICIPANTS[0]);

  // Tab state: 'inspector' | 'participants' | 'templates'
  const [activeTab, setActiveTab] = useState<'inspector' | 'participants' | 'templates'>('inspector');

  // Column Mapping state
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    name: 'Student Name',
    college: 'College / University',
    eventTitle: 'Event Name',
    date: 'Date',
    rank: 'Rank / Award',
    certificateId: 'Certificate ID',
    email: 'Student Email',
  });

  // Modals state
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isMakeOpen, setIsMakeOpen] = useState(false);
  const [isBulkExportOpen, setIsBulkExportOpen] = useState(false);

  // Bulk export progress
  const [bulkProgress, setBulkProgress] = useState({
    current: 0,
    total: 0,
    isExporting: false,
    done: false,
  });

  const svgCanvasRef = useRef<SVGSVGElement | null>(null);

  // Synchronize dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle template selection
  const handleSelectTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setElements(JSON.parse(JSON.stringify(template.elements)));
  };

  // Handle custom background image upload
  const handleUploadCustomBg = (dataUrl: string) => {
    const customTpl: Template = {
      id: `custom-${Date.now()}`,
      name: 'Custom Branded Template',
      category: 'CUSTOM',
      description: 'Uploaded custom high-resolution certificate background.',
      themeColor: '#0f172a',
      accentColor: '#f59e0b',
      bgType: 'custom-image',
      bgImageUrl: dataUrl,
      elements: JSON.parse(JSON.stringify(elements)),
    };
    setCurrentTemplate(customTpl);
  };

  // Element actions
  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const handleUpdateElementPosition = (id: string, x: number, y: number) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  const handleDeleteElement = (id: string) => {
    if (elements.length <= 1) return;
    const remaining = elements.filter((el) => el.id !== id);
    setElements(remaining);
    setSelectedElementId(remaining[0].id);
  };

  const handleAddElement = () => {
    const newId = `field-${Date.now()}`;
    const newEl: CanvasElement = {
      id: newId,
      label: `Custom Field ${elements.length + 1}`,
      type: 'text',
      x: 50,
      y: 50,
      dataSource: 'custom',
      staticValue: 'NEW CERTIFICATE FIELD',
      fontFamily: 'Inter',
      fontWeight: '600',
      fontSize: 20,
      textAlign: 'center',
      textCase: 'none',
      color: '#ffffff',
      visible: true,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newId);
  };

  const handleResetElements = () => {
    setElements(JSON.parse(JSON.stringify(currentTemplate.elements)));
  };

  // Single certificate download
  const handleDownloadSinglePng = (participantToDownload: Participant = activeParticipant) => {
    if (!svgCanvasRef.current) return;
    const safeName = participantToDownload.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    exportToPng(svgCanvasRef.current, `Certificate_${safeName}.png`);
  };

  const handleDownloadSinglePdf = (participantToDownload: Participant = activeParticipant) => {
    if (!svgCanvasRef.current) return;
    const safeName = participantToDownload.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    exportToPdf(svgCanvasRef.current, `Certificate_${safeName}.pdf`);
  };

  // Bulk zip export
  const handleStartBulkExport = async (format: 'png' | 'pdf') => {
    const selectedList = participants.filter((p) =>
      selectedParticipantIds.includes(p.id)
    );
    if (selectedList.length === 0) {
      alert('Please select at least one student from the roster.');
      return;
    }

    setBulkProgress({
      current: 0,
      total: selectedList.length,
      isExporting: true,
      done: false,
    });

    try {
      await exportBulkZip(
        selectedList,
        async (participant) => {
          setActiveParticipant(participant);
          await new Promise((r) => setTimeout(r, 60));
          return svgCanvasRef.current as SVGSVGElement;
        },
        format,
        (current, total) => {
          setBulkProgress({ current, total, isExporting: true, done: false });
        }
      );

      setBulkProgress((prev) => ({ ...prev, isExporting: false, done: true }));
    } catch (err) {
      console.error('Error during bulk export:', err);
      alert('Failed during bulk export. Please check console.');
      setBulkProgress((prev) => ({ ...prev, isExporting: false }));
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return (
    <div className="h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        participantCount={selectedParticipantIds.length}
        onOpenVerifier={() => setIsVerifierOpen(true)}
        onOpenMake={() => setIsMakeOpen(true)}
        onOpenBulkExport={() => setIsBulkExportOpen(true)}
      />

      {/* Step Ribbon */}
      <WorkflowSteps
        templateName={currentTemplate.name}
        rosterCount={participants.length}
        activeStudentName={activeParticipant.name}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Studio Split-View Layout - Screen Fitted */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-3 sm:p-4 md:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 min-h-0 overflow-hidden">
        {/* Left Column: Inspector / Participants / Templates (5 cols on lg) */}
        <section className="lg:col-span-5 h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Studio Segmented Tabs Bar (Matches Video Layout) */}
          <div className="p-2 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 shrink-0">
            <div className="grid grid-cols-3 bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold gap-1">
              {/* Tab 1: Inspector */}
              <button
                onClick={() => setActiveTab('inspector')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'inspector'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Inspector</span>
              </button>

              {/* Tab 2: Participants */}
              <button
                onClick={() => setActiveTab('participants')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'participants'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Participants ({participants.length})</span>
              </button>

              {/* Tab 3: Templates */}
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition cursor-pointer ${
                  activeTab === 'templates'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>
            </div>
          </div>

          {/* Tab Content - Perfectly scrollable inside panel to fit screen */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {activeTab === 'inspector' && (
              <InspectorTab
                elements={elements}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onAddElement={handleAddElement}
                onResetElements={handleResetElements}
              />
            )}

            {activeTab === 'participants' && (
              <ParticipantsTab
                participants={participants}
                setParticipants={setParticipants}
                selectedParticipantIds={selectedParticipantIds}
                setSelectedParticipantIds={setSelectedParticipantIds}
                activeParticipant={activeParticipant}
                setActiveParticipant={setActiveParticipant}
                columnMapping={columnMapping}
                setColumnMapping={setColumnMapping}
                onDownloadSinglePng={(p) => {
                  setActiveParticipant(p);
                  setTimeout(() => handleDownloadSinglePng(p), 50);
                }}
                onDownloadSinglePdf={(p) => {
                  setActiveParticipant(p);
                  setTimeout(() => handleDownloadSinglePdf(p), 50);
                }}
              />
            )}

            {activeTab === 'templates' && (
              <TemplatesTab
                currentTemplate={currentTemplate}
                onSelectTemplate={handleSelectTemplate}
                onUploadCustomBg={handleUploadCustomBg}
              />
            )}
          </div>
        </section>

        {/* Right Column: Interactive Canvas & Production Dock (7 cols on lg) */}
        <section className="lg:col-span-7 h-full flex flex-col justify-between overflow-y-auto pr-1 space-y-3 sm:space-y-4">
          {/* Certificate Canvas */}
          <CertificateCanvas
            template={currentTemplate}
            elements={elements}
            participant={activeParticipant}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElementPosition={handleUpdateElementPosition}
            svgRef={svgCanvasRef}
          />

          {/* Canvas Footer & Export Controls */}
          <CanvasFooter
            activeParticipant={activeParticipant}
            selectedElementName={selectedElement?.label || 'Participant Name'}
            selectedCount={selectedParticipantIds.length}
            onDownloadPng={() => handleDownloadSinglePng(activeParticipant)}
            onDownloadPdf={() => handleDownloadSinglePdf(activeParticipant)}
            onDownloadBulkZip={() => setIsBulkExportOpen(true)}
          />
        </section>
      </main>

      {/* Modals */}
      <QRVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
        currentParticipant={activeParticipant}
        participants={participants}
      />

      <MakeAutomationModal
        isOpen={isMakeOpen}
        onClose={() => setIsMakeOpen(false)}
        activeParticipant={activeParticipant}
      />

      <BulkExportModal
        isOpen={isBulkExportOpen}
        onClose={() => {
          setIsBulkExportOpen(false);
          setBulkProgress({ current: 0, total: 0, isExporting: false, done: false });
        }}
        selectedCount={selectedParticipantIds.length}
        onStartBulkExport={handleStartBulkExport}
        progress={bulkProgress}
      />
    </div>
  );
}
export default App;
