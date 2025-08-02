import { BloomFilter } from './BloomFilter';

describe('BloomFilter', () => {
  it('adds and checks items correctly', () => {
    const bloom = new BloomFilter({ bloomBits: 16, hashFunctions: 2 });
    //@ts-ignore
    bloom.add('apple');
    //@ts-ignore
    bloom.add('banana');

    expect(bloom.has('apple')).toBe(true);
    expect(bloom.has('banana')).toBe(true);
    // False positives possible, but unlikely for unrelated string
    expect(bloom.has('carrot')).toBe(false);
  });

  it('exports and imports as a map', () => {
    const bloom = new BloomFilter({ bloomBits: 16, hashFunctions: 2 });
    //@ts-ignore
    bloom.add('test');
    const map = bloom.toMap();

    const restored = BloomFilter.fromMap(map, { bloomBits: 16, hashFunctions: 2 });
    expect(restored.has('test')).toBe(true);
    expect(restored.has('other')).toBe(false);
  });
});