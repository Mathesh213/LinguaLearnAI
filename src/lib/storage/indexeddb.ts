import { openDB, type IDBPDatabase } from 'idb';
import type {
  StudyDocument,
  Translation,
  SimplifiedContent,
  Topic,
  Quiz,
  QuizAttempt,
  Bookmark,
  Language,
} from '@/types';

// ── DB Schema ────────────────────────────────────────────────
const DB_NAME = 'lingualearn-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('documents')) {
          db.createObjectStore('documents', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('translations')) {
          const ts = db.createObjectStore('translations', { keyPath: 'id' });
          ts.createIndex('by-doc-lang', ['documentId', 'language']);
        }
        if (!db.objectStoreNames.contains('simplified-content')) {
          const ss = db.createObjectStore('simplified-content', { keyPath: 'id' });
          ss.createIndex('by-doc-level', ['documentId', 'level']);
        }
        if (!db.objectStoreNames.contains('topics')) {
          const tps = db.createObjectStore('topics', { keyPath: 'id' });
          tps.createIndex('by-doc', 'documentId');
        }
        if (!db.objectStoreNames.contains('quizzes')) {
          const qs = db.createObjectStore('quizzes', { keyPath: 'id' });
          qs.createIndex('by-doc', 'documentId');
        }
        if (!db.objectStoreNames.contains('quiz-attempts')) {
          const as = db.createObjectStore('quiz-attempts', { keyPath: 'id' });
          as.createIndex('by-quiz', 'quizId');
        }
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bs = db.createObjectStore('bookmarks', { keyPath: 'id' });
          bs.createIndex('by-doc', 'documentId');
        }
      },
    });
  }
  return dbPromise;
}

// ── Documents ────────────────────────────────────────────────
export async function saveDocument(doc: StudyDocument): Promise<void> {
  const db = await getDB();
  await db.put('documents', { ...doc, uploadedAt: doc.uploadedAt.toISOString() });
}

export async function getDocument(id: string): Promise<StudyDocument | undefined> {
  const db = await getDB();
  const raw = await db.get('documents', id);
  if (!raw) return undefined;
  return { ...raw, uploadedAt: new Date(raw.uploadedAt) };
}

export async function getAllDocuments(): Promise<StudyDocument[]> {
  const db = await getDB();
  const all = await db.getAll('documents');
  return all.map((raw) => ({ ...raw, uploadedAt: new Date(raw.uploadedAt) }));
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('documents', id);
}

// ── Translations ─────────────────────────────────────────────
export async function saveTranslation(t: Translation): Promise<void> {
  const db = await getDB();
  await db.put('translations', { ...t, createdAt: t.createdAt.toISOString() });
}

export async function getTranslation(
  documentId: string,
  language: Language
): Promise<Translation | undefined> {
  const db = await getDB();
  const raw = await db.getFromIndex('translations', 'by-doc-lang', [documentId, language]);
  if (!raw) return undefined;
  return { ...raw, createdAt: new Date(raw.createdAt) };
}

// ── Simplified Content ───────────────────────────────────────
export async function saveSimplifiedContent(sc: SimplifiedContent): Promise<void> {
  const db = await getDB();
  await db.put('simplified-content', { ...sc, createdAt: sc.createdAt.toISOString() });
}

export async function getSimplifiedContent(
  documentId: string,
  level: string
): Promise<SimplifiedContent | undefined> {
  const db = await getDB();
  const raw = await db.getFromIndex('simplified-content', 'by-doc-level', [documentId, level]);
  if (!raw) return undefined;
  return { ...raw, createdAt: new Date(raw.createdAt) };
}

// ── Topics ────────────────────────────────────────────────────
export async function saveTopics(topics: Topic[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('topics', 'readwrite');
  await Promise.all(topics.map((t) => tx.store.put(t)));
  await tx.done;
}

export async function getTopics(documentId: string): Promise<Topic[]> {
  const db = await getDB();
  return db.getAllFromIndex('topics', 'by-doc', documentId);
}

// ── Quizzes ───────────────────────────────────────────────────
export async function saveQuiz(quiz: Quiz): Promise<void> {
  const db = await getDB();
  await db.put('quizzes', { ...quiz, createdAt: quiz.createdAt.toISOString() });
}

export async function getQuizzesByDocument(documentId: string): Promise<Quiz[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('quizzes', 'by-doc', documentId);
  return all.map((q) => ({ ...q, createdAt: new Date(q.createdAt) }));
}

// ── Quiz Attempts ─────────────────────────────────────────────
export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  const db = await getDB();
  await db.put('quiz-attempts', {
    ...attempt,
    completedAt: attempt.completedAt.toISOString(),
  });
}

export async function getAllQuizAttempts(): Promise<QuizAttempt[]> {
  const db = await getDB();
  const all = await db.getAll('quiz-attempts');
  return all.map((a) => ({ ...a, completedAt: new Date(a.completedAt) }));
}

export async function getQuizAttemptsByDocument(documentId: string): Promise<QuizAttempt[]> {
  const all = await getAllQuizAttempts();
  return all.filter((a) => a.documentId === documentId);
}

// ── Bookmarks ─────────────────────────────────────────────────
export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  const db = await getDB();
  await db.put('bookmarks', { ...bookmark, createdAt: bookmark.createdAt.toISOString() });
}

export async function getBookmarks(documentId: string): Promise<Bookmark[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('bookmarks', 'by-doc', documentId);
  return all.map((b) => ({ ...b, createdAt: new Date(b.createdAt) }));
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('bookmarks', id);
}

// ── Clear All ─────────────────────────────────────────────────
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const stores = [
    'documents', 'translations', 'simplified-content',
    'topics', 'quizzes', 'quiz-attempts', 'bookmarks',
  ];
  const tx = db.transaction(stores, 'readwrite');
  await Promise.all(stores.map((s) => tx.objectStore(s).clear()));
  await tx.done;
}
