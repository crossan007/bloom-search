import { extractNgramsFromObject } from './extractNgramsFromObject';

describe('extractNgramsFromObject', () => {
  it('extracts n-grams from flat string properties', () => {
    const obj = { name: 'Alice', city: 'Paris' };
    const result = extractNgramsFromObject(obj, 3);
    expect(result).toContain('ali');
    expect(result).toContain('lic');
    expect(result).toContain('ice');
    expect(result).toContain('par');
    expect(result).toContain('ari');
    expect(result).toContain('ris');
  });

  it('extracts n-grams from nested objects', () => {
    const obj = { user: { info: { bio: 'Hello' } } };
    const result = extractNgramsFromObject(obj, 2);
    expect(result).toContain('he');
    expect(result).toContain('el');
    expect(result).toContain('ll');
    expect(result).toContain('lo');
  });

  it('extracts n-grams from arrays of strings', () => {
    const obj = { tags: ['foo', 'bar'] };
    const result = extractNgramsFromObject(obj, 2);
    expect(result).toContain('fo');
    expect(result).toContain('oo');
    expect(result).toContain('ba');
    expect(result).toContain('ar');
  });

  it('ignores non-string properties', () => {
    const obj = { count: 42, valid: true, nested: { date: new Date() } };
    const result = extractNgramsFromObject(obj, 2);
    expect(result.length).toBe(0);
  });

  it('handles empty objects', () => {
    const obj = {};
    const result = extractNgramsFromObject(obj, 3);
    expect(result.length).toBe(0);
  });
});