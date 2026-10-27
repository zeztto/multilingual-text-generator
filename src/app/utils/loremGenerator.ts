import { corpus as loremData } from "./corpus.ts";

// Lorem Ipsum 텍스트 생성 유틸리티

export type Language = 'ko' | 'en' | 'es' | 'fr' | 'de' | 'la' | 'ru' | 'ja' | 'zh' | 'vi' | 'th';
export type TextType = 'prose' | 'poetry' | 'copy' | 'lead';

interface LoremData {
  words: string[];
  punctuation: string[];
  poetryStructure?: {
    lineBreakChance: number;
    stanzaBreakChance: number;
  };
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

interface GenerateOptions {
  language: Language;
  textType: TextType;
  paragraphs: number;
  minSentencesPerParagraph: number;
  maxSentencesPerParagraph: number;
  minWordsPerSentence: number;
  maxWordsPerSentence: number;
  characterCount?: number;
}

export function generateLoremIpsum(options: GenerateOptions): string {
  const {
    language,
    textType,
    paragraphs,
    minSentencesPerParagraph,
    maxSentencesPerParagraph,
    minWordsPerSentence,
    maxWordsPerSentence,
    characterCount
  } = options;

  const data = loremData[language];
  const result: string[] = [];
  const noSpaceLanguages = ['ja', 'zh', 'th']; // 띄어쓰기 없는 언어 (일본어, 중국어, 태국어)

  switch (textType) {
    case 'prose':
      result.push(...generateProse(data, paragraphs, minSentencesPerParagraph, maxSentencesPerParagraph, minWordsPerSentence, maxWordsPerSentence, noSpaceLanguages.includes(language)));
      break;
    case 'poetry':
      result.push(...generatePoetry(data, paragraphs, minWordsPerSentence, maxWordsPerSentence, noSpaceLanguages.includes(language)));
      break;
    case 'copy':
      result.push(...generateCopy(data, paragraphs, minSentencesPerParagraph, maxSentencesPerParagraph, minWordsPerSentence, maxWordsPerSentence, noSpaceLanguages.includes(language)));
      break;
    case 'lead':
      result.push(...generateLead(data, paragraphs, minSentencesPerParagraph, maxSentencesPerParagraph, minWordsPerSentence, maxWordsPerSentence, noSpaceLanguages.includes(language)));
      break;
  }

  let text = result.join('\n\n');

  // 글자수 제한이 있는 경우
  if (characterCount && characterCount > 0) {
    if (text.length > characterCount) {
      text = text.substring(0, characterCount);
      // 마지막 문장을 정리
      const lastPeriodIndex = Math.max(
        text.lastIndexOf('.'),
        text.lastIndexOf('。'),
        text.lastIndexOf('!'),
        text.lastIndexOf('?')
      );
      if (lastPeriodIndex > 0) {
        text = text.substring(0, lastPeriodIndex + 1);
      }
    }
  }

  return text;
}

function generateProse(
  data: LoremData,
  paragraphs: number,
  minSentencesPerParagraph: number,
  maxSentencesPerParagraph: number,
  minWordsPerSentence: number,
  maxWordsPerSentence: number,
  noSpace: boolean = false
): string[] {
  const result: string[] = [];

  for (let i = 0; i < paragraphs; i++) {
    const sentenceCount = Math.floor(Math.random() * (maxSentencesPerParagraph - minSentencesPerParagraph + 1)) + minSentencesPerParagraph;
    const sentences: string[] = [];

    for (let j = 0; j < sentenceCount; j++) {
      const wordCount = Math.floor(Math.random() * (maxWordsPerSentence - minWordsPerSentence + 1)) + minWordsPerSentence;
      const words: string[] = [];

      for (let k = 0; k < wordCount; k++) {
        words.push(getRandomElement(data.words));
      }

      let sentence = noSpace ? words.join('') : words.join(' ');
      sentence = capitalizeFirst(sentence);

      // 마지막 문장은 항상 마침표로 끝남
      if (j === sentenceCount - 1) {
        sentence += noSpace ? '。' : '.';
      } else {
        // 중간 문장은 랜덤 문장 부호
        const punctuation = getRandomElement(data.punctuation);
        sentence += punctuation;
      }
      
      sentences.push(sentence);
    }

    result.push(noSpace ? sentences.join('') : sentences.join(' '));
  }

  return result;
}

function generatePoetry(
  data: LoremData,
  stanzas: number,
  minWordsPerLine: number,
  maxWordsPerLine: number,
  noSpace: boolean = false
): string[] {
  const result: string[] = [];

  for (let i = 0; i < stanzas; i++) {
    const linesPerStanza = Math.floor(Math.random() * 3) + 3; // 3-5 lines per stanza
    const lines: string[] = [];

    for (let j = 0; j < linesPerStanza; j++) {
      const wordCount = Math.floor(Math.random() * (maxWordsPerLine - minWordsPerLine + 1)) + minWordsPerLine;
      const words: string[] = [];

      for (let k = 0; k < wordCount; k++) {
        words.push(getRandomElement(data.words));
      }

      let line = noSpace ? words.join('') : words.join(' ');
      line = capitalizeFirst(line);

      // 마지막 줄은 항상 마침표로 끝남
      if (j === linesPerStanza - 1) {
        line += noSpace ? '。' : '.';
      } else {
        // 중간 줄은 마침표를 적게 사용
        if (Math.random() > 0.7) {
          const punctuation = getRandomElement(data.punctuation.filter(p => p === '.' || p === '。' || p === ',' || p === '，'));
          line += punctuation;
        }
      }

      lines.push(line);
    }

    result.push(lines.join('\n'));
  }

  return result;
}

function generateCopy(
  data: LoremData,
  paragraphs: number,
  minSentencesPerParagraph: number,
  maxSentencesPerParagraph: number,
  minWordsPerSentence: number,
  maxWordsPerSentence: number,
  noSpace: boolean = false
): string[] {
  const result: string[] = [];

  for (let i = 0; i < paragraphs; i++) {
    const sentenceCount = Math.floor(Math.random() * (maxSentencesPerParagraph - minSentencesPerParagraph + 1)) + minSentencesPerParagraph;
    const sentences: string[] = [];

    for (let j = 0; j < sentenceCount; j++) {
      // 카피는 짧고 임팩트 있게
      const wordCount = Math.floor(Math.random() * (Math.max(minWordsPerSentence, Math.min(maxWordsPerSentence, 8)) - minWordsPerSentence + 1)) + minWordsPerSentence;
      const words: string[] = [];

      for (let k = 0; k < wordCount; k++) {
        words.push(getRandomElement(data.words));
      }

      let sentence = noSpace ? words.join('') : words.join(' ');
      sentence = capitalizeFirst(sentence);

      // 마지막 문장은 항상 마침표로 끝남
      if (j === sentenceCount - 1) {
        sentence += noSpace ? '。' : '.';
      } else {
        // 중간 문장은 느낌표를 더 많이 사용
        const punctuationOptions = [...data.punctuation, '!', '!', '！', '！'];
        const punctuation = getRandomElement(punctuationOptions);
        sentence += punctuation;
      }

      sentences.push(sentence);
    }

    result.push(noSpace ? sentences.join('') : sentences.join(' '));
  }

  return result;
}

function generateLead(
  data: LoremData,
  paragraphs: number,
  minSentencesPerParagraph: number,
  maxSentencesPerParagraph: number,
  minWordsPerSentence: number,
  maxWordsPerSentence: number,
  noSpace: boolean = false
): string[] {
  const result: string[] = [];

  for (let i = 0; i < paragraphs; i++) {
    // 리드는 보통 1-2문장으로 구성
    const sentenceCount = Math.min(2, Math.floor(Math.random() * (maxSentencesPerParagraph - minSentencesPerParagraph + 1)) + minSentencesPerParagraph);
    const sentences: string[] = [];

    for (let j = 0; j < sentenceCount; j++) {
      // 리드는 중간 길이의 문장
      const wordCount = Math.floor(Math.random() * (maxWordsPerSentence - minWordsPerSentence + 1)) + minWordsPerSentence;
      const words: string[] = [];

      for (let k = 0; k < wordCount; k++) {
        words.push(getRandomElement(data.words));
      }

      let sentence = noSpace ? words.join('') : words.join(' ');
      sentence = capitalizeFirst(sentence);
      sentence += noSpace ? '。' : '.';

      sentences.push(sentence);
    }

    result.push(noSpace ? sentences.join('') : sentences.join(' '));
  }

  return result;
}