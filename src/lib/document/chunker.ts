import type { DocumentSection } from '@/types';

const MAX_SECTION_CHARS = 3000;

// ── Extract sections from raw text ───────────────────────────
export function extractSections(rawText: string): DocumentSection[] {
  const lines = rawText.split('\n');
  const sections: DocumentSection[] = [];
  let currentTitle = 'Introduction';
  let currentContent: string[] = [];
  let order = 0;

  const headingPatterns = [
    /^#{1,3}\s+(.+)$/,            // Markdown headings
    /^([A-Z][A-Za-z\s]{3,50})$/,  // ALL CAPS or Title Case short lines
    /^\d+\.\s+([A-Z].{3,60})$/,   // Numbered sections: "1. Introduction"
    /^Chapter\s+\d+/i,             // Chapter headers
    /^Section\s+\d+/i,             // Section headers
    /^[IVX]+\.\s+(.+)$/,          // Roman numeral sections
  ];

  function isHeading(line: string): string | null {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3 || trimmed.length > 100) return null;
    for (const pattern of headingPatterns) {
      const match = trimmed.match(pattern);
      if (match) return (match[1] ?? trimmed).trim();
    }
    // Check if it looks like a section title (short, starts with capital, no period)
    if (
      trimmed.length < 60 &&
      /^[A-Z]/.test(trimmed) &&
      !trimmed.endsWith('.') &&
      !trimmed.includes('  ') &&
      currentContent.length > 50 // Only treat as heading if we have content already
    ) {
      return trimmed;
    }
    return null;
  }

  for (const line of lines) {
    const heading = isHeading(line);
    if (heading && heading !== currentTitle) {
      // Save current section if it has content
      const content = currentContent.join('\n').trim();
      if (content.length > 20) {
        sections.push({
          id: `section-${order}`,
          title: currentTitle,
          content,
          order,
          pageNumber: Math.floor(order * 1.5) + 1,
        });
        order++;
      }
      currentTitle = heading;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  // Don't forget the last section
  const finalContent = currentContent.join('\n').trim();
  if (finalContent.length > 20) {
    sections.push({
      id: `section-${order}`,
      title: currentTitle,
      content: finalContent,
      order,
      pageNumber: Math.floor(order * 1.5) + 1,
    });
  }

  // If no sections were found, treat entire text as one section
  if (sections.length === 0) {
    return [
      {
        id: 'section-0',
        title: 'Document Content',
        content: rawText.trim(),
        order: 0,
        pageNumber: 1,
      },
    ];
  }

  return sections;
}

// ── Chunk text into pieces ────────────────────────────────────
export function chunkText(text: string, maxChars = MAX_SECTION_CHARS): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let current = '';

  for (const para of paragraphs) {
    if (current.length + para.length + 2 > maxChars && current) {
      chunks.push(current.trim());
      current = para;
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// ── Sections to chunks ────────────────────────────────────────
export function sectionsToChunks(
  sections: DocumentSection[],
  maxChars = MAX_SECTION_CHARS
): Array<{ sectionId: string; content: string; chunkIndex: number }> {
  const result: Array<{ sectionId: string; content: string; chunkIndex: number }> = [];

  for (const section of sections) {
    const chunks = chunkText(section.content, maxChars);
    chunks.forEach((chunk, idx) => {
      result.push({ sectionId: section.id, content: chunk, chunkIndex: idx });
    });
  }

  return result;
}
