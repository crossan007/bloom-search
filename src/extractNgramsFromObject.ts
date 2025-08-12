export interface ExtractNgramsOptions {
  n: number;
  fields?: string[];
}

/**
 * Recursively extracts all unique n-grams of length `n` from specified string properties within a given object.
 *
 * @param obj - The input object to extract n-grams from.
 * @param options - Extraction options:
 *   - n: The length of each n-gram to extract.
 *   - fields?: Array of property paths (e.g., ["name", "address.city"]) to extract from. If omitted, all string properties are used.
 * @returns An array of all unique n-grams found in the specified string properties of the input object.
 */
export function extractNgramsFromObject(obj: any, options: ExtractNgramsOptions): string[] {
  const { n, fields } = options;
  const ngramSet = new Set<string>();
  const fieldSet = fields ? new Set(fields) : undefined;

  function shouldExtract(path: string) {
    return !fieldSet || path.length == 0 || fieldSet.has(path);
  }

  function shouldRecurse(path: string) {
    return path.length == 0 || fields?.some(field => field.startsWith(path)) || !fieldSet;
  }

  function recurse(value: any, path: string) {
    if (value && typeof value === 'object' && shouldRecurse(path)) {
      for (const key of Object.keys(value)) {
        const newPath = path ? `${path}.${key}` : key;
        recurse(value[key], newPath);
      }
    }

    if (!shouldExtract(path)) {
      return;
    }
  
    if (typeof value === 'string') {
      const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, ' ');
      for (let i = 0; i <= cleaned.length - n; i++) {
        ngramSet.add(cleaned.slice(i, i + n));
      }
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        recurse(value[i], path ? `${path}[${i}]` : `[${i}]`);
      }
    }
  }

  recurse(obj, '');
  return Array.from(ngramSet);
}