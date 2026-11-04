import type { DocumentSection } from '@/types';
import { extractSections } from './chunker';

export async function extractFromTxt(
  file: File
): Promise<{ rawText: string; sections: DocumentSection[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawText = e.target?.result as string;
      if (!rawText) {
        reject(new Error('Could not read file content'));
        return;
      }
      const sections = extractSections(rawText);
      resolve({ rawText, sections });
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsText(file, 'utf-8');
  });
}
