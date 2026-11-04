// ============================================================
// AI PROMPT BUILDERS — LINGUALEARN AI
// All prompts instruct Gemini to return structured JSON
// ============================================================

// ── Translation ─────────────────────────────────────────────
export function buildTranslationPrompt(params: {
  sections: Array<{ id: string; title: string; content: string }>;
  targetLanguage: string;
  documentContext: string;
}): string {
  const langInstructions: Record<string, string> = {
    tamil: 'Tamil (தமிழ்). Use standard written Tamil script.',
    hindi: 'Hindi (हिंदी). Use Devanagari script.',
    telugu: 'Telugu (తెలుగు). Use Telugu script.',
    malayalam: 'Malayalam (മലയാളം). Use Malayalam script.',
    english: 'English. Maintain formal academic English.',
  };

  const langInstruction =
    langInstructions[params.targetLanguage.toLowerCase()] ?? params.targetLanguage;

  const sectionsJson = JSON.stringify(
    params.sections.map((s) => ({ id: s.id, title: s.title, content: s.content }))
  );

  return `You are an expert educational translator specializing in technical and academic content.

TASK: Translate the following educational document sections into ${langInstruction}.

DOCUMENT CONTEXT: ${params.documentContext}

CRITICAL RULES:
1. Preserve ALL technical terms (e.g., "Normalization", "ACID", "SQL") — keep them in English within the translation.
2. Maintain the educational meaning and nuance. Never oversimplify.
3. Preserve mathematical expressions exactly (e.g., F: X → Y, 1NF, 2NF).
4. Keep headings and structure intact.
5. Identify and list technical terms that were kept in English.
6. Build a glossary of key technical terms with their translations/transliterations.
7. If any section cannot be translated accurately, add it to warnings.

SECTIONS TO TRANSLATE:
${sectionsJson}

Respond ONLY with valid JSON in this exact structure:
{
  "sections": [
    {
      "sectionId": "section_id_here",
      "originalText": "original text",
      "translatedText": "translated text",
      "technicalTerms": ["term1", "term2"]
    }
  ],
  "glossary": [
    {
      "term": "English term",
      "transliteration": "phonetic in target script if applicable",
      "translation": "translation or kept as-is",
      "definition": "brief definition in target language"
    }
  ],
  "warnings": ["any issues encountered"]
}`;
}

// ── Simplification ──────────────────────────────────────────
export function buildSimplificationPrompt(params: {
  sections: Array<{ id: string; title: string; content: string }>;
  level: string;
  language: string;
}): string {
  const levelGuides: Record<string, string> = {
    beginner: `BEGINNER LEVEL:
- Use simple everyday vocabulary. No jargon without explanation.
- Include a real-world analogy for every concept.
- Break into very small steps.
- Use short sentences (max 20 words each).
- Include practical examples from daily life.
- Concept coverage target: 85%+ of original concepts must be retained.`,
    intermediate: `INTERMEDIATE LEVEL:
- Use technical terminology with brief explanations.
- Provide detailed explanations with applications.
- Show relationships between concepts.
- Include practical examples from the field.
- Concept coverage target: 90%+ of original concepts must be retained.`,
    advanced: `ADVANCED LEVEL:
- Use full technical depth and formal definitions.
- Include dependencies and theoretical foundations.
- Show edge cases and limitations.
- Formal notation where appropriate.
- Concept coverage target: 95%+ of original concepts must be retained.`,
  };

  const sectionsJson = JSON.stringify(
    params.sections.map((s) => ({ id: s.id, title: s.title, content: s.content }))
  );

  return `You are an expert educational content simplifier.

TASK: Simplify the following educational sections for a ${params.level} level student.
LANGUAGE: ${params.language}

${levelGuides[params.level] ?? levelGuides['intermediate']}

IMPORTANT:
- Do NOT sacrifice accuracy for simplicity.
- Do NOT omit essential concepts — only simplify the language.
- Do NOT invent new information.
- Preserve all formulas, rules, and technical definitions.

SECTIONS:
${sectionsJson}

Respond ONLY with valid JSON:
{
  "sections": [
    {
      "sectionId": "section_id",
      "title": "section title",
      "simplifiedText": "simplified explanation",
      "keyPoints": ["key point 1", "key point 2"],
      "analogy": "real-world analogy (especially for beginner level)",
      "example": "concrete example"
    }
  ],
  "conceptCoverage": 92,
  "warnings": ["list any concepts that could not be simplified without loss"]
}`;
}

