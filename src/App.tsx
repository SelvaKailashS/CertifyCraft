import { useState, useRef, useEffect } from 'react';
import {
  Moon,
  Sun,
  Layers,
  Image as ImageIcon,
  FileText,
  Palette,
  Server,
  Upload,
} from 'lucide-react';
import { AutomationControlPanel } from './components/AutomationControlPanel';
import { CertificateCanvas } from './components/CertificateCanvas';
import { InspectorTab } from './components/InspectorTab';
import { DEMO_PARTICIPANTS } from './data/mockData';
import { PRESET_TEMPLATES, DEFAULT_HACKATHON_ELEMENTS } from './templates/presets';
import type { Template, Participant, CanvasElement, ColumnMapping } from './types';
import { exportToPdf, exportToPng } from './utils/exportUtils';

export function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Active template & elements
  const [currentTemplate, setCurrentTemplate] = useState<Template>(PRESET_TEMPLATES[0]);
  const [elements, setElements] = useState<CanvasElement[]>(
    JSON.parse(JSON.stringify(DEFAULT_HACKATHON_ELEMENTS))
  );
  const [selectedElementId, setSelectedElementId] = useState<string>('name');

  // Left sidebar active tab: 'customize' | 'automation'
  const [leftTab, setLeftTab] = useState<'customize' | 'automation'>('customize');

  // Participants roster
  const [participants, setParticipants] = useState<Participant[]>(DEMO_PARTICIPANTS);
  const [activeParticipant, setActiveParticipant] = useState<Participant>(DEMO_PARTICIPANTS[0]);

  // Column mapping
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    name: 'Student Name',
    college: 'College / University',
    eventTitle: 'Event Name',
    date: 'Date',
    rank: 'Rank / Award',
    certificateId: 'Certificate ID',
    email: 'Student Email',
  });

  const svgCanvasRef = useRef<SVGSVGElement | null>(null);
  const customBgInputRef = useRef<HTMLInputElement>(null);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Change template
  const handleSelectTemplate = (tpl: Template) => {
    setCurrentTemplate(tpl);
    setElements(JSON.parse(JSON.stringify(tpl.elements)));
  };

  // Drag position update
  const handleUpdateElementPosition = (id: string, x: number, y: number) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, x, y } : el)));
  };

  // Element property update from Inspector
  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  // Delete an element
  const handleDeleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  // Add custom text field
  const handleAddElement = () => {
    const newEl: CanvasElement = {
      id: `custom-${Date.now()}`,
      label: 'Custom Field',
      type: 'text',
      dataSource: 'custom',
      staticValue: 'Custom Title',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: 'Inter',
      fontWeight: '600',
      color: '#0f172a',
      textAlign: 'center',
      textCase: 'none',
      visible: true,
    };
    setElements((prev) => [...prev, newEl]);
    setSelectedElementId(newEl.id);
  };

  // Reset elements to template default
  const handleResetElements = () => {
    setElements(JSON.parse(JSON.stringify(currentTemplate.elements)));
  };

  // Upload custom background
  const handleUploadCustomBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      if (dataUrl) {
        const customTpl: Template = {
          id: `custom-${Date.now()}`,
          name: 'Custom Branded Certificate',
          category: 'CUSTOM',
          description: 'Custom background template',
          themeColor: '#0f172a',
          accentColor: '#f59e0b',
          bgType: 'custom-image',
          bgImageUrl: dataUrl,
          elements: elements,
        };
        setCurrentTemplate(customTpl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Render SVG helper for automation
  const renderCurrentSvg = async (participant: Participant): Promise<SVGSVGElement> => {
    setActiveParticipant(participant);
    await new Promise((r) => setTimeout(r, 40));
    return svgCanvasRef.current as SVGSVGElement;
  };

  return (
    <div className="h-screen max-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      {/* Streamlined Clean Header */}
      <header className="flex-shrink-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 px-4 sm:px-6 py-2">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-extrabold flex items-center justify-center tracking-tight shadow-md">
              CC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  CertifyCraft
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  n8n Automation Engine
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio: LEFT = Scrollable Controls/Customize/Automation, RIGHT = Fixed Live Canvas */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-2.5 sm:p-3.5 grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch overflow-hidden min-h-0">
        {/* LEFT COLUMN: Scrollable Panel for Controls */}
        <div className="lg:col-span-5 h-full overflow-y-auto pr-1.5 space-y-3 custom-scrollbar min-h-0">
          {/* Main Left Tab Switcher */}
          <div className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-1 text-xs font-bold sticky top-0 z-20">
            <button
              onClick={() => setLeftTab('customize')}
              className={`flex-1 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                leftTab === 'customize'
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>🎨 Customize Template & Text</span>
            </button>
            <button
              onClick={() => setLeftTab('automation')}
              className={`flex-1 py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                leftTab === 'automation'
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>🚀 Bulk Email Automation</span>
            </button>
          </div>

          {/* TAB 1: CUSTOMIZE TEMPLATE & TEXT (ON THE LEFT) */}
          {leftTab === 'customize' && (
            <div className="space-y-4">
              {/* Preset Design & Custom Upload Card */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Layers className="w-4 h-4 text-emerald-500" />
                    <span>Choose Template Design:</span>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={customBgInputRef}
                      onChange={handleUploadCustomBg}
                      accept="image/*,.svg"
                      className="hidden"
                    />
                    <button
                      onClick={() => customBgInputRef.current?.click()}
                      className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Upload Custom BG</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        currentTemplate.id === tpl.id
                          ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Elements & Text Inspector Card */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <InspectorTab
                  elements={elements}
                  selectedElementId={selectedElementId}
                  onSelectElement={setSelectedElementId}
                  onUpdateElement={handleUpdateElement}
                  onDeleteElement={handleDeleteElement}
                  onAddElement={handleAddElement}
                  onResetElements={handleResetElements}
                  participant={activeParticipant}
                  onUpdateParticipant={(updates) =>
                    setActiveParticipant((prev) => ({ ...prev, ...updates }))
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 2: AUTOMATION & SPREADSHEET DISPATCHER */}
          {leftTab === 'automation' && (
            <AutomationControlPanel
              participants={participants}
              setParticipants={setParticipants}
              activeParticipant={activeParticipant}
              setActiveParticipant={setActiveParticipant}
              columnMapping={columnMapping}
              setColumnMapping={setColumnMapping}
              renderCurrentSvg={renderCurrentSvg}
            />
          )}
        </div>

        {/* RIGHT COLUMN: LIVE CERTIFICATE PREVIEW CANVAS (FITS SCREEN) */}
        <div className="lg:col-span-7 h-full flex flex-col space-y-2 overflow-hidden min-h-0">
          {/* Top Canvas Bar */}
          <div className="flex-shrink-0 p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Live Preview: </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {activeParticipant.name}
              </span>{' '}
              <span className="text-xs text-slate-400">({activeParticipant.college})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (svgCanvasRef.current) {
                    exportToPdf(
                      svgCanvasRef.current,
                      `Certificate_${activeParticipant.name}.pdf`
                    );
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Sample PDF</span>
              </button>
              <button
                onClick={() => {
                  if (svgCanvasRef.current) {
                    exportToPng(
                      svgCanvasRef.current,
                      `Certificate_${activeParticipant.name}.png`
                    );
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 transition cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>PNG</span>
              </button>
            </div>
          </div>

          {/* Interactive Certificate Canvas Card */}
          <div className="flex-1 min-h-0 flex flex-col p-2 sm:p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="flex-shrink-0 text-[11px] text-slate-400 pb-1 px-1 flex items-center justify-between">
              <span>💡 Tip: Click any text on the canvas to edit its font, size, or color on the left.</span>
              <span className="hidden sm:inline">Drag directly to reposition</span>
            </div>

            {/* Canvas */}
            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
              <CertificateCanvas
                template={currentTemplate}
                elements={elements}
                participant={activeParticipant}
                selectedElementId={selectedElementId}
                onSelectElement={(id) => {
                  setSelectedElementId(id);
                  setLeftTab('customize');
                }}
                onUpdateElementPosition={handleUpdateElementPosition}
                svgRef={svgCanvasRef}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
