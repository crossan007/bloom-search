import { extractNgramsFromObject } from './extractNgramsFromObject';
import { ObjectBloom } from './ObjectBloom';

describe('ObjectBloom', () => {
  const bloom = new ObjectBloom({
    ngramSize: 3,
    bloomBits: 512,
    hashFunctions: 2,
    fields: ['full_name', 'phone_number', 'tags']
  });

  it('extracts text from object fields and generates a Bloom filter', () => {
    const obj = {
      full_name: 'John Doe',
      phone_number: '1234567890',
      tags: ['vip', 'lead']
    };

    const objectNgrams = extractNgramsFromObject(obj, { n: 3 });

    bloom.addObject(obj);

    const map = bloom.toMap();
    expect(typeof map).toBe('object');
    expect(Object.values(map).every(v => v === 1)).toBe(true);
    // Check that all ngrams from the object are in the Bloom filter
    objectNgrams.forEach(ngram => {
      expect(bloom.has(ngram)).toBe(true);
    });
    // Check that unrelated ngrams are not in the Bloom filter
    expect(bloom.has('unrelated')).toBe(false);
  });
});