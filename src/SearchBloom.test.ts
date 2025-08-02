import { SearchBloom } from './SearchBloom';

describe('SearchBloom', () => {
  const bloom = new SearchBloom({ ngramSize: 3, bloomBits: 16, hashFunctions: 2 });

  it('generates a Bloom filter map from a query string', () => {
    const map = bloom.bloomFromQuery('search');
    expect(typeof map).toBe('object');
    expect(Object.values(map).every(v => v === 1)).toBe(true);
    expect(Object.keys(map).length).toBeGreaterThan(0);
  });
});