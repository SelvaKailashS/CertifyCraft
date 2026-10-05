import React from 'react';

interface SvgBackgroundProps {
  templateId: string;
  customImageUrl?: string;
}

export const SvgBackground: React.FC<SvgBackgroundProps> = ({ templateId, customImageUrl }) => {
  if (customImageUrl) {
    return (
      <image
        href={customImageUrl}
        x="0"
        y="0"
        width="1920"
        height="1080"
        preserveAspectRatio="xMidYMid slice"
      />
    );
  }

  switch (templateId) {
    case 'athletic-sports':
      return (
        <g>
          <defs>
            <linearGradient id="sports-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e0303" />
              <stop offset="40%" stopColor="#450a0a" />
              <stop offset="100%" stopColor="#140202" />
            </linearGradient>
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#sports-bg)" />
          {/* Borders */}
          <rect x="50" y="50" width="1820" height="980" fill="none" stroke="url(#gold-grad)" strokeWidth="4" rx="12" />
          <rect x="70" y="70" width="1780" height="940" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="10 5" rx="8" />
          <rect x="90" y="90" width="1740" height="900" fill="none" stroke="rgba(234, 179, 8, 0.25)" strokeWidth="1" rx="6" />

          {/* Corner Ornaments */}
          {[[70, 70], [1850, 70], [70, 1010], [1850, 1010]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="8" fill="url(#gold-grad)" />
          ))}

          {/* Top Laurel & Trophy Crest */}
          <g transform="translate(960, 120)">
            <circle cx="0" cy="0" r="42" fill="#2d0606" stroke="url(#gold-grad)" strokeWidth="3" />
            {/* Laurel Wreath */}
            <path
              d="M-30,-5 C-32,15 -18,30 0,34 C18,30 32,15 30,-5 C26,5 15,18 0,20 C-15,18 -26,5 -30,-5 Z"
              fill="url(#gold-grad)"
              opacity="0.9"
            />
            {/* Star */}
            <polygon points="0,-18 5,-6 18,-6 8,2 12,14 0,7 -12,14 -8,2 -18,-6 -5,-6" fill="url(#gold-grad)" />
          </g>
          {/* Subtle divider lines */}
          <line x1="300" y1="910" x2="600" y2="910" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1.5" />
          <line x1="1320" y1="910" x2="1620" y2="910" stroke="rgba(234, 179, 8, 0.4)" strokeWidth="1.5" />
        </g>
      );

    case 'tech-workshop':
      return (
        <g>
          <defs>
            <linearGradient id="tech-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#021c16" />
              <stop offset="50%" stopColor="#042f26" />
              <stop offset="100%" stopColor="#011410" />
            </linearGradient>
            <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#tech-bg)" />
          {/* Sleek executive modern borders */}
          <rect x="55" y="55" width="1810" height="970" fill="none" stroke="url(#emerald-grad)" strokeWidth="3" rx="10" />
          <rect x="75" y="75" width="1770" height="930" fill="none" stroke="rgba(52, 211, 153, 0.3)" strokeWidth="1" rx="8" />

          {/* Geometric Guilloche Patterns */}
          <circle cx="960" cy="540" r="480" fill="none" stroke="rgba(52, 211, 153, 0.03)" strokeWidth="1" />
          <circle cx="960" cy="540" r="420" fill="none" stroke="rgba(52, 211, 153, 0.04)" strokeWidth="1" strokeDasharray="6 6" />

          {/* Top modern conference prism crest */}
          <g transform="translate(960, 120)">
            <polygon points="0,-36 32,-16 32,20 0,38 -32,20 -32,-16" fill="#03251e" stroke="url(#emerald-grad)" strokeWidth="2.5" />
            <polygon points="0,-22 20,-10 20,12 0,24 -20,12 -20,-10" fill="none" stroke="url(#emerald-grad)" strokeWidth="1.5" />
            <circle cx="0" cy="1" r="5" fill="#34d399" />
          </g>

          {/* Signature lines */}
          <line x1="300" y1="910" x2="600" y2="910" stroke="rgba(52, 211, 153, 0.35)" strokeWidth="1.5" />
          <line x1="1320" y1="910" x2="1620" y2="910" stroke="rgba(52, 211, 153, 0.35)" strokeWidth="1.5" />
        </g>
      );

    case 'collegiate-honor':
      return (
        <g>
          <defs>
            <linearGradient id="academic-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1c1917" />
              <stop offset="50%" stopColor="#292524" />
              <stop offset="100%" stopColor="#141210" />
            </linearGradient>
            <linearGradient id="bronze-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#academic-bg)" />
          {/* Double vintage diploma borders */}
          <rect x="50" y="50" width="1820" height="980" fill="none" stroke="url(#bronze-grad)" strokeWidth="4" />
          <rect x="66" y="66" width="1788" height="948" fill="none" stroke="#78350f" strokeWidth="1" />
          <rect x="80" y="80" width="1760" height="920" fill="none" stroke="url(#bronze-grad)" strokeWidth="2" strokeDasharray="12 4" />

          {/* Vintage Flourish Corners */}
          <path d="M 90 140 L 90 90 L 140 90" fill="none" stroke="url(#bronze-grad)" strokeWidth="3" />
          <path d="M 1830 140 L 1830 90 L 1780 90" fill="none" stroke="url(#bronze-grad)" strokeWidth="3" />
          <path d="M 90 940 L 90 990 L 140 990" fill="none" stroke="url(#bronze-grad)" strokeWidth="3" />
          <path d="M 1830 940 L 1830 990 L 1780 990" fill="none" stroke="url(#bronze-grad)" strokeWidth="3" />

          {/* Top Academic University Seal */}
          <g transform="translate(960, 120)">
            <circle cx="0" cy="0" r="44" fill="#1c1917" stroke="url(#bronze-grad)" strokeWidth="3" />
            <circle cx="0" cy="0" r="36" fill="none" stroke="#b45309" strokeWidth="1" strokeDasharray="4 2" />
            {/* Book / Torch Icon */}
            <path d="M -16,4 C -8,0 0,6 0,6 C 0,6 8,0 16,4 L 16,-12 C 8,-16 0,-10 0,-10 C 0,-10 -8,-16 -16,-12 Z" fill="url(#bronze-grad)" />
            <polygon points="0,-22 4,-14 -4,-14" fill="#fbbf24" />
          </g>

          {/* Signature lines */}
          <line x1="300" y1="910" x2="600" y2="910" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5" />
          <line x1="1320" y1="910" x2="1620" y2="910" stroke="rgba(217, 119, 6, 0.4)" strokeWidth="1.5" />
        </g>
      );

    case 'codesprint-hackathon':
    default:
      return (
        <g>
          <defs>
            <linearGradient id="hkt-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#080e1e" />
              <stop offset="50%" stopColor="#0c152c" />
              <stop offset="100%" stopColor="#060914" />
            </linearGradient>
            <linearGradient id="neon-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="gold-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Background Canvas */}
          <rect width="1920" height="1080" fill="url(#hkt-bg)" />

          {/* Cyber grid lines in corners */}
          <g opacity="0.1" stroke="#38bdf8" strokeWidth="1">
            <line x1="100" y1="100" x2="400" y2="100" />
            <line x1="100" y1="140" x2="350" y2="140" />
            <line x1="100" y1="180" x2="300" y2="180" />
            <line x1="1520" y1="100" x2="1820" y2="100" />
            <line x1="1570" y1="140" x2="1820" y2="140" />
            <line x1="1620" y1="180" x2="1820" y2="180" />
          </g>

          {/* Outer Border with Neon Bracket Corners (Exact match to video) */}
          <rect x="60" y="60" width="1800" height="960" fill="none" stroke="#1e293b" strokeWidth="2" rx="4" />
          <rect x="80" y="80" width="1760" height="920" fill="none" stroke="#0369a1" strokeWidth="1.5" opacity="0.6" />

          {/* Cyan Corner Brackets */}
          {/* Top-Left */}
          <path d="M 75 140 L 75 75 L 140 75" fill="none" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="140" cy="75" r="3.5" fill="#38bdf8" />
          <circle cx="75" cy="140" r="3.5" fill="#38bdf8" />

          {/* Top-Right */}
          <path d="M 1845 140 L 1845 75 L 1780 75" fill="none" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="1780" cy="75" r="3.5" fill="#38bdf8" />
          <circle cx="1845" cy="140" r="3.5" fill="#38bdf8" />

          {/* Bottom-Left */}
          <path d="M 75 940 L 75 1005 L 140 1005" fill="none" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="140" cy="1005" r="3.5" fill="#38bdf8" />
          <circle cx="75" cy="940" r="3.5" fill="#38bdf8" />

          {/* Bottom-Right */}
          <path d="M 1845 940 L 1845 1005 L 1780 1005" fill="none" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="1780" cy="1005" r="3.5" fill="#38bdf8" />
          <circle cx="1845" cy="940" r="3.5" fill="#38bdf8" />

          {/* Top Hexagon Emblem (Matching video frame) */}
          <g transform="translate(960, 140)">
            <polygon
              points="0,-36 34,-18 34,18 0,36 -34,18 -34,-18"
              fill="#0a142c"
              stroke="#0284c7"
              strokeWidth="2.5"
            />
            <polygon
              points="0,-24 23,-12 23,12 0,24 -23,12 -23,-12"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            {/* Tech Up-Arrow / Diamond icon */}
            <path
              d="M-10,4 L0,-8 L10,4 M0,-8 L0,12"
              fill="none"
              stroke="url(#gold-glow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Signature lines */}
          <line x1="300" y1="910" x2="600" y2="910" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />
          <line x1="1320" y1="910" x2="1620" y2="910" stroke="rgba(148, 163, 184, 0.4)" strokeWidth="1.5" />
        </g>
      );
  }
};
