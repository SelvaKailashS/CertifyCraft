import React, { useState, useEffect } from 'react';
import { Grid, Move } from 'lucide-react';
import type { CanvasElement, Participant, Template } from '../types';
import { SvgBackground } from '../templates/SvgBackgrounds';
import { generateQrDataUrl } from '../utils/exportUtils';

interface CertificateCanvasProps {
  template: Template;
  elements: CanvasElement[];
  participant: Participant;
  selectedElementId: string;
  onSelectElement: (id: string) => void;
  onUpdateElementPosition: (id: string, x: number, y: number) => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const CertificateCanvas: React.FC<CertificateCanvasProps> = ({
  template,
  elements,
  participant,
  selectedElementId,
  onSelectElement,
  onUpdateElementPosition,
  svgRef,
}) => {
  const [showGrid, setShowGrid] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'fit' | '75%' | '100%'>('fit');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Dragging state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ mouseX: number; mouseY: number; elX: number; elY: number } | null>(null);

  // Generate QR code data whenever participant or certificateId changes
  useEffect(() => {
    let isMounted = true;
    generateQrDataUrl(participant.certificateId, participant.name).then((url) => {
      if (isMounted) setQrDataUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [participant.certificateId, participant.name]);

  // Pointer move & up handlers for canvas drag
  const handlePointerDown = (e: React.PointerEvent, element: CanvasElement) => {
    e.stopPropagation();
    onSelectElement(element.id);
    setDraggingId(element.id);

    setDragStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      elX: element.x,
      elY: element.y,
    });
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !dragStartPos || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    const deltaXPixels = e.clientX - dragStartPos.mouseX;
    const deltaYPixels = e.clientY - dragStartPos.mouseY;

    // Convert pixel delta to percentage of svg box
    const deltaXPercent = (deltaXPixels / rect.width) * 100;
    const deltaYPercent = (deltaYPixels / rect.height) * 100;

    const newX = Math.max(0, Math.min(100, dragStartPos.elX + deltaXPercent));
    const newY = Math.max(0, Math.min(100, dragStartPos.elY + deltaYPercent));

    onUpdateElementPosition(draggingId, Math.round(newX * 10) / 10, Math.round(newY * 10) / 10);
  };

  const handlePointerUp = (_e: React.PointerEvent) => {
    if (draggingId) {
      setDraggingId(null);
      setDragStartPos(null);
    }
  };

  // Resolve dynamic values
  const resolveValue = (el: CanvasElement): string => {
    switch (el.dataSource) {
      case 'name':
        return participant.name;
      case 'college':
        return participant.college;
      case 'certificateId':
        return participant.certificateId;
      case 'eventTitle':
        return participant.eventTitle;
      case 'date':
        return participant.date;
      case 'rank':
        return participant.rank;
      case 'description':
        return participant.description || '';
      case 'header':
      case 'subtitle':
      case 'custom':
      default:
        return el.staticValue || '';
    }
  };

  // Zoom styles
  const getZoomStyle = () => {
    if (zoomLevel === '75%') return { maxWidth: '75%', margin: '0 auto' };
    if (zoomLevel === '100%') return { minWidth: '100%' };
    return { width: '100%' };
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-2 select-none">
      {/* Canvas Top Toolbar (Matches Video Header: 1920 x 1080 px | Drag any text... | Grid | Fit | 75% | 100%) */}
      <div className="flex items-center justify-between text-xs font-medium px-2 flex-wrap gap-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono font-bold text-xs border border-slate-200 dark:border-slate-700">
            1920 × 1080 px
          </span>
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-amber-500" />
            Drag any text directly on the canvas to reposition
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold transition cursor-pointer ${
              showGrid
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setZoomLevel('fit')}
              className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                zoomLevel === 'fit'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Fit
            </button>
            <button
              onClick={() => setZoomLevel('75%')}
              className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                zoomLevel === '75%'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              75%
            </button>
            <button
              onClick={() => setZoomLevel('100%')}
              className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                zoomLevel === '100%'
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              100%
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Frame Container */}
      <div className="relative flex-1 min-h-0 w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center p-2 sm:p-3 select-none">
        <div style={getZoomStyle()} className="transition-all duration-200 w-full max-h-full flex items-center justify-center">
          <div className="relative aspect-[16/9] w-full max-h-full max-w-full rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 1920 1080"
              className="w-full h-full block cursor-default"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Template Vector Background */}
              <SvgBackground
                templateId={template.id}
                customImageUrl={template.bgImageUrl}
              />

