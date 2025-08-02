/**
 * Converts an object's fields to a Bloom filter map using BloomFilter.
 */

import { BloomFilter, BloomFilterMap, BloomFilterOptions } from './BloomFilter';

export interface ObjectBloomOptions extends BloomFilterOptions {
  /**
   * When present, only these fields will be used to extract text for the Bloom filter.
   * If not present, all string fields will be used.
   */
  fields?: string[];
}

export class ObjectBloom {
  private bloom: BloomFilter;
  private fields: string[];

  constructor(options: ObjectBloomOptions = {}) {
    this.bloom = new BloomFilter(options);
    this.fields = options.fields ?? [];
  }

  /**
   * Extracts and concatenates relevant fields from the object.
   */
  private extractText(obj: Record<string, any>): string {
    let text = '';
    for (const field of this.fields) {
      const value = obj[field];
      if (typeof value === 'string') {
        text += ' ' + value;
      } else if (Array.isArray(value)) {
        text += ' ' + value.join(' ');
      }
    }
    return text.trim();
  }

  /**
   * Generates a Bloom filter map for the object.
   */
  public bloomFromObject(obj: Record<string, any>): BloomFilterMap {
    const text = this.extractText(obj);
    return this.bloom.bloomFromString(text);
  }
}