import type { StudyDocument } from '@/types';
import { DBMS_SECTIONS, DBMS_RAW_TEXT, DBMS_DOCUMENT_META } from './dbms-content';

export const DEMO_DOCUMENTS: StudyDocument[] = [
  {
    id: 'demo-dbms-001',
    name: DBMS_DOCUMENT_META.name,
    format: DBMS_DOCUMENT_META.format,
    size: 48500,
    uploadedAt: new Date('2024-10-28T09:00:00'),
    status: 'ready',
    sections: DBMS_SECTIONS,
    rawText: DBMS_RAW_TEXT,
    pageCount: DBMS_DOCUMENT_META.pageCount,
    isDemo: true,
  },
];

export const DEMO_DOCUMENT_ID = 'demo-dbms-001';