// ── Topic Analysis ──────────────────────────────────────────
export function buildTopicAnalysisPrompt(params: {
  documentContent: string;
  documentTitle: string;
}): string {
  return `You are an expert educational curriculum analyst.

TASK: Analyze the following educational document and identify all major topics.

DOCUMENT TITLE: "${params.documentTitle}"

For each topic, assess:
- Difficulty score from 0 to 100 (0=trivial, 100=extremely complex)
- Prerequisites: what must a student know first?
- Subtopics: break down the topic
- Key terminology: technical terms in this topic
- Recommended learning level: beginner, intermediate, or advanced

DIFFICULTY GUIDELINES:
- 0-33: Easy — basic facts, simple definitions, introductory concepts
- 34-66: Moderate — relationships between concepts, applied understanding
- 67-100: Difficult — formal proofs, complex dependencies, edge cases

DOCUMENT CONTENT:
${params.documentContent}

Respond ONLY with valid JSON:
{
  "topics": [
    {
      "name": "Topic Name",
      "description": "2-3 sentence description",
      "difficultyScore": 45,
      "difficultyCategory": "moderate",
      "prerequisites": ["prerequisite 1"],
      "subtopics": ["subtopic 1", "subtopic 2"],
      "keyTerminology": ["term1", "term2"],
      "recommendedLevel": "intermediate",
      "sectionIds": ["section_id_if_identifiable"]
    }
  ]
}`;
}

// ── Quiz Generation ─────────────────────────────────────────
export function buildQuizPrompt(params: {
  sections: Array<{ id: string; title: string; content: string }>;
  topicNames: string[];
  questionCount: number;
  difficulty: string;
  language: string;
  questionTypes: string[];
}): string {
  const typesGuide = params.questionTypes
    .map((t) => {
      if (t === 'mcq') return '- MCQ: exactly 4 options, exactly 1 correct. correctAnswer must be the FULL text of the correct option.';
      if (t === 'fill-blank') return '- Fill-in-the-blank: use ___ to mark the blank. correctAnswer is the missing word/phrase.';
      if (t === 'short-answer') return '- Short answer: open-ended, 1-3 sentence expected answer.';
      return '';
    })
    .join('\n');

  const sectionsJson = JSON.stringify(
    params.sections.map((s) => ({ id: s.id, title: s.title, content: s.content.slice(0, 1000) }))
  );

  return `You are an expert educational quiz generator.

TASK: Generate exactly ${params.questionCount} practice questions from the provided content.

TOPICS TO COVER: ${params.topicNames.join(', ')}
DIFFICULTY: ${params.difficulty}
LANGUAGE: ${params.language}

QUESTION TYPES TO USE:
${typesGuide}

CRITICAL RULES:
1. Every question MUST be answerable from the provided content — no external knowledge.
2. Include the exact section title where the answer is found in "sourceSection".
3. Include a brief excerpt (1-2 sentences) from the source in "sourceExcerpt".
4. For MCQ: exactly 4 options, only 1 correct, options should be plausible.
5. For MCQ: "correctAnswer" MUST exactly match one of the options strings.
6. Explanation should reference the source material.
7. Distribute questions across multiple topics when possible.

CONTENT:
${sectionsJson}

Respond ONLY with valid JSON:
{
  "questions": [
    {
      "type": "mcq",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option B",
      "explanation": "Explanation referencing the source content.",
      "sourceSection": "Section title where answer is found",
      "sourceExcerpt": "Exact or paraphrased sentence from source",
      "difficulty": "${params.difficulty}"
    }
  ]
}`;
}

// ── Concept Explanation ─────────────────────────────────────
export function buildConceptExplanationPrompt(params: {
  concept: string;
  documentContext: string;
  level: string;
  language: string;
}): string {
  return `You are a friendly, expert personal tutor.

TASK: Explain the concept "${params.concept}" to a ${params.level} level student.
LANGUAGE: ${params.language}

DOCUMENT CONTEXT (use this as your primary source):
${params.documentContext}

Provide:
1. A simple, clear explanation appropriate for ${params.level} level.
2. A real-world analogy that makes the concept intuitive.
3. 3-5 key points to remember.
4. 2-3 related concepts the student should also understand.
5. 2 practice questions to test understanding.
6. A short excerpt from the source document that supports this explanation.

Respond ONLY with valid JSON:
{
  "concept": "${params.concept}",
  "simpleExplanation": "Clear explanation in ${params.language}",
  "realWorldAnalogy": "Real-world comparison",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "relatedConcepts": ["concept 1", "concept 2"],
  "practiceQuestions": ["question 1?", "question 2?"],
  "sourceExcerpt": "Relevant excerpt from the document"
}`;
}

// ── Validation ──────────────────────────────────────────────
export function buildValidationPrompt(params: {
  original: string;
  generated: string;
  type: 'translation' | 'simplification' | 'quiz';
}): string {
  const typeInstructions: Record<string, string> = {
    translation: 'Check that the translation preserves the educational meaning, technical terms are retained in English, and no information is added or omitted.',
    simplification: 'Check that all essential concepts from the original are present in the simplified version. Flag any missing concepts.',
    quiz: 'Check that the question is answerable from the source content, the correct answer is factually accurate, and exactly one MCQ option is correct.',
  };

  return `You are a quality assurance expert for educational AI content.

TYPE: ${params.type} validation
INSTRUCTION: ${typeInstructions[params.type]}

ORIGINAL:
${params.original}

GENERATED:
${params.generated}

Assess the quality and accuracy. Be strict about educational accuracy.

Respond ONLY with valid JSON:
{
  "isValid": true,
  "score": 85,
  "warnings": ["warning if any"],
  "errors": ["critical errors if any"],
  "suggestions": ["improvement suggestions"]
}`;
}