              {/* Alignment Grid Overlay if toggled */}
              {showGrid && (
                <g opacity="0.15" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4">
                  {/* Vertical grid lines */}
                  {Array.from({ length: 19 }).map((_, i) => (
                    <line key={`v-${i}`} x1={(i + 1) * 96} y1="0" x2={(i + 1) * 96} y2="1080" />
                  ))}
                  {/* Horizontal grid lines */}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={(i + 1) * 90} x2="1920" y2={(i + 1) * 90} />
                  ))}
                  {/* Center axes */}
                  <line x1="960" y1="0" x2="960" y2="1080" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="0" y1="540" x2="1920" y2="540" stroke="#f59e0b" strokeWidth="1.5" />
                </g>
              )}

              {/* Render Canvas Elements */}
              {elements
                .filter((el) => el.visible)
                .map((el) => {
                  const xPx = (el.x / 100) * 1920;
                  const yPx = (el.y / 100) * 1080;
                  const isSelected = selectedElementId === el.id;

                  // Text anchor
                  const textAnchor =
                    el.textAlign === 'center'
                      ? 'middle'
                      : el.textAlign === 'right'
                      ? 'end'
                      : 'start';

                  let displayValue = resolveValue(el);
                  if (el.textCase === 'uppercase') displayValue = displayValue.toUpperCase();
                  if (el.textCase === 'capitalize') {
                    displayValue = displayValue.replace(/\b\w/g, (c) => c.toUpperCase());
                  }

                  // Handle QR Code Element
                  if (el.type === 'qr') {
                    const qrSize = (el.fontSize || 64) * 1.5;
                    return (
                      <g
                        key={el.id}
                        transform={`translate(${xPx - qrSize / 2}, ${yPx - qrSize / 2})`}
                        onPointerDown={(e) => handlePointerDown(e, el)}
                        className="cursor-move group"
                      >
                        {/* Glow and frame */}
                        <rect
                          width={qrSize}
                          height={qrSize}
                          rx="8"
                          fill="#ffffff"
                          stroke={isSelected ? '#38bdf8' : '#e2e8f0'}
                          strokeWidth={isSelected ? '3' : '1'}
                          className="drop-shadow-md"
                        />
                        {qrDataUrl && (
                          <image
                            href={qrDataUrl}
                            width={qrSize - 8}
                            height={qrSize - 8}
                            x="4"
                            y="4"
                          />
                        )}

                        {/* Selection & coordinate tag */}
                        {isSelected && (
                          <g>
                            <rect
                              x="-6"
                              y="-6"
                              width={qrSize + 12}
                              height={qrSize + 12}
                              rx="10"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="2"
                              strokeDasharray="6 3"
                            />
                            {/* Floating coordinate badge */}
                            <g transform={`translate(${qrSize / 2}, -16)`}>
                              <rect
                                x="-45"
                                y="-12"
                                width="90"
                                height="22"
                                rx="4"
                                fill="#0284c7"
                              />
                              <text
                                textAnchor="middle"
                                y="3"
                                fill="#ffffff"
                                fontSize="12"
                                fontFamily="monospace"
                                fontWeight="bold"
                              >
                                {Math.round(el.x)}%, {Math.round(el.y)}%
                              </text>
                            </g>
                          </g>
                        )}
                      </g>
                    );
                  }

                  // Handle Signature Elements
                  if (el.type === 'signature') {
                    return (
                      <g
                        key={el.id}
                        transform={`translate(${xPx}, ${yPx})`}
                        onPointerDown={(e) => handlePointerDown(e, el)}
                        className="cursor-move group"
                      >
                        {/* Script signature representation */}
                        <text
                          y="-20"
                          textAnchor={textAnchor}
                          fill="#f8bf24"
                          fontFamily="Alex Brush, Great Vibes, cursive"
                          fontSize="36"
                          opacity="0.9"
                        >
                          {el.id === 'sig1' ? 'Dr. Sarah Mitchell' : 'Prof. Rajesh Khanna'}
                        </text>
                        {/* Label */}
                        <text
                          y="15"
                          textAnchor={textAnchor}
                          fill={el.color}
                          fontFamily={el.fontFamily}
                          fontWeight={el.fontWeight}
                          fontSize={el.fontSize}
                          letterSpacing="1.5"
                        >
                          {displayValue}
                        </text>

                        {/* Selection outline */}
                        {isSelected && (
                          <g>
                            <rect
                              x="-140"
                              y="-50"
                              width="280"
                              height="80"
                              rx="4"
                              fill="none"
                              stroke="#38bdf8"
                              strokeWidth="2"
                              strokeDasharray="6 3"
                            />
                          </g>
                        )}
                      </g>
                    );
                  }

                  // Standard Text Element
                  return (
                    <g
                      key={el.id}
                      transform={`translate(${xPx}, ${yPx})`}
                      onPointerDown={(e) => handlePointerDown(e, el)}
                      className="cursor-move group"
                    >
                      {/* Active Element Selection Box (Exact styling from video frame) */}
                      {isSelected && (
                        <g pointerEvents="none">
                          {/* Cyan highlight box */}
                          <rect
                            x={el.textAlign === 'center' ? '-320' : '-10'}
                            y={-(el.fontSize * 0.9)}
                            width={el.textAlign === 'center' ? '640' : '640'}
                            height={el.fontSize * 1.35}
                            rx="4"
                            fill="rgba(56, 189, 248, 0.08)"
                            stroke="#38bdf8"
                            strokeWidth="2"
                          />
                          {/* Corner points */}
                          <circle
                            cx={el.textAlign === 'center' ? '-320' : '-10'}
                            cy={-(el.fontSize * 0.9)}
                            r="4.5"
                            fill="#38bdf8"
                          />
                          <circle
                            cx={el.textAlign === 'center' ? '320' : '630'}
                            cy={-(el.fontSize * 0.9)}
                            r="4.5"
                            fill="#38bdf8"
                          />
                          <circle
                            cx={el.textAlign === 'center' ? '-320' : '-10'}
                            cy={el.fontSize * 0.45}
                            r="4.5"
                            fill="#38bdf8"
                          />
                          <circle
                            cx={el.textAlign === 'center' ? '320' : '630'}
                            cy={el.fontSize * 0.45}
                            r="4.5"
                            fill="#38bdf8"
                          />

                          {/* Live coordinate badge directly above (matches video: [+ 50%, 46%]) */}
                          <g transform={`translate(${el.textAlign === 'center' ? 0 : 40}, ${-(el.fontSize * 1.1)})`}>
                            <rect
                              x="-50"
                              y="-16"
                              width="100"
                              height="24"
                              rx="5"
                              fill="#0284c7"
                              stroke="#38bdf8"
                              strokeWidth="1"
                            />
                            {/* Move cross icon */}
                            <path
                              d="M-36,-4 L-36,4 M-40,0 L-32,0"
                              stroke="#ffffff"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <text
                              textAnchor="middle"
                              x="8"
                              y="1"
                              fill="#ffffff"
                              fontSize="12"
                              fontFamily="monospace"
                              fontWeight="bold"
                            >
                              {Math.round(el.x)}%, {Math.round(el.y)}%
                            </text>
                          </g>
                        </g>
                      )}

                      {/* Text SVG */}
                      <text
                        textAnchor={textAnchor}
                        fill={el.color}
                        fontFamily={el.fontFamily}
                        fontWeight={el.fontWeight}
                        fontSize={el.fontSize}
                        letterSpacing={el.id === 'header' ? '2' : 'normal'}
                        className="transition-colors drop-shadow-xs"
                      >
                        {displayValue}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
