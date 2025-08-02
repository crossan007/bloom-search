import { murmurhash3_32_gc } from './MurMurHash';

describe('murmurhash3_32_gc', () => {
  it('returns consistent hash for the same input and seed', () => {
    const str = 'hello world';
    const seed = 42;
    const hash1 = murmurhash3_32_gc(str, seed);
    const hash2 = murmurhash3_32_gc(str, seed);
    expect(hash1).toBe(hash2);
  });

  it('returns different hashes for different seeds', () => {
    const str = 'hello world';
    const hash1 = murmurhash3_32_gc(str, 1);
    const hash2 = murmurhash3_32_gc(str, 2);
    expect(hash1).not.toBe(hash2);
  });

  it('returns different hashes for different strings', () => {
    const seed = 123;
    const hash1 = murmurhash3_32_gc('foo', seed);
    const hash2 = murmurhash3_32_gc('bar', seed);
    expect(hash1).not.toBe(hash2);
  });

  it('returns a 32-bit unsigned integer', () => {
    const hash = murmurhash3_32_gc('test', 0);
    expect(hash).toBeGreaterThanOrEqual(0);
    expect(hash).toBeLessThanOrEqual(0xFFFFFFFF);
  });

  describe('returns known values for known inputs (Wikipedia test vectors)', () => {
    /**
     * Sourced from: https://en.wikipedia.org/wiki/MurmurHash
     */
    const vectors: [string, number, number][] = [
      ["", 0x00000000, 0x00000000],
      ["", 0x00000001, 0x514E28B7],
      ["", 0xffffffff, 0x81F16F39],
      ["test", 0x00000000, 0xba6bd213],
      ["test", 0x9747b28c, 0x704b81dc],
      ["Hello, world!", 0x00000000, 0xc0363e43],
      ["Hello, world!", 0x9747b28c, 0x24884cba],
      ["The quick brown fox jumps over the lazy dog", 0x00000000, 0x2e4ff723],
      ["The quick brown fox jumps over the lazy dog", 0x9747b28c, 0x2fa826cd],
    ];
    it.each(vectors)('hash("%s", %d) === 0x%s', (input, seed, expected) => {
        expect(murmurhash3_32_gc(input, seed)).toBe(expected);
      }
    );
  });
});