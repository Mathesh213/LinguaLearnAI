import type { DocumentSection } from '@/types';
import { extractSections } from './chunker';

export async function extractFromDocx(
  file: File
): Promise<{ rawText: string; sections: DocumentSection[] }> {
  const arrayBuffer = await file.arrayBuffer();
  // Dynamic import for browser compatibility
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ arrayBuffer });

  if (result.messages.length > 0) {
    const warnings = result.messages.filter((m) => m.type === 'warning');
    if (warnings.length > 0) {
      console.warn('DOCX extraction warnings:', warnings);
    }
  }

  const rawText = result.value;
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('No text content could be extracted from this DOCX file.');
  }

  const sections = extractSections(rawText);
  return { rawText, sections };
}
