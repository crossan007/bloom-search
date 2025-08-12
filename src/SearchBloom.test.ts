import { SearchBloom } from './SearchBloom';

describe('SearchBloom', () => {
  it('generates a Bloom filter map from a query string', () => {
    const bloom = new SearchBloom({ ngramSize: 3, bloomBits: 16, hashFunctions: 2 });
    bloom.addString('search');
    const map = bloom.toMap();
    expect(typeof map).toBe('object');
    expect(Object.keys(map).length).toBeGreaterThan(0);
    // All values should be >= 1 (counting bloom filter)
    expect(Object.values(map).every(v => typeof v === 'number' ? v >= 1 : v === true)).toBe(true);
  });

  it('addString mutates the filter and toMap reflects the change', () => {
    const bloom = new SearchBloom({ ngramSize: 3, bloomBits: 16, hashFunctions: 2 });
    bloom.addString('search');
    const map = bloom.toMap();
    expect(Object.keys(map).length).toBeGreaterThan(0);
    expect(Object.values(map).every(v => typeof v === 'number' ? v >= 1 : v === true)).toBe(true);
  });
});