import type { DocumentSection } from '@/types';
import { extractSections } from './chunker';

let workerConfigured = false;

async function configurePdfWorker(pdfjsLib: typeof import('pdfjs-dist')) {
  if (workerConfigured) return;
  workerConfigured = true;

  // Use the worker that is served from /public — this guarantees the version
  // matches the installed pdfjs-dist and avoids any CDN dependency.
  // The file is copied from node_modules/pdfjs-dist/build/pdf.worker.min.mjs
  // at build/dev time (see: scripts/copy-pdf-worker.mjs or the public/ folder directly).
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export async function extractFromPdf(
  file: File
): Promise<{ rawText: string; sections: DocumentSection[]; pageCount: number }> {
  const arrayBuffer = await file.arrayBuffer();

  // pdfjs-dist is a large library — dynamic import keeps it out of the initial bundle
  const pdfjsLib = await import('pdfjs-dist');

  // Configure the worker to load from /public (local, no CDN, version-locked)
  await configurePdfWorker(pdfjsLib);

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    // Disable range requests and streaming for client-side File objects
    disableRange: true,
    disableStream: true,
    disableAutoFetch: true,
  });

  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // pdfjs-dist TextItem | TextMarkedContent union — only TextItem has .str
    const pageText = textContent.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => (typeof item.str === 'string' ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) {
      pageTexts.push(pageText);
    }
  }

  if (pageTexts.length === 0) {
    throw new Error(
      'No text could be extracted from this PDF. It may be scanned or image-based. ' +
      'Try a text-based PDF or convert to .txt first.'
    );
  }

  const rawText = pageTexts.join('\n\n');
  const sections = extractSections(rawText);

  // Assign page numbers to sections proportionally
  const sectionsWithPages = sections.map((s, idx) => ({
    ...s,
    pageNumber: Math.min(idx + 1, pageCount),
  }));

  return { rawText, sections: sectionsWithPages, pageCount };
}
