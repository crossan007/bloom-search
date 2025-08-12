import { murmurhash3_32_gc } from './MurMurHash';

export type CountingBloomFilterMap = { [bit: number]: number };
export type StandardBloomFilterMap = { [bit: number]: boolean };

export type BloomMode = "counting" | "standard";

export interface BloomFilterOptions {
  bloomBits?: number;
  hashFunctions?: number;
  mode?: BloomMode;
}

export class BloomFilter<T extends BloomMode = "standard"> {
  private bloomBits: number;
  private hashFunctions: number;
  private bits: T extends "counting" ? Map<number, number> : Map<number, boolean>;
  private mode: T;

  constructor(options: BloomFilterOptions = {}) {
    this.bloomBits = options.bloomBits ?? 128;
    this.hashFunctions = options.hashFunctions ?? 4;
    this.mode = (options.mode ?? "standard") as T;
    this.bits = (this.mode === "counting"
      ? new Map<number, number>()
      : new Map<number, boolean>()) as T extends "counting" ? Map<number, number> : Map<number, boolean>;
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
      if (this.mode === "counting") {
        const bits = this.bits as Map<number, number>;
        bits.set(bit, (bits.get(bit) ?? 0) + 1);
      } else {
        const bits = this.bits as Map<number, boolean>;
        bits.set(bit, true);
      }
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
  toMap(): T extends "counting" ? CountingBloomFilterMap : StandardBloomFilterMap {
    const map: any = {};
    if (this.mode === "counting") {
      for (const [bit, count] of (this.bits as Map<number, number>).entries()) {
        map[bit] = count;
      }
    } else {
      for (const [bit] of (this.bits as Map<number, boolean>).entries()) {
        map[bit] = true;
      }
    }
    return map;
  }

  /**
   * Load a Bloom filter from a map.
   */
  static fromMap<T extends BloomMode>(map: T extends "counting" ? CountingBloomFilterMap : StandardBloomFilterMap, options: BloomFilterOptions = {}): BloomFilter<T> {
    const filter = new BloomFilter<T>(options);
    for (const bitStr of Object.keys(map)) {
      (filter.bits as any).set(Number(bitStr), map[Number(bitStr)]);
    }
    return filter;
  }

  public static CompareMaps(haystack: CountingBloomFilterMap, needle: CountingBloomFilterMap): boolean {
    for (const bit in needle) {
      if (!haystack[bit] || haystack[bit] < needle[bit]) {
        return false; // If any bit in needle is not present or less than required, return false
      }
    }
    // If all bits in needle are found in haystack with sufficient count, return true 
    return true;
  }
}