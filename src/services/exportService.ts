import JSZip from 'jszip';
import { ART_STYLES, STYLE_GROUPS, getStyleSvgUrl } from '../data/stylesData';

/**
 * Generates the full 100-styles.json data
 */
export function generateStylesJson(): string {
  const exportPayload = {
    platform: 'Anime & Game Art Styles Platform | مكتبة أساليب فنون الألعاب والأنمي',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    totalStyles: ART_STYLES.length,
    totalGroups: STYLE_GROUPS.length,
    groups: STYLE_GROUPS.map(g => ({
      id: g.id,
      number: g.number,
      nameAr: g.nameAr,
      nameEn: g.nameEn,
      descriptionAr: g.descriptionAr,
      stylesCount: g.styles.length
    })),
    styles: ART_STYLES.map(s => ({
      id: s.id,
      groupId: s.groupId,
      indexInGroup: s.indexInGroup,
      groupNameAr: s.groupNameAr,
      groupNameEn: s.groupNameEn,
      styleNameAr: s.styleNameAr,
      styleNameEn: s.styleNameEn,
      description: s.description,
      detailedDescriptionAr: s.detailedDescriptionAr,
      keywords: s.keywords,
      visualTraits: s.visualTraits,
      promptTemplate: s.promptTemplate,
      negativePrompt: s.negativePrompt,
      characterArchetypeTips: s.characterArchetypeTips,
      paletteColors: s.paletteColors,
      tags: s.tags,
      previewAlt: s.previewAlt,
      previewStatus: s.previewStatus
    }))
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Generates CSV formatted for ComfyUI and Automatic1111 / WebUI style loaders
 */
export function generateComfyUiCsv(): string {
  const headers = ['id', 'name', 'group', 'prompt', 'negative_prompt', 'tags'];
  const rows = ART_STYLES.map(s => {
    const cleanPrompt = s.promptTemplate.replace(/"/g, '""');
    const cleanNeg = s.negativePrompt.replace(/"/g, '""');
    const cleanName = `${s.styleNameAr} (${s.styleNameEn})`.replace(/"/g, '""');
    const cleanGroup = s.groupNameAr.replace(/"/g, '""');
    const cleanTags = s.tags.join(';').replace(/"/g, '""');
    return `"${s.id}","${cleanName}","${cleanGroup}","${cleanPrompt}","${cleanNeg}","${cleanTags}"`;
  });

  // Include UTF-8 BOM so Excel opens Arabic correctly
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}

/**
 * Generates structured prompts library text file
 */
export function generatePromptsLibraryTxt(): string {
  let output = `========================================================================\n`;
  output += `مكتبة برومبتات تحويل الشخصيات إلى 100 أسلوب فني في ألعاب الفيديو والأنمي\n`;
  output += `Anime & Video Game Art Styles Prompt Library (100 Styles across 10 Groups)\n`;
  output += `========================================================================\n\n`;

  STYLE_GROUPS.forEach(group => {
    output += `\n########################################################################\n`;
    output += `المجموعة ${group.number}: ${group.nameAr} (${group.nameEn})\n`;
    output += `الوصف: ${group.descriptionAr}\n`;
    output += `########################################################################\n\n`;

    group.styles.forEach(style => {
      output += `------------------------------------------------------------------------\n`;
      output += `[${style.id}] ${style.styleNameAr} | ${style.styleNameEn}\n`;
      output += `------------------------------------------------------------------------\n`;
      output += `الوصف: ${style.description}\n`;
      output += `الكلمات المفتاحية: ${style.keywords.join(', ')}\n`;
      output += `نصائح المظهر: ${style.characterArchetypeTips}\n\n`;
      output += `[PROMPT TEMPLATE]:\n${style.promptTemplate}\n\n`;
      output += `[NEGATIVE PROMPT]:\n${style.negativePrompt}\n\n`;
    });
  });

  return output;
}

/**
 * Generates Notion-ready CSV for importing as a full Notion Database
 */
export function generateNotionCsv(): string {
  const headers = [
    'ID',
    'Style Name (Arabic)',
    'Style Name (English)',
    'Group Name',
    'Group Number',
    'Description',
    'Prompt Template',
    'Negative Prompt',
    'Keywords',
    'Tags'
  ];

  const rows = ART_STYLES.map(s => {
    const esc = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    return [
      esc(s.id),
      esc(s.styleNameAr),
      esc(s.styleNameEn),
      esc(s.groupNameAr),
      s.groupId.replace('g', ''),
      esc(s.description),
      esc(s.promptTemplate),
      esc(s.negativePrompt),
      esc(s.keywords.join(', ')),
      esc(s.tags.join(', '))
    ].join(',');
  });

  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}

/**
 * Generates Notion-ready Markdown document
 */
export function generateNotionMarkdown(): string {
  let md = `# مكتبة أساليب فنون الألعاب والأنمي (100 Styles Notion Database)\n\n`;
  md += `> دليل متكامل ومفهرس يضم 100 أسلوب فني موزعة على 10 مجموعات تخصصية.\n\n`;

  STYLE_GROUPS.forEach(group => {
    md += `## 📁 المجموعة ${group.number}: ${group.nameAr} (${group.nameEn})\n\n`;
    md += `${group.descriptionAr}\n\n`;

    group.styles.forEach(style => {
      md += `### 🎨 ${style.id}: ${style.styleNameAr} / ${style.styleNameEn}\n\n`;
      md += `- **الوصف:** ${style.description}\n`;
      md += `- **التشريح:** ${style.characterArchetypeTips}\n`;
      md += `- **الكلمات المفتاحية:** \`${style.keywords.join('`, `')}\`\n\n`;
      md += `**Positive Prompt:**\n\`\`\`text\n${style.promptTemplate}\n\`\`\`\n\n`;
      md += `**Negative Prompt:**\n\`\`\`text\n${style.negativePrompt}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });
  });

  return md;
}

/**
 * Generates complete standalone 100-styles.html with self-contained styles, search, and copy
 */
export function generateStandaloneHtml(): string {
  const stylesDataJson = JSON.stringify(ART_STYLES);
  const groupsDataJson = JSON.stringify(STYLE_GROUPS);

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مكتبة أساليب فنون الألعاب والأنمي - الدليل المستقل (100 أسلوب)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cairo', sans-serif;
      background-color: #030712;
      color: #f3f4f6;
      line-height: 1.6;
      padding: 24px;
    }
    header {
      text-align: center;
      margin-bottom: 32px;
      padding: 32px 16px;
      background: linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(15, 23, 42, 0.8));
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
    }
    h1 { font-size: 2.2rem; color: #818cf8; margin-bottom: 8px; }
    p.lead { color: #9ca3af; font-size: 1.1rem; }
    .search-box {
      margin: 24px auto;
      max-width: 600px;
    }
    input[type="text"] {
      width: 100%;
      padding: 14px 20px;
      border-radius: 12px;
      background: #111827;
      border: 1px solid #374151;
      color: #fff;
      font-family: inherit;
      font-size: 1rem;
    }
    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 32px;
    }
    .filter-btn {
      padding: 8px 16px;
      border-radius: 9999px;
      border: 1px solid #374151;
      background: #1f2937;
      color: #d1d5db;
      font-family: inherit;
      cursor: pointer;
      font-size: 0.88rem;
      transition: all 0.2s;
    }
    .filter-btn.active, .filter-btn:hover {
      background: #4f46e5;
      color: #fff;
      border-color: #6366f1;
    }
    .styles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }
    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover {
      transform: translateY(-4px);
      border-color: #6366f1;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.4);
    }
    .group-label {
      font-size: 0.8rem;
      color: #9ca3af;
    }
    .style-title-ar {
      font-size: 1.25rem;
      font-weight: 700;
      color: #f9fafb;
    }
    .style-title-en {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: #38bdf8;
    }
    .card-desc {
      font-size: 0.9rem;
      color: #9ca3af;
      flex-grow: 1;
    }
    .prompt-box {
      background: #030712;
      padding: 12px;
      border-radius: 8px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.78rem;
      color: #a5b4fc;
      border: 1px solid #1f2937;
      max-height: 90px;
      overflow-y: auto;
      direction: ltr;
      text-align: left;
    }
    .card-actions {
      display: flex;
      gap: 8px;
    }
    .btn {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .btn-primary { background: #4f46e5; color: #fff; }
    .btn-primary:hover { background: #4338ca; }
    .btn-secondary { background: #1f2937; color: #d1d5db; border: 1px solid #374151; }
    .btn-secondary:hover { background: #374151; }
    footer {
      text-align: center;
      margin-top: 48px;
      padding: 24px;
      color: #6b7280;
      font-size: 0.9rem;
      border-top: 1px solid #1f2937;
    }
  </style>
</head>
<body>
  <header>
    <h1>مكتبة أساليب فنون الألعاب والأنمي</h1>
    <p class="lead">المرجع المستقل الشامل - 100 أسلوب فني احترافي موزعة على 10 مجموعات مع برومبتات جاهزة</p>
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="ابحث بالاسم العربي أو الإنجليزي أو الكلمات المفتاحية..." oninput="handleSearch()">
    </div>
    <div class="filters" id="filtersContainer">
      <button class="filter-btn active" onclick="filterByGroup('all')">جميع الأساليب (100)</button>
    </div>
  </header>

  <main>
    <div class="styles-grid" id="stylesContainer"></div>
  </main>

  <footer>
    <p>مكتبة أساليب فنون الألعاب والأنمي © 2026 - ملف HTML مستقل قابل للتشغيل دون اتصال بالإنترنت</p>
  </footer>

  <script>
    const styles = ${stylesDataJson};
    const groups = ${groupsDataJson};
    let currentGroup = 'all';

    // Initialize filters
    const filtersContainer = document.getElementById('filtersContainer');
    groups.forEach(g => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.textContent = g.number + '. ' + g.nameAr;
      btn.onclick = () => filterByGroup(g.id);
      filtersContainer.appendChild(btn);
    });

    function renderCards(list) {
      const container = document.getElementById('stylesContainer');
      container.innerHTML = '';
      if (list.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 48px; color: #6b7280;">لا توجد أساليب مطابقة للبحث</div>';
        return;
      }
      list.forEach(s => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = \`
          <div class="card-header">
            <span class="badge">\${s.id.toUpperCase()}</span>
            <span class="group-label">\${s.groupNameAr}</span>
          </div>
          <div>
            <div class="style-title-ar">\${s.styleNameAr}</div>
            <div class="style-title-en">\${s.styleNameEn}</div>
          </div>
          <div class="card-desc">\${s.description}</div>
          <div class="prompt-box">\${s.promptTemplate}</div>
          <div class="card-actions">
            <button class="btn btn-primary" onclick="copyText('\${s.promptTemplate.replace(/'/g, "\\\\'")}')">نسخ البرومبت</button>
            <button class="btn btn-secondary" onclick="copyText('\${s.negativePrompt.replace(/'/g, "\\\\'")}')">البرومبت السلبي</button>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    function filterByGroup(groupId) {
      currentGroup = groupId;
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((groupId === 'all' && btn.textContent.includes('جميع')) || btn.textContent.startsWith(groupId.replace('g0', '').replace('g', '') + '.')) {
          btn.classList.add('active');
        }
      });
      handleSearch();
    }

    function handleSearch() {
      const query = (document.getElementById('searchInput').value || '').trim().toLowerCase();
      let filtered = styles;
      if (currentGroup !== 'all') {
        filtered = filtered.filter(s => s.groupId === currentGroup);
      }
      if (query) {
        filtered = filtered.filter(s => 
          s.styleNameAr.toLowerCase().includes(query) ||
          s.styleNameEn.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.id.toLowerCase().includes(query) ||
          s.keywords.some(k => k.toLowerCase().includes(query))
        );
      }
      renderCards(filtered);
    }

    function copyText(txt) {
      navigator.clipboard.writeText(txt).then(() => {
        alert('تم نسخ النص إلى الحافظة بنجاح!');
      });
    }

    // Initial render
    renderCards(styles);
  </script>
</body>
</html>`;
}

/**
 * Downloads a text or binary blob with filename
 */
export function triggerDownload(content: BlobPart, filename: string, mimeType: string = 'text/plain;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Creates and downloads the complete project ZIP bundle containing all files
 */
export async function downloadCompleteProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root data exports
  zip.file('100-styles.json', generateStylesJson());
  zip.file('100-styles-comfyui.csv', generateComfyUiCsv());
  zip.file('prompts-library.txt', generatePromptsLibraryTxt());
  zip.file('notion-styles.csv', generateNotionCsv());
  zip.file('notion-styles.md', generateNotionMarkdown());
  zip.file('100-styles.html', generateStandaloneHtml());

  // Configuration files
  zip.file('.env.example', `# OpenAI API Key for real image generation\nOPENAI_API_KEY=""\nAPP_URL="http://localhost:3000"\n`);
  zip.file('.gitignore', `node_modules\ndist\n.env\n.DS_Store\n`);

  // README Documentation
  const readmeContent = `# مكتبة أساليب فنون الألعاب والأنمي | Anime & Game Style Studio
الإصدار: 1.0.0
المنصة المتكاملة لتحويل الشخصيات إلى 100 أسلوب فني في ألعاب الفيديو والأنمي

## نظرة عامة
تضم هذه الحزمة 100 أسلوب فني موزعة بدقة على 10 مجموعات تخصصية:
1. أنمي كلاسيكي وريترو (g01-s01 إلى g01-s10)
2. أنمي حديث وشونين ومعاصر (g02-s01 إلى g02-s10)
3. مانغا، ويبتون وكوميكس آسيوي (g03-s01 إلى g03-s10)
4. فنون ألعاب الفيديو ثنائية وثلاثية الأبعاد (g04-s01 إلى g04-s10)
5. بيكسل آرت وفنون الريترو (g05-s01 إلى g05-s10)
6. الفنون المفاهيمية والخيال (g06-s01 إلى g06-s10)
7. فنون التشيبي والكرتون الممتع (g07-s01 إلى g07-s10)
8. أساليب فنية متقدمة وتجريبية (g08-s01 إلى g08-s10)
9. الواقعية وشبه الواقعية (g09-s01 إلى g09-s10)
10. الأنيميشن الغربي والكرتون الأمريكي (g10-s01 إلى g10-s10)

## محتويات الحزمة
- \`100-styles.html\`: صفحة ويب مستقلة تفاعلية تعمل أوفلاين.
- \`100-styles.json\`: ملف JSON شامل لكل الأساليب والمعرّفات والأوصاف.
- \`100-styles-comfyui.csv\`: ملف CSV جاهز للاستخدام المباشر في ComfyUI و Automatic1111.
- \`prompts-library.txt\`: مكتبة البرومبتات الإيجابية والسلبية بتنسيق نصي منظم.
- \`notion-styles.csv\` و \`notion-styles.md\`: ملفات مهيأة للاستيراد الفوري في Notion.
- مجلد \`previews-svg/\`: صور المتجهات الفنية المصغرة لجميع الأساليب.

## تعليمات التشغيل السريع
1. تثبيت الحزم: \`npm install\`
2. إعداد المتغيرات: أنشئ ملف \`.env\` وضع \`OPENAI_API_KEY="sk-..."\`
3. تشغيل خادم التطوير: \`npm run dev\`
4. البناء للإنتاج: \`npm run build && npm start\`

تم التطوير بأعلى معايير هندسة البرمجيات وتجربة المستخدم العربية.
`;
  zip.file('README.md', readmeContent);

  // Add SVG previews folder
  const previewsFolder = zip.folder('previews-svg');
  if (previewsFolder) {
    ART_STYLES.forEach(style => {
      const svgDataUrl = getStyleSvgUrl(style);
      const svgContent = decodeURIComponent(svgDataUrl.replace('data:image/svg+xml;utf8,', ''));
      previewsFolder.file(`${style.id}.svg`, svgContent);
    });
  }

  // Generate ZIP blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, 'anime-game-100-styles-complete.zip', 'application/zip');
}
