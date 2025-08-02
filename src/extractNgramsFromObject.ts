/**
 * Recursively extracts all n-grams of length `n` from every string property within a given object.
 *
 * An n-gram is a contiguous sequence of `n` characters extracted from a string. This function traverses
 * the input object, including nested arrays and objects, and collects all possible n-grams from every string
 * value it encounters. Non-alphanumeric characters in strings are replaced with spaces before n-gram extraction,
 * and all characters are converted to lowercase.
 *
 * @param obj - The input object to extract n-grams from. Can contain nested objects and arrays.
 * @param n - The length of each n-gram to extract. For example, if `n` is 3, the function extracts trigrams.
 * @returns An array of all n-grams found in the string properties of the input object.
 */
export function extractNgramsFromObject(obj: any, n: number): string[] {
  const ngrams: string[] = [];

  function recurse(value: any) {
    if (typeof value === 'string') {
      const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, ' ');
      for (let i = 0; i <= cleaned.length - n; i++) {
        ngrams.push(cleaned.slice(i, i + n));
      }
    } else if (Array.isArray(value)) {
      for (const item of value) {
        recurse(item);
      }
    } else if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
        recurse(value[key]);
      }
    }
  }

  recurse(obj);
  return ngrams;
}