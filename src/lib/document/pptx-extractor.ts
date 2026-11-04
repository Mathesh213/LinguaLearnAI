import type { DocumentSection } from '@/types';

function extractTextFromXml(xmlStr: string): string {
  // Extract text from PowerPoint slide XML (a:t elements)
  const matches = xmlStr.match(/<a:t[^>]*>([^<]*)<\/a:t>/g) ?? [];
  return matches
    .map((m) => m.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)
    .join(' ');
}

export async function extractFromPptx(
  file: File
): Promise<{ rawText: string; sections: DocumentSection[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(arrayBuffer);

  // Find all slide files
  const slideFiles = Object.keys(zip.files)
    .filter((name) => name.match(/^ppt\/slides\/slide\d+\.xml$/))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] ?? '0');
      const numB = parseInt(b.match(/\d+/)?.[0] ?? '0');
      return numA - numB;
    });

  if (slideFiles.length === 0) {
    throw new Error('No slides found in this PPTX file.');
  }

  const sections: DocumentSection[] = [];
  const rawParts: string[] = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const slideFile = zip.files[slideFiles[i]];
    if (!slideFile) continue;

    const xmlContent = await slideFile.async('string');
    const slideText = extractTextFromXml(xmlContent);

    if (slideText.trim().length > 5) {
      const title = `Slide ${i + 1}`;
      rawParts.push(`${title}\n${slideText}`);
      sections.push({
        id: `section-${i}`,
        title,
        content: slideText,
        order: i,
        pageNumber: i + 1,
      });
    }
  }

  if (sections.length === 0) {
    throw new Error('No text content could be extracted from this PPTX file.');
  }

  return {
    rawText: rawParts.join('\n\n'),
    sections,
  };
}
