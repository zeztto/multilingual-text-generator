import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generateLoremIpsum, type Language, type TextType } from '../src/app/utils/loremGenerator.ts';

const options = {
  language: 'en' as Language, textType: 'prose' as TextType, paragraphs: 2,
  minSentencesPerParagraph: 2, maxSentencesPerParagraph: 2,
  minWordsPerSentence: 5, maxWordsPerSentence: 5,
};

test('English uses English words rather than the legacy Latin corpus', () => {
  const original = Math.random;
  Math.random = () => 0;
  try { assert.match(generateLoremIpsum(options), /^Design design design design design/); }
  finally { Math.random = original; }
});

test('copy respects the requested minimum word count', () => {
  const original = Math.random;
  Math.random = () => 0;
  try {
    const text = generateLoremIpsum({ ...options, paragraphs: 1, textType: 'copy', minSentencesPerParagraph: 1, maxSentencesPerParagraph: 1 });
    assert.equal(text.trim().split(/\s+/).length, 5);
  } finally { Math.random = original; }
});

for (const language of ['ko','en','es','fr','de','la','ru','ja','zh','vi','th'] as Language[]) {
  for (const textType of ['prose','poetry','copy','lead'] as TextType[]) {
    test(`${language}/${textType} returns bounded text`, () => {
      const text = generateLoremIpsum({ ...options, language, textType, characterCount: 80 });
      assert.ok(text.length > 0 && text.length <= 80);
      assert.ok(!text.includes('undefined'));
      if (['ja','zh','th'].includes(language)) assert.ok(!text.includes(' '));
    });
  }
}
