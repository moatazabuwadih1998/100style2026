import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  generateStylesJson,
  generateComfyUiCsv,
  generatePromptsLibraryTxt,
  generateNotionCsv,
  generateNotionMarkdown,
  generateStandaloneHtml
} from '../src/services/exportService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('Generating export artifacts...');

fs.writeFileSync(path.join(rootDir, '100-styles.json'), generateStylesJson(), 'utf-8');
console.log('✓ 100-styles.json created');

fs.writeFileSync(path.join(rootDir, '100-styles-comfyui.csv'), generateComfyUiCsv(), 'utf-8');
console.log('✓ 100-styles-comfyui.csv created');

fs.writeFileSync(path.join(rootDir, 'prompts-library.txt'), generatePromptsLibraryTxt(), 'utf-8');
console.log('✓ prompts-library.txt created');

fs.writeFileSync(path.join(rootDir, 'notion-styles.csv'), generateNotionCsv(), 'utf-8');
console.log('✓ notion-styles.csv created');

fs.writeFileSync(path.join(rootDir, 'notion-styles.md'), generateNotionMarkdown(), 'utf-8');
console.log('✓ notion-styles.md created');

fs.writeFileSync(path.join(rootDir, '100-styles.html'), generateStandaloneHtml(), 'utf-8');
console.log('✓ 100-styles.html created');

console.log('All export artifacts successfully generated in root directory!');
