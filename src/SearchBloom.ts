/**
 * Utilities for generating a Bloom filter map from a search query string.
 */

import {
  BloomFilter,
  BloomFilterOptions,
} from "./BloomFilter";
import { extractNgramsFromObject } from "./extractNgramsFromObject";

export interface SearchBloomOptions extends BloomFilterOptions {
  ngramSize?: number;
}

export class SearchBloom extends BloomFilter {
  protected ngramSize: number;
  public nGrams: string[] = [];

  constructor(options: SearchBloomOptions = {}) {
    super({
      bloomBits: options.bloomBits,
      hashFunctions: options.hashFunctions,
      mode: options.mode,
    });

    this.ngramSize = options.ngramSize ?? 3;
  }

  /**
   * Adds all n-grams from the string to the Bloom filter.
   */
  public addString(search: string): void {
    this.nGrams = extractNgramsFromObject({ search }, { n: this.ngramSize });
    this.nGrams.forEach((ngram) => this.add(ngram));
  }
}
