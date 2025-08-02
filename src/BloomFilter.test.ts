import { BloomFilter } from './BloomFilter';

describe('BloomFilter', () => {
  const bloom = new BloomFilter({ ngramSize: 3, bloomBits: 16, hashFunctions: 2 });

  it('generates correct n-grams', () => {
    expect(bloom.ngrams('test')).toEqual(['tes', 'est']);
    expect(bloom.ngrams('abc')).toEqual(['abc']);
    expect(bloom.ngrams('ab')).toEqual([]);
  });

  it('hashes n-grams into a Bloom filter map', () => {
    const ngrams = bloom.ngrams('test');
    const map = bloom.hashNgrams(ngrams);
    expect(typeof map).toBe('object');
    expect(Object.values(map).every(v => v === 1)).toBe(true);
    expect(Object.keys(map).length).toBeGreaterThan(0);
  });

  it('bloomFromString returns a Bloom filter map', () => {
    const map = bloom.bloomFromString('hello');
    expect(typeof map).toBe('object');
    expect(Object.values(map).every(v => v === 1)).toBe(true);
  });
});