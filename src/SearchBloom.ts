/**
 * Utilities for generating a Bloom filter map from a search query string.
 */

import { BloomFilter, BloomFilterMap, BloomFilterOptions } from './BloomFilter';

export class SearchBloom {
  private bloom: BloomFilter;

  constructor(options: BloomFilterOptions = {}) {
    this.bloom = new BloomFilter(options);
  }

  /**
   * Generates a Bloom filter map from a search query string.
   */
  bloomFromQuery(query: string): BloomFilterMap {
    return this.bloom.bloomFromString(query);
  }
}