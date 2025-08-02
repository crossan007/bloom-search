import { extractNgramsFromObject, BloomFilter, ObjectBloom, SearchBloom } from '../src/index';

/**
 * This is an example of how to use the bloom search library.
 * 
 * This file is intended to demonstrate the usage of the BloomFilter, ObjectBloom, and SearchBloom classes.
 * 
 * 
 * Use our bloom search library to:
 * * Generate n-grams from a data set;  this should be saved and shared for use by both client and server;  it should be versioned as well
 * * create a bloom filter map for each item in the data set
 * * given a search query string, locte all matching items in the data set using the bloom filter map
 */

// Example data set
const dataSet = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' }
];


// 1. Generate a common set of n-grams from the entire data set
let allNGrams: string[] = [];
dataSet.forEach(item => {
  const ngrams = extractNgramsFromObject(item, 3);
  allNGrams = [...new Set([...allNGrams, ...ngrams])];
});


// 2. Iterate the entire data set 

// 3. Given a search query string, locate all matching items using the bloom filter map
function search(query: string): typeof dataSet {
  const queryNGrams = generateNGrams(query);
  return dataSet.filter(item => {
    const objectBloom = bloomMap[item.id];
    return queryNGrams.every(ngram => objectBloom.has(ngram));
  });
}

// Example usage:
console.log('Search for "Alice":', search('Alice'));
console.log('Search for "bob@":', search('bob@'));
console.log('Search for "Charlie Brown":', search('Charlie Brown'));