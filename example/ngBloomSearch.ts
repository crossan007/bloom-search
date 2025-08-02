import { extractNgramsFromObject, BloomFilter, SearchBloom, BloomFilterMap } from '../src';

type DataItem = {
  id: number;
  name: string;
  email: string;
}

type BloomedDataItem = DataItem & {
  bloom: BloomFilterMap;
}
/**
 * Example usage of the bloom search library.
 * Demonstrates:
 * 1. Generating n-grams from a data set
 * 2. Creating a bloom filter map for each item
 * 3. Searching using the bloom filter maps
 */

// Example data set
const dataSet: BloomedDataItem[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', bloom: {}},
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', bloom: {} },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', bloom: {} }
];

// 1. Generate a common set of n-grams from the entire data set
let allNGrams: string[] = [];
dataSet.forEach(item => {
  const ngrams = extractNgramsFromObject(item, { n: 3 });
  allNGrams = [...new Set([...allNGrams, ...ngrams])];
});

// 2. Create a bloom filter map for each item

dataSet.forEach(item => {
  const ngrams = extractNgramsFromObject(item, { n: 3 });
  const bloom = new BloomFilter({ bloomBits: 32, hashFunctions: 2 }); // Increased bits for demo
  ngrams.forEach(ngram => {
    if (allNGrams.includes(ngram)) {
      bloom.add(ngram);
    }
  });
  item.bloom = bloom.toMap();
});

// 3. Search using the bloom filter maps
function search(query: string): DataItem[] {
  const queryNGrams = extractNgramsFromObject({ query }, { n: 3 });
  const searchBloom = new SearchBloom({ bloomBits: 32, hashFunctions: 2 });
  const queryBloom = searchBloom.bloomFromQuery(query);

  return dataSet.filter(item => BloomFilter.CompareMaps(item.bloom, queryBloom)).map(item => {
    const { bloom, ...rest } = item; // Exclude bloom from result
    return rest; // Return the item without the bloom filter
  });
}

// Example usage:
console.log('Search for "Alice":', search('Alice'));
console.log('Search for "bob@":', search('bob@'));
console.log('Search for "Charlie Brown":', search('Charlie Brown'));