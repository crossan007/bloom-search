# Bloom Search

Bloom Search is a set of utilities for generating [Bloom Filters](https://en.wikipedia.org/wiki/Bloom_filter) on strings and objects.

This facilitates probabilistic testing of whether an object satisfies a search query.

## What is a Bloom Filter?

A Bloom Filter is a space-efficient probabilistic data structure used to test whether an element is a member of a set. False positives are possible, but false negatives are not. This means it can quickly tell you if an item is definitely not in a set, or possibly in a set.

## Getting Started

Install with npm:

```bash
npm install @crossan007/bloom-search
```

Import and use:

```typescript
import { BloomFilter } from "@crossan007/bloom-search";
```

## Firebase Firestore Partial Text Searching

It's no secret that Firestore [does not have full text search](https://firebase.google.com/docs/firestore/solutions/search); the official documentation offers this:

> To enable full text search of your Cloud Firestore data, use a dedicated third-party search service. These services provide advanced indexing and search capabilities far beyond what any simple database query can offer.

Instead of investing in this extra infrastructure, I decided to take a different path.

Many others have tried to solve this problem using a variety of techniques

- Storing keywords or n-grams on documents and querying with "Array-contains"
  - https://medium.com/@ken11zer01/firebase-firestore-text-search-and-pagination-91a0df8131ef
- Cleverly using string inequality operators
  - https://stackoverflow.com/a/61516548

I decided to take a different (somewhat combined) approach:

### Indexing setup

For each document, use the Bloom Filter algorithm to create a bit array that represents all desired attributes of the document

Store the bit array on the document as a [Firestore "map"](https://firebase.google.com/docs/firestore/manage-data/data-types#data_types)

 - The bit index becomes the map key
 - Bit indices are zero-based; the Firestore map stores only the indices of bits set to `true`
   - For example, the bit array `001001` would translate to `{2: true, 5:true}`
   - [Firestore automatically generates an index for single-value fields](https://firebase.google.com/docs/firestore/query-data/index-overview#automatic_indexing), so there is no need to create composite indexes in order to query.

### Querying

For any given query string (or search object), use the Bloom Filter algorithm to create a bit array that represents the query

Transform the resulting bit array into a Firestore `where` clause; again only searching for bits that are `true`

```
where("bloom.1", "==", true).where("bloom.7", "==", true)...
```

The returned documents will include false positives which may be filtered out on the client.

> Each `where` clause matches a document with the corresponding Bloom bit set. The more bits you query, the more specific (but also more restrictive) your search.

### Usage Example

#### Setting Bloom bits on documents

```typescript
import { ObjectBloom } from "bloom-search";

// Example document to index
const doc = {
  title: "Bloom Search Example",
  description:
    "Demonstrates Firestore partial text search using Bloom Filters.",
  PrimaryRelatedGUID: "69ef77fe-1899-4849-b98d-e042616e1d81",
};

// Create a Bloom Filter for the document's searchable fields
const bloom = new ObjectBloom({
  bloomBits: 768,
  hashFunctions: 1,
  ngramSize: 3,
  fields: ["title", "description"],
});

bloom.addObject(doc);

return {
  ...doc,
  bloom: bloom.toMap(),
};
```

#### Querying for documents

`FIRESTORE_MAX_WHERE_CLAUSES` is currently `100`: https://firebase.google.com/docs/firestore/query-data/queries#query_limitations

```typescript
import { SearchBloom } from 'bloom-search';

// Create a Bloom Filter for a string
const filter = new SearchBloom({ bloomBits: 768, hashFunctions: 1, ngramSize: 3 });
filter.add('searchable text');
let positiveBits = Object.keys(filter.toMap()).map((bit) => parseInt(bit, 10));

if (positiveBits.length === 0) {
  // bad query; don't run it
  throw new Error("...");
}
if (positiveBits.length > FIRESTORE_MAX_WHERE_CLAUSES) {
  // The query produced more positive bits than the maximum where clauses allowed by Firestore
}

let qConstraints: QueryConstraint[] = [];
qConstraints = positiveBits.map(bit=>
  where(`bloom.${bit}`, '==', true))

return qConstraints;
````

## Limitations

- Bloom Filters may return false positives, so additional client-side filtering is recommended.
- This approach is best for partial text search and may not be suitable for exact or phrase matching.
- Firestore query limitations still apply (e.g., maximum number of `where` clauses).

## License

MIT
