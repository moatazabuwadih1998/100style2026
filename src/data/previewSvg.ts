/**
 * Dynamic SVG preview generator for the 100 Art Styles
 * Produces crisp, styled vector previews for each art style
 */

interface StylePreviewConfig {
  id: string;
  nameEn: string;
  nameAr: string;
  bgGradient: [string, string, string];
  accentColor: string;
  secondaryColor: string;
  motifType: 'cel' | 'cyberpunk' | 'shojo' | 'noir' | 'ghibli' | 'shonen' | 'mecha' | 'manga_ink' | 'pixel' | 'fantasy_oil' | 'souls' | 'chibi' | 'vinyl' | 'stained_glass' | 'halftone' | 'arcane' | 'realistic_portrait' | 'western_cartoon';
  tags: string[];
}

export function generateStyleSvg(styleId: string, styleNameAr: string, styleNameEn: string, palette: string[]): string {
  const p1 = palette[0] || '#4f46e5';
  const p2 = palette[1] || '#06b6d4';
  const p3 = palette[2] || '#f59e0b';
  const p4 = palette[3] || '#ec4899';

  // Determine motif from styleId or groupId
  const groupId = styleId.split('-')[0] || 'g01';
  const styleNum = parseInt(styleId.split('-')[1]?.replace('s', '') || '1', 10);

  let visualElements = '';

  // Tailored motifs based on style group and number
  if (groupId === 'g01') {
    // Classic & Vintage
    if (styleId === 'g01-s02') { // 80s Cyberpunk
      visualElements = `
        <line x1="0" y1="200" x2="400" y2="200" stroke="${p2}" stroke-width="2" opacity="0.6"/>
        <path d="M 50 400 L 200 200 L 350 400" fill="none" stroke="${p1}" stroke-width="2" opacity="0.5"/>
        <circle cx="200" cy="180" r="70" fill="url(#sunGrad)" opacity="0.9"/>
        <path d="M 120 280 L 200 150 L 280 280 Z" fill="${p3}" opacity="0.3"/>
        <rect x="140" y="240" width="120" height="15" fill="${p4}" rx="4"/>
        <rect x="160" y="265" width="80" height="8" fill="${p2}" rx="2"/>
        <line x1="20" y1="120" x2="380" y2="120" stroke="#ff007f" stroke-width="1.5" stroke-dasharray="10 5" opacity="0.4"/>
      `;
    } else if (styleId === 'g01-s03') { // 90s Shojo
      visualElements = `
        <circle cx="200" cy="190" r="85" fill="${p2}" opacity="0.3"/>
        <polygon points="200,80 207,105 230,105 212,120 218,145 200,130 182,145 188,120 170,105 193,105" fill="${p3}"/>
        <polygon points="110,140 114,155 128,155 117,164 121,178 110,169 99,178 103,164 92,155 106,155" fill="${p4}" opacity="0.8"/>
        <polygon points="290,160 294,175 308,175 297,184 301,198 290,189 279,198 283,184 272,175 286,175" fill="${p1}" opacity="0.8"/>
        <circle cx="170" cy="180" r="24" fill="#ffffff" opacity="0.85"/>
        <circle cx="230" cy="180" r="24" fill="#ffffff" opacity="0.85"/>
        <circle cx="165" cy="175" r="10" fill="${p1}"/>
        <circle cx="225" cy="175" r="10" fill="${p1}"/>
        <circle cx="173" cy="170" r="4" fill="#ffffff"/>
        <circle cx="233" cy="170" r="4" fill="#ffffff"/>
      `;
    } else if (styleId === 'g01-s05') { // Studio Ghibli
      visualElements = `
        <path d="M 0 280 Q 100 240 200 270 T 400 260 L 400 400 L 0 400 Z" fill="${p1}" opacity="0.7"/>
        <path d="M 0 320 Q 120 290 250 320 T 400 310 L 400 400 L 0 400 Z" fill="${p2}" opacity="0.8"/>
        <circle cx="280" cy="120" r="45" fill="${p3}" opacity="0.85"/>
        <path d="M 80 150 Q 120 120 160 150 Q 200 130 220 160 L 60 160 Z" fill="#ffffff" opacity="0.9"/>
        <path d="M 240 180 Q 280 150 320 170 Q 360 160 380 185 L 220 185 Z" fill="#ffffff" opacity="0.8"/>
        <circle cx="180" cy="270" r="16" fill="${p4}" opacity="0.9"/>
      `;
    } else { // Classic Cel & Mecha
      visualElements = `
        <rect x="70" y="70" width="260" height="260" rx="16" fill="none" stroke="${p2}" stroke-width="4" opacity="0.6"/>
        <circle cx="200" cy="190" r="70" fill="${p1}" opacity="0.5"/>
        <path d="M 160 170 L 200 120 L 240 170 L 220 230 L 180 230 Z" fill="${p3}" opacity="0.85"/>
        <line x1="140" y1="270" x2="260" y2="270" stroke="${p4}" stroke-width="4" stroke-linecap="round"/>
        <line x1="170" y1="290" x2="230" y2="290" stroke="${p2}" stroke-width="3" stroke-linecap="round"/>
      `;
    }
  } else if (groupId === 'g02') {
    // Modern & Contemporary
    visualElements = `
      <polygon points="200,60 230,140 315,145 250,200 270,285 200,235 130,285 150,200 85,145 170,140" fill="${p1}" opacity="0.45"/>
      <circle cx="200" cy="180" r="65" fill="${p2}" opacity="0.3"/>
      <path d="M 140 150 L 260 210 M 140 210 L 260 150" stroke="${p3}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="200" cy="180" r="28" fill="${p4}" opacity="0.9"/>
      <circle cx="200" cy="180" r="12" fill="#ffffff"/>
      <line x1="40" y1="330" x2="360" y2="330" stroke="${p2}" stroke-width="3" opacity="0.6"/>
    `;
  } else if (groupId === 'g03') {
    // Manga, Webtoon & Comic Arts
    visualElements = `
      <pattern id="screentone-${styleId}" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="${p1}" opacity="0.7"/>
      </pattern>
      <rect x="40" y="50" width="320" height="270" fill="url(#screentone-${styleId})" stroke="${p1}" stroke-width="3"/>
      <path d="M 120 80 L 280 80 L 310 280 L 90 280 Z" fill="#111827" stroke="${p2}" stroke-width="4"/>
      <line x1="150" y1="130" x2="250" y2="230" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
      <line x1="250" y1="130" x2="150" y2="230" stroke="${p3}" stroke-width="4" stroke-linecap="round"/>
      <path d="M 70 60 L 140 100 L 110 130 Z" fill="${p4}"/>
      <text x="200" y="305" font-family="'Cairo', sans-serif" font-weight="bold" font-size="20" fill="${p2}" text-anchor="middle">MANGA INK</text>
    `;
  } else if (groupId === 'g04') {
    // Video Game Arts
    visualElements = `
      <rect x="90" y="90" width="220" height="220" rx="30" fill="${p1}" opacity="0.35" transform="rotate(15 200 200)"/>
      <rect x="90" y="90" width="220" height="220" rx="30" fill="none" stroke="${p2}" stroke-width="5" transform="rotate(-10 200 200)"/>
      <polygon points="200,110 260,230 140,230" fill="${p3}" opacity="0.8"/>
      <circle cx="200" cy="190" r="25" fill="${p4}"/>
      <polygon points="185,175 220,190 185,205" fill="#ffffff"/>
      <path d="M 130 280 L 270 280" stroke="${p2}" stroke-width="5" stroke-linecap="round"/>
    `;
  } else if (groupId === 'g05') {
    // Pixel Art
    visualElements = `
      <g fill="${p1}" opacity="0.9">
        <rect x="120" y="100" width="25" height="25"/>
        <rect x="145" y="100" width="25" height="25"/>
        <rect x="170" y="100" width="25" height="25"/>
        <rect x="195" y="100" width="25" height="25"/>
        <rect x="220" y="100" width="25" height="25"/>
        <rect x="245" y="100" width="25" height="25"/>
      </g>
      <g fill="${p2}">
        <rect x="95" y="125" width="25" height="25"/>
        <rect x="270" y="125" width="25" height="25"/>
        <rect x="120" y="150" width="40" height="25" fill="#ffffff"/>
        <rect x="230" y="150" width="40" height="25" fill="#ffffff"/>
        <rect x="140" y="155" width="15" height="15" fill="#000000"/>
        <rect x="240" y="155" width="15" height="15" fill="#000000"/>
      </g>
      <g fill="${p3}">
        <rect x="145" y="200" width="100" height="25"/>
        <rect x="120" y="225" width="150" height="35"/>
      </g>
      <g fill="${p4}">
        <rect x="95" y="260" width="200" height="30"/>
        <rect x="145" y="290" width="40" height="30"/>
        <rect x="205" y="290" width="40" height="30"/>
      </g>
    `;
  } else if (groupId === 'g06') {
    // Concept Art & Fantasy
    visualElements = `
      <path d="M 50 350 L 150 160 L 250 290 L 350 140 L 400 350 Z" fill="${p1}" opacity="0.6"/>
      <circle cx="200" cy="130" r="50" fill="${p3}" opacity="0.85"/>
      <path d="M 120 280 L 200 190 L 280 280 Z" fill="${p2}" opacity="0.9"/>
      <line x1="200" y1="190" x2="200" y2="350" stroke="${p4}" stroke-width="4"/>
      <circle cx="200" cy="180" r="14" fill="#ffffff"/>
    `;
  } else if (groupId === 'g07') {
    // Chibi & Cute
    visualElements = `
      <circle cx="200" cy="170" r="85" fill="${p2}" opacity="0.85"/>
      <circle cx="160" cy="165" r="25" fill="#ffffff"/>
      <circle cx="240" cy="165" r="25" fill="#ffffff"/>
      <circle cx="165" cy="165" r="15" fill="${p1}"/>
      <circle cx="235" cy="165" r="15" fill="${p1}"/>
      <circle cx="170" cy="160" r="6" fill="#ffffff"/>
      <circle cx="230" cy="160" r="6" fill="#ffffff"/>
      <ellipse cx="140" cy="195" rx="14" ry="8" fill="${p4}" opacity="0.6"/>
      <ellipse cx="260" cy="195" rx="14" ry="8" fill="${p4}" opacity="0.6"/>
      <path d="M 185 200 Q 200 215 215 200" stroke="#1f2937" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M 160 255 C 160 280, 240 280, 240 255 Z" fill="${p3}"/>
    `;
  } else if (groupId === 'g08') {
    // Experimental & Avant-Garde
    visualElements = `
      <polygon points="200,40 330,120 330,270 200,350 70,270 70,120" stroke="${p2}" stroke-width="5" fill="none"/>
      <polygon points="200,90 280,140 280,240 200,290 120,240 120,140" fill="${p1}" opacity="0.4"/>
      <line x1="200" y1="40" x2="200" y2="350" stroke="${p3}" stroke-width="3"/>
      <line x1="70" y1="120" x2="330" y2="270" stroke="${p4}" stroke-width="2"/>
      <line x1="70" y1="270" x2="330" y2="120" stroke="${p2}" stroke-width="2"/>
      <circle cx="200" cy="195" r="30" fill="${p3}" opacity="0.9"/>
      <circle cx="200" cy="195" r="10" fill="#ffffff"/>
    `;
  } else if (groupId === 'g09') {
    // Realistic & Semi-Realistic
    visualElements = `
      <defs>
        <radialGradient id="faceGlow-${styleId}" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stop-color="${p3}" stop-opacity="0.9"/>
          <stop offset="60%" stop-color="${p1}" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#020617" stop-opacity="0.9"/>
        </radialGradient>
      </defs>
      <circle cx="200" cy="180" r="95" fill="url(#faceGlow-${styleId})"/>
      <path d="M 155 165 Q 200 155 245 165" stroke="${p2}" stroke-width="3" fill="none"/>
      <circle cx="170" cy="175" r="12" fill="#ffffff" opacity="0.8"/>
      <circle cx="230" cy="175" r="12" fill="#ffffff" opacity="0.8"/>
      <circle cx="172" cy="175" r="6" fill="${p4}"/>
      <circle cx="228" cy="175" r="6" fill="${p4}"/>
      <path d="M 200 175 L 195 210 L 205 210" stroke="${p2}" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M 180 235 Q 200 245 220 235" stroke="${p3}" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      <path d="M 120 290 Q 200 270 280 290 L 300 370 L 100 370 Z" fill="${p1}" opacity="0.7"/>
    `;
  } else {
    // g10: Western Animation & American Cartoon
    visualElements = `
      <path d="M 130 110 C 120 50, 280 50, 270 110 C 330 160, 310 270, 270 280 C 230 330, 170 330, 130 280 C 90 270, 70 160, 130 110 Z" fill="${p1}" opacity="0.75"/>
      <ellipse cx="165" cy="160" rx="22" ry="32" fill="#ffffff"/>
      <ellipse cx="235" cy="160" rx="22" ry="32" fill="#ffffff"/>
      <circle cx="172" cy="162" r="10" fill="#0f172a"/>
      <circle cx="228" cy="162" r="10" fill="#0f172a"/>
      <circle cx="175" cy="158" r="3" fill="#ffffff"/>
      <circle cx="225" cy="158" r="3" fill="#ffffff"/>
      <path d="M 150 220 Q 200 260 250 220" stroke="#0f172a" stroke-width="6" stroke-linecap="round" fill="${p3}"/>
      <path d="M 175 235 Q 200 250 225 235" fill="${p4}"/>
    `;
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad-${styleId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#030712"/>
    </linearGradient>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${p3}"/>
      <stop offset="100%" stop-color="${p4}"/>
    </linearGradient>
    <radialGradient id="centerGlow-${styleId}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${p1}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${p1}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="400" height="400" fill="url(#bgGrad-${styleId})"/>
  <circle cx="200" cy="200" r="180" fill="url(#centerGlow-${styleId})"/>

  <!-- Grid Accents -->
  <g stroke="#334155" stroke-width="0.5" opacity="0.3">
    <line x1="40" y1="0" x2="40" y2="400"/>
    <line x1="360" y1="0" x2="360" y2="400"/>
    <line x1="0" y1="40" x2="400" y2="400"/>
    <line x1="0" y1="360" x2="400" y2="360"/>
  </g>

  <!-- Visual Stylistic Elements -->
  ${visualElements}

  <!-- Header Badge: Style ID & Arabic Label -->
  <rect x="20" y="20" width="70" height="26" rx="6" fill="#1e293b" fill-opacity="0.85" stroke="${p2}" stroke-width="1"/>
  <text x="55" y="37" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="bold" fill="${p2}" text-anchor="middle">${styleId.toUpperCase()}</text>

  <!-- Group Tag Badge -->
  <rect x="270" y="20" width="110" height="26" rx="6" fill="#1e293b" fill-opacity="0.85" stroke="#475569" stroke-width="0.8"/>
  <text x="325" y="37" font-family="'Cairo', sans-serif" font-size="11" font-weight="600" fill="#94a3b8" text-anchor="middle">المجموعة ${styleNum}/10</text>

  <!-- Bottom Gradient Overlay & Title -->
  <rect x="0" y="300" width="400" height="100" fill="url(#bottomFade)" opacity="0.95"/>
  <defs>
    <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617" stop-opacity="0"/>
      <stop offset="60%" stop-color="#020617" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="1"/>
    </linearGradient>
  </defs>

  <!-- Title & Arabic Subtitle -->
  <text x="200" y="352" font-family="'Cairo', sans-serif" font-size="17" font-weight="800" fill="#f8fafc" text-anchor="middle">${escapeXml(styleNameAr)}</text>
  <text x="200" y="375" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="500" fill="${p2}" text-anchor="middle">${escapeXml(styleNameEn)}</text>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
