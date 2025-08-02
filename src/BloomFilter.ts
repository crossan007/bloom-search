/**
 * Bloom filter operations: n-gram extraction, hashing, and filter creation.
 */

export interface BloomFilterMap {
  [bit: number]: 0 | 1;
}

export interface BloomFilterOptions {
  ngramSize?: number;
  bloomBits?: number;
  hashFunctions?: number;
}

export class BloomFilter {
  private ngramSize: number;
  private bloomBits: number;
  private hashFunctions: number;

  constructor(options: BloomFilterOptions = {}) {
    this.ngramSize = options.ngramSize ?? 3;
    this.bloomBits = options.bloomBits ?? 128;
    this.hashFunctions = options.hashFunctions ?? 4;
  }

  /**
   * Generate n-grams from a string.
   */
  ngrams(text: string): string[] {
    const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    const grams: string[] = [];
    for (let i = 0; i <= cleaned.length - this.ngramSize; i++) {
      grams.push(cleaned.slice(i, i + this.ngramSize));
    }
    return grams;
  }

  /**
   * Simple hash function using a seed.
   */
  private hash(str: string, seed: number): number {
    let hash = seed;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i) + seed;
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % this.bloomBits;
  }

  /**
   * Hash n-grams into a Bloom filter map.
   */
  hashNgrams(ngramsArr: string[]): BloomFilterMap {
    const map: BloomFilterMap = {};
    for (const gram of ngramsArr) {
      for (let k = 0; k < this.hashFunctions; k++) {
        const bit = this.hash(gram, k);
        map[bit] = 1;
      }
    }
    return map;
  }

  /**
   * Generate a Bloom filter map from a string.
   */
  bloomFromString(text: string): BloomFilterMap {
    return this.hashNgrams(this.ngrams(text));
  }
}