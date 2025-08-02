/**
 * Converts an object's fields to a Bloom filter map using BloomFilter.
 */
import { SearchBloom, SearchBloomOptions } from "./SearchBloom"; // <-- Import SearchBloom
import {
  extractNgramsFromObject,
} from "./extractNgramsFromObject";

export interface ObjectBloomOptions extends SearchBloomOptions {
  /**
   * When present, only these fields will be used to extract text for the Bloom filter.
   * If not present, all string fields will be used recursively.
   */
  fields?: string[];
}

export class ObjectBloom extends SearchBloom {
  private fields?: string[];

  constructor(options: ObjectBloomOptions = {}) {
    super({
      bloomBits: options.bloomBits,
      hashFunctions: options.hashFunctions,
      mode: options.mode,
      ngramSize: options.ngramSize ?? 3,
    });

    this.fields = options.fields;
  }

  /**
   * Generates a Bloom filter map for the object.
   */
  public addObject(obj: Record<string, any>): void {
    this.nGrams = extractNgramsFromObject(
      this.fields
        ? Object.fromEntries(this.fields.map((f) => [f, obj[f]]))
        : obj,
      { n: this.ngramSize }
    );
    this.nGrams.forEach((ngram) => this.add(ngram));
  }
}
