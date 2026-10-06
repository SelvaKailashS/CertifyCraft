import { useState, useRef, useEffect } from 'react';
import {
  Moon,
  Sun,
  Layers,
  Image as ImageIcon,
  FileText,
  Palette,
  Eye,
} from 'lucide-react';
import { AutomationControlPanel } from './components/AutomationControlPanel';
import { CertificateCanvas } from './components/CertificateCanvas';
import { InspectorTab } from './components/InspectorTab';
import { TemplatesTab } from './components/TemplatesTab';
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

  // Studio Mode: 'canvas' | 'customize'
  const [studioMode, setStudioMode] = useState<'canvas' | 'customize'>('canvas');

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
  const handleUploadCustomBg = (dataUrl: string) => {
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
  };

  // Render SVG helper for automation
  const renderCurrentSvg = async (participant: Participant): Promise<SVGSVGElement> => {
    setActiveParticipant(participant);
    await new Promise((r) => setTimeout(r, 40));
    return svgCanvasRef.current as SVGSVGElement;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Streamlined Clean Header */}
      <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors px-4 sm:px-6 py-2.5">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-extrabold flex items-center justify-center tracking-tight shadow-md">
              CC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  CertifyCraft
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  n8n Automation Engine
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Automation Workspace */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Automation Engine & Upload (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <AutomationControlPanel
            participants={participants}
            setParticipants={setParticipants}
            activeParticipant={activeParticipant}
            setActiveParticipant={setActiveParticipant}
            columnMapping={columnMapping}
            setColumnMapping={setColumnMapping}
            renderCurrentSvg={renderCurrentSvg}
          />
        </div>

        {/* Right Column: Template Customization & Live Certificate Preview (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Studio Navigation & Export Bar */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setStudioMode('canvas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  studioMode === 'canvas'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                <span>Canvas View</span>
              </button>
              <button
                onClick={() => setStudioMode('customize')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  studioMode === 'customize'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-amber-500" />
                <span>Customize Template & Text</span>
              </button>
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
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-red-600 dark:text-red-400 transition cursor-pointer"
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
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 transition cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>PNG</span>
              </button>
            </div>
          </div>

          {/* Template Bar (Visible in Canvas View) */}
          {studioMode === 'canvas' && (
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Preset Design:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
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
          )}

          {/* Customization Drawer / Inspector (Visible in Customize Mode) */}
          {studioMode === 'customize' && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              {/* Template background & custom upload */}
              <TemplatesTab
                currentTemplate={currentTemplate}
                onSelectTemplate={handleSelectTemplate}
                onUploadCustomBg={handleUploadCustomBg}
              />

              <hr className="border-slate-200 dark:border-slate-800" />

              {/* Elements Inspector */}
              <InspectorTab
                elements={elements}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onAddElement={handleAddElement}
                onResetElements={handleResetElements}
              />
            </div>
          )}

          {/* Interactive Certificate Canvas */}
          <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs px-1 text-slate-600 dark:text-slate-400">
              <div>
                <span>Previewing: </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {activeParticipant.name}
                </span>{' '}
                <span>({activeParticipant.email})</span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Drag any text directly on canvas to reposition
              </span>
            </div>

            {/* Canvas */}
            <CertificateCanvas
              template={currentTemplate}
              elements={elements}
              participant={activeParticipant}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onUpdateElementPosition={handleUpdateElementPosition}
              svgRef={svgCanvasRef}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
