import { murmurhash3_32_gc } from './MurMurHash';

export type BloomFilterMap = { [bit: number]: number };

type BloomMode = "counting" | "standard";

export interface BloomFilterOptions {
  bloomBits?: number;
  hashFunctions?: number;
  mode?: BloomMode;
}

export class BloomFilter {
  private bloomBits: number;
  private hashFunctions: number;
  private bits: Map<number, number>; // <-- FIXED
  private mode: BloomMode;

  constructor(options: BloomFilterOptions = {}) {
    this.bloomBits = options.bloomBits ?? 128;
    this.hashFunctions = options.hashFunctions ?? 4;
    this.bits = new Map<number, number>(); // <-- FIXED
    this.mode = options.mode ?? "standard";
  }

  /**
   * Simple hash function using a seed.
   */
  private hash(str: string, seed: number): number {
    return murmurhash3_32_gc(str, seed) % this.bloomBits;
  }

  /**
   * Add an item (string) to the Bloom filter.
   */
  protected add(item: string): void {
    for (let k = 0; k < this.hashFunctions; k++) {
      const bit = this.hash(item, k);
      this.bits.set(bit, (this.bits.get(bit) ?? 0) + 1);
    }
  }

  /**
   * Check if an item (string) is possibly in the Bloom filter.
   */
  has(item: string): boolean {
    for (let k = 0; k < this.hashFunctions; k++) {
      const bit = this.hash(item, k);
      if (!this.bits.has(bit)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Export the Bloom filter as a map (for Firestore or serialization).
   */
  toMap(): BloomFilterMap {
    const map: { [bit: number]: number } = {};
    for (const [bit, count] of this.bits.entries()) {
      map[bit] = this.mode == "counting" ? count : 1;
    }
    return map;
  }

  /**
   * Load a Bloom filter from a map.
   */
  static fromMap(map: BloomFilterMap, options: BloomFilterOptions = {}): BloomFilter {
    const filter = new BloomFilter(options);
    for (const bitStr of Object.keys(map)) {
      filter.bits.set(Number(bitStr), map[Number(bitStr)]);
    }
    return filter;
  }

  public static CompareMaps(haystack: BloomFilterMap, needle: BloomFilterMap): boolean {
    for (const bit in needle) {
      if (!haystack[bit] || haystack[bit] < needle[bit]) {
        return false; // If any bit in needle is not present or less than required, return false
      }
    }
    // If all bits in needle are found in haystack with sufficient count, return true 
    return true;
  }
}