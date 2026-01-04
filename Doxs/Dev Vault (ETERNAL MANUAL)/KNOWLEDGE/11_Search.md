# 11_SEARCH.MD: THE TITAN GUIDE (50K TARGET)

## TABLE OF CONTENTS

- [Production-Grade Elasticsearch, Vector Search, and RAG](#production-grade-elasticsearch-vector-search-and-rag)
- [VOLUME 1: THE SCARS (The "Why")](#volume-1-the-scars-the-why)
- [VOLUME 2: THE FOUNDATION (The "What")](#volume-2-the-foundation-the-what)
- [VOLUME 3: THE DEEP DIVE (The "How")](#volume-3-the-deep-dive-the-how)
- [VOLUME 4: THE EXPERT (The "Scale")](#volume-4-the-expert-the-scale)
- [VOLUME 5: THE TITAN (The "Kernel")](#volume-5-the-titan-the-kernel)
- [VOLUME 6: THE INFINITE (The "Future")](#volume-6-the-infinite-the-future)
- [Data Loss](#data-loss)

---


---


---


---

> **?? Disclaimer**: This is educational content synthesized from industry best practices and publicly available documentation. Case studies are illustrative examples for teaching purposes. Last updated: December 2024.

### Production-Grade Elasticsearch, Vector Search, and RAG

> **Status**: UNIVERSAL DOMAIN (01-13)
> **Target**: 25,000 Lines
> **Coverage**: BM25, Vector Embeddings, HNSW, Learning to Rank
> **Last Updated**: December 24, 2024

---

## VOLUME 1: THE SCARS (The "Why")

*Real-world horror stories and billion-dollar failures.*

1. The "Elasticsearch Split Brain" - Data Loss
2. The "Mapping Explosion" - Too Many Fields
3. The "Deep Pagination" - Killing the Cluster (From + Size)
4. The "GC Pause" - Stop-the-World Events

## VOLUME 2: THE FOUNDATION (The "What")

*Production-grade basics. No "Hello World".*

1. Inverted Index (The Core Data Structure)
2. TF-IDF & BM25 (Relevance Scoring Math)
3. Analyzers & Tokenizers (N-Grams, Stemming)
4. Sharding & Replication Strategies

## VOLUME 3: THE DEEP DIVE (The "How")

*Advanced engineering and optimization.*

1. Vector Search (Embeddings & Cosine Similarity)
2. Hybrid Search (Keyword + Vector Fusion)
3. RAG (Retrieval Augmented Generation) Architecture
4. Synonyms & Query Expansion

## VOLUME 4: THE EXPERT (The "Scale")

*Distributed systems and high-scale patterns.*

1. Learning to Rank (LTR) - AI Re-ranking
2. Geospatial Indexing (Quadtrees/Geohash)
3. Federated Search (Cross-Cluster)

## VOLUME 5: THE TITAN (The "Kernel")

*Low-level internals and custom engines.*

1. HNSW Internals (Hierarchical Navigable Small World)
2. Lucene Segment Merging & Codecs
3. Custom Scoring Scripts (Painless)

## VOLUME 6: THE INFINITE (The "Future")

*Experimental tech and "Meta-Beating" research.*

1. Neural Search (End-to-End Differentiable)
2. Multimodal Search (Image/Audio/Video)
3. Zero-Shot Retrieval

---

### Data Loss

**The Context**:
An Elasticsearch cluster with 2 Master-eligible nodes. A network partition occurs.
**The Error**:
Node A thinks Node B is dead. Node B thinks Node A is dead.
Both elect themselves as Master. Both accept writes.
**The Result**:
Two divergent versions of the index. Impossible to merge automatically. Data loss.
**The Fix**:
**Quorum**. `discovery.zen.minimum_master_nodes = N/2 + 1`.
In modern ES (7+), this is handled automatically, but configuration errors still cause it.

---

#### Killing the Cluster

**The Context**:
A user requests Page 10,000 of search results.
**The Error**:
`GET /_search?from=100000&size=10`.
**The Internals**:
Elasticsearch is distributed. It must fetch the top 100,010 documents from *every shard*, bring them to the coordinating node, sort them in memory, and discard the first 100,000.
**The Result**:
Massive Heap usage. Garbage Collection storm. Cluster crash (OOM).
**The Fix**:
**Search After**. Use a cursor (sort value of the last result) to fetch the next page efficiently.

---

##### The Core

**Concept**:
Like the index at the back of a book.
Map: `Term -> [Document IDs]`

**Example**:
Doc 1: "Apple Banana"
Doc 2: "Banana Cherry"

**Index**:
"Apple" -> [1]
"Banana" -> [1, 2]
"Cherry" -> [2]

**Search**: "Apple AND Banana"
Intersection of [1] and [1, 2] = [1]. O(1) complexity.

---

##### Relevance Scoring

**TF (Term Frequency)**: How often does the word appear in this doc? (More is better).
**IDF (Inverse Document Frequency)**: How rare is the word across all docs? (Rarer is better).

- "The" appears everywhere -> Low IDF -> Low score.

- "Quantum" appears rarely -> High IDF -> High score.

**BM25 (Best Matching 25)**:
The modern standard. Unlike raw TF-IDF, it saturates TF.

- Mentioning "Quantum" 100 times is not 100x better than mentioning it 10 times.

---

##### Embeddings

**Concept**:
Keyword search fails on synonyms ("Car" vs "Automobile").
Vector search maps text to a 1536-dimensional array of numbers (Embedding).
Semantically similar words are close in vector space.
"King" - "Man" + "Woman" "Queen".

**Search**:
**Cosine Similarity**. Calculate the angle between the Query Vector and Document Vectors.
**Dot Product**. Faster, but requires normalized vectors.

**Implementation (Elasticsearch)**:

```json
PUT my-index
{
"mappings": {
"properties": {
"my_vector": {
"type": "dense_vector",
"dims": 1536,
"index": true,
"similarity": "cosine"
      }
    }
  }
}

```text

---

- Sentence transformers: all-MiniLM, BGE

- OpenAI: text-embedding-3-small/large

- Cohere: embed-v3, multilingual

- Dimensionality: 384, 768, 1536
- Normalization: L2, cosine

##### Context for LLMs

**The Problem**:
LLMs hallucinate. They don't know your private data.
**The Solution**:

1. **Retrieve**: Search Elasticsearch for the top 5 documents relevant to the user's question.
2. **Augment**: Paste these documents into the LLM prompt.
- "Context: [Doc 1 text] [Doc 2 text]..."
- "Question: How do I reset my password?"
3. **Generate**: LLM answers using *only* the context provided.

---

##### AI Re-ranking

**Concept**:
Elasticsearch gives you a "good enough" top 100.
LTR uses a Machine Learning model (XGBoost) to re-order those top 100 based on user behavior (clicks, conversions).
**Features**:

- Document Score (BM25).

- Document Freshness (Date).

- User History (Did they click this category before?).

**Architecture**:

1. **L1 Ranker**: Elasticsearch (Fast, retrieves 100 docs).
2. **L2 Ranker**: XGBoost Model (Slower, re-ranks 100 docs).

---

##### Quadtrees & Geohashes

**Geohash**:
Encodes Lat/Lon into a string.
`u4pruydqqvj` -> Buckingham Palace.
`u4pru` -> London Area.
**Prefix Search**:
Searching for `u4pru*` finds everything in London.
**Quadtree**:
Recursively divides the map into 4 quadrants.
Efficient for "Find points within Polygon".

---

##### Hierarchical Navigable Small World

**The Problem**:
Comparing a query vector to 1 Billion document vectors (k-NN) is too slow (O(N)).
**The Solution**:
**HNSW Graph**.

- **Layers**: Like a skip list. Top layer has long links (Highways). Bottom layer has short links (Local roads).

- **Search**: Start at top layer. Zoom in to the target neighborhood. Descend to lower layers for precision.

- **Complexity**: O(log N).

**Tradeoff**:
High memory usage (stores the graph structure). Slow indexing (building the graph).

---

##### Immutable Logs

**Concept**:
An Elasticsearch Shard is a Lucene Index.
A Lucene Index is a collection of **Segments**.
A Segment is **Immutable**.
**Writes**:

1. New document -> Memory Buffer.
2. Buffer full -> Flushed to new Segment on disk.
3. **Deletion**: Mark as deleted in a `.del` file (Tombstone). Document still exists but is ignored.
4. **Merging**: Background process merges small segments into big ones and *physically removes* deleted docs.

**Titan Tip**:
Merging is CPU/IO intensive. Disable merging during bulk indexing.

---

##### End-to-End Differentiable

**Concept**:
No more Inverted Index. No more BM25.
The *entire* retrieval process is a single Neural Network.
**Differentiable Search Index (DSI)**:
A Transformer model that maps `Query -> DocID` directly.
Like memorizing the entire corpus in the model weights.

---

#### A. THE ULTIMATE MAPPING TEMPLATE

Dynamic templates to prevent mapping explosions.

```json
{
"index_patterns": ["logs-*"],
"mappings": {
"dynamic_templates": [
      {
"strings_as_keywords": {
"match_mapping_type": "string",
"mapping": {
"type": "keyword",
"ignore_above": 256
        }
        }
      }
    ]
  }
}

```text

#### B. THE SEARCH RELEVANCE CHECKLIST

1. **Recall**: Did we find the right docs? (Fix: Synonyms, Stemming).
2. **Precision**: Did we show garbage? (Fix: Stopwords, Min Should Match).
3. **Ranking**: Is the best doc #1? (Fix: Boosting, LTR).
4. **Speed**: Is it < 100ms? (Fix: Caching, Sharding).

---

#### Each line = 100x LLM expansion potential

---

## INFORMATION RETRIEVAL

- Inverted index: mapping, postings list

- TF-IDF: term frequency, inverse document frequency

- BM25: Okapi, k1, b parameters, saturation

- Tokenization: whitespace, Unicode, n-grams

- Stemming: Porter, Snowball, Hunspell

- Lemmatization: WordNet, morphological analysis

- Stopwords: language-specific, domain-specific

- Synonyms: expand query, WordNet, custom

## ELASTICSEARCH

- Cluster: nodes, shards, replicas

- Indexing: mappings, analyzers, dynamic templates

- Queries: match, term, bool, range, nested

- Aggregations: bucket, metric, pipeline

- Relevance: function_score, boosting, decay

- Percolator: reverse search, alerts

- Cross-cluster search: remote clusters, CCS

- ILM: index lifecycle, hot-warm-cold

## VECTOR SEARCH

- Embeddings: dense vectors, sentence transformers

- ANN: approximate nearest neighbor, recall

- HNSW: hierarchical, small world graphs

- IVF: inverted file, Voronoi partitioning

- PQ: product quantization, compression

- ScaNN: Google, learned quantization

- Hybrid: keyword + vector, RRF fusion

- Reranking: cross-encoder, second stage

- ANN: approximate nearest neighbor

- HNSW: graph-based, M, efConstruction

- IVF: inverted file, nprobe

- Product quantization: compression

- Hybrid: dense + sparse

## RANKING

- BM25: lexical baseline, tunable

- Learning to Rank: XGBoost, LambdaMART, NDCG

- Neural ranking: BERT reranker, ColBERT

- Feature engineering: recency, popularity, CTR

- Diversity: MMR, avoid redundancy

- Personalization: user history, collaborative filtering

- A/B testing: online evaluation, interleaving

## GEO SEARCH

- Geohash: spatial encoding, prefix matching

- R-tree: bounding box, spatial index

- Quadtree: recursive subdivision

- H3: Uber, hexagonal grid, hierarchical

- Distance: Haversine, geodesic, bounding box filter

- Geo aggregations: geo_bounds, geo_centroid

## NLP PIPELINE

- Tokenization: subword (BPE, WordPiece, SentencePiece)

- Named entity recognition: spaCy, Flair

- POS tagging: dependency parsing

- Sentiment: classification, aspect-based

- Language detection: fastText, langdetect

- Spell correction: Hunspell, SymSpell, neural

## AUTOCOMPLETE

- Prefix tree: trie, radix tree

- Completion suggester: Elasticsearch, weighted

- Fuzzy matching: Levenshtein, Damerau

- Query suggestion: collaborative, reformulation

- Search-as-you-type: instant results

## PERFORMANCE

- Caching: result cache, filter cache

- Sharding: horizontal scaling, shard sizing

- Routing: custom routing, colocation

- Warm-up: preload data, search warmers

- Doc values: columnar, aggregations

- Concurrency: thread pools, rejections

---

- Caching: frequent queries

- Lazy loading: on focus

- Client-side: local filter

- Pagination: top N results

- Prefetch: hot queries

---

- Pre-aggregation: materialized

- Selective: most useful

- Lazy load: expand on demand

- Cache: frequent combinations

- Approximate: faster counts

---

### END OF KEYWORD REFERENCE

---

### Reranking

- Cross-encoder: query-document pairs

- Cohere Rerank: API

- ColBERT: late interaction

- Reciprocal rank fusion: RRF

- Two-stage: retrieve then rerank

---

### Relevance

- Precision: relevant / retrieved

- Recall: relevant retrieved / total relevant

- F1 score: harmonic mean

- nDCG: normalized discounted cumulative gain

- MRR: mean reciprocal rank

### User Behavior

- CTR: click-through rate

- Session success rate

- Time to click

- Zero results rate

- Query reformulation

### A/B Testing

- Interleaving: fair comparison

- Credit assignment: position bias

- Statistical significance: t-test

- Sample size: power analysis

- Guardrail metrics: engagement

---

### Indexing Pipeline

- Crawling: incremental, full

- Parsing: extraction, cleaning

- Enrichment: NLP, ML

- Batching: bulk API

- Queuing: Kafka, RabbitMQ

### Query Pipeline

- Query understanding: intent, entities

- Query rewriting: expansion, correction

- Personalization: user signals

- Filtering: facets, constraints

- Aggregations: analytics

### Scaling

- Shard sizing: 10-50GB optimal

- Replica count: availability, throughput

- Capacity planning: QPS, storage

- Index lifecycle: hot-warm-cold

- Cross-cluster: CCS/CCR

---

#### END OF MEGA SEARCH EXPANSION

---

### Types

- Prefix: starts with query

- Infix: contains query

- Fuzzy: typo tolerance

- Contextual: user history

- Trending: popular queries

### Implementation

- Completion suggester: Elasticsearch

- Edge n-grams: tokenization

- Finite state transducer: Lucene

- Trie: data structure

- Redis: sorted sets

- Aggregations: Elasticsearch

- Global: independent of query

- Filter: applied to results

- Post-filter: after aggregation

- Cardinality: unique counts

- Feature store: user features

- Real-time: streaming

- Batch: nightly processing

- A/B testing: experimentation

- Cold start: new users

### UX

- Debounce: delay requests

- Highlight: matching portion

- Keyboard navigation: arrows

- Mobile: touch-friendly

- Analytics: click tracking

### Facet Types

- Terms: categorical values

- Range: numeric ranges

- Date histogram: time buckets

- Geo distance: location rings

- Nested: hierarchical

### UX Patterns

- Multi-select: OR within facet

- Single-select: radio buttons

- Hierarchy: drill-down

- Counts: item numbers

- Clear all: reset filters

### User Signals

- Click history: interests

- Purchase history: preferences

- Browse behavior: implicit

- Ratings: explicit feedback

- Demographics: segments

### Techniques

- Collaborative filtering: similar users

- Content-based: item attributes

- Hybrid: combined approaches

- Contextual: session, location

- Session-based: anonymous

### Privacy

- Anonymization: user IDs

- Consent: GDPR compliance

- Transparency: explainability

- Control: preferences

- Data minimization: necessary only

---

### Boosting

- Field boost: title higher

- Query boost: preferred terms

- Function score: custom scoring

- Decay: distance, recency

- Script: complex logic

### Signals

- Popularity: click, purchase

- Recency: freshness

- Authority: quality score

- Engagement: dwell time

- Personalization: user signals

### Testing

- Offline: precision, recall

- Online: A/B testing

- Interleaving: fair comparison

- Judgment: human ratings

- Regression: baseline comparison

### Monitoring

- NDCG: ranking quality

- Click-through: user behavior

- Session success: conversion

- Zero results: gap analysis

- Query trends: evolving needs

---

#### Continuing expansion in next iteration

---

### Index Configuration

**Why it exists:** Full-text search with analyzers

```typescript
// lib/elasticsearch.ts
import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: process.env.ELASTICSEARCH_URL });

// Create index with mappings
async function createProductIndex() {
await client.indices.create({
index: 'products',
body: {
settings: {
analysis: {
analyzer: {
product_analyzer: {
type: 'custom',
tokenizer: 'standard',
filter: ['lowercase', 'asciifolding', 'snowball'],
        },
        },
        },
      },
mappings: {
properties: {
name: { type: 'text', analyzer: 'product_analyzer', boost: 2 },
description: { type: 'text', analyzer: 'product_analyzer' },
category: { type: 'keyword' },
price: { type: 'float' },
tags: { type: 'keyword' },
createdAt: { type: 'date' },
        },
      },
    },
  });
}

// Search with aggregations
async function searchProducts(query: string, filters: any) {
return client.search({
index: 'products',
body: {
query: {
bool: {
must: [
{ multi_match: { query, fields: ['name^2', 'description', 'tags'] } },
        ],
filter: [
filters.category && { term: { category: filters.category } },
filters.minPrice && { range: { price: { gte: filters.minPrice } } },
        ].filter(Boolean),
        },
      },
aggs: {
categories: { terms: { field: 'category' } },
price_ranges: {
range: { field: 'price', ranges: [{ to: 50 }, { from: 50, to: 100 }, { from: 100 }] },
        },
      },
highlight: { fields: { name: {}, description: {} } },
    },
  });
}

```text

---

### Search Integration

**Why it exists:** Hosted search-as-a-service

```typescript
// lib/algolia.ts
import algoliasearch from 'algoliasearch';

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_KEY!
);
const index = client.initIndex('products');

// Configure index settings
await index.setSettings({
searchableAttributes: ['name', 'description', 'category', 'tags'],
attributesForFaceting: ['category', 'brand', 'filterOnly(price)'],
customRanking: ['desc(popularity)', 'asc(price)'],
replicas: ['products_price_asc', 'products_price_desc'],
});

// Frontend with InstantSearch
// components/Search.tsx
import { InstantSearch, SearchBox, Hits, RefinementList } from 'react-instantsearch';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export function Search() {
return (
<InstantSearch searchClient={searchClient} indexName="products">
<SearchBox placeholder="Search products..." />
<div className="flex">
<div className="w-1/4">
<RefinementList attribute="category" />
<RefinementList attribute="brand" />
        </div>
<Hits hitComponent={ProductHit} />
      </div>
    </InstantSearch>
  );
}

```text

---

### Semantic Search with Embeddings

**Why it exists:**Meaning-based search

```typescript
// lib/vectorSearch.ts
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

const openai = new OpenAI();
const pinecone = new Pinecone();
const index = pinecone.index('products');

// Create embedding
async function getEmbedding(text: string): Promise<number[]> {
const response = await openai.embeddings.create({
model: 'text-embedding-3-small',
input: text,
  });
return response.data[0].embedding;
}

// Search similar products
async function semanticSearch(query: string, topK = 10) {
const embedding = await getEmbedding(query);

const results = await index.query({
vector: embedding,
    topK,
includeMetadata: true,
  });

return results.matches.map(match => ({
id: match.id,
score: match.score,
    ...match.metadata,
  }));
}

// Hybrid search (keyword + semantic)
async function hybridSearch(query: string) {
const [keywordResults, semanticResults] = await Promise.all([
    elasticSearch(query),
    semanticSearch(query),
  ]);

// Combine and rerank
return rerank([...keywordResults, ...semanticResults]);
}

```text

---

#### CONTINUED: MORE SEARCH PATTERNS

---

## ELASTICSEARCH PATTERNS

>**The search engine integration patterns**

---

> **The search patterns that scale**

---

### Index Design

```json
{
"mappings": {
"properties": {
"title": {
"type": "text",
"analyzer": "english",
"fields": {
"keyword": { "type": "keyword" }
        }
      },
"created_at": { "type": "date" },
"price": { "type": "float" },
"category_id": { "type": "keyword" },
"tags": { "type": "keyword" }
    }
  }
}

```text

---

### Search Queries

```javascript
// Full-text search with filters
const result = await client.search({
index: 'products',
body: {
query: {
bool: {
must: [
{ match: { title: searchQuery } }
        ],
filter: [
{ term: { category_id: categoryId } },
{ range: { price: { gte: minPrice, lte: maxPrice } } }
        ]
      }
    },
sort: [
{ _score: 'desc' },
{ created_at: 'desc' }
    ],
from: offset,
size: limit
  }
});

```text

---

### Sync Strategy

```text
OPTION 1: Dual write
Write to DB AND Elasticsearch
Problem: Consistency on failures

OPTION 2: Change Data Capture
Debezium watches DB changes
Populates Elasticsearch
Eventually consistent

OPTION 3: Outbox pattern
Write to outbox table
Worker syncs to Elasticsearch
Transactional guarantee

```text

---

### Index Settings

```json
{
"settings": {
"number_of_shards": 3,
"number_of_replicas": 2,
"analysis": {
"analyzer": {
"custom_analyzer": {
"type": "custom",
"tokenizer": "standard",
"filter": ["lowercase", "asciifolding", "english_stemmer"]
        }
      },
"filter": {
"english_stemmer": {
"type": "stemmer",
"language": "english"
        }
      }
    }
  },
"mappings": {
"properties": {
"title": { "type": "text", "analyzer": "custom_analyzer" },
"description": { "type": "text" },
"price": { "type": "float" },
"category": { "type": "keyword" },
"created_at": { "type": "date" }
    }
  }
}

```text

---

### Search Query

```typescript
const searchProducts = async (query: string, filters: Filters) => {
return client.search({
index: 'products',
body: {
query: {
bool: {
must: [
        {
multi_match: {
        query,
fields: ['title^3', 'description'],  // Title weighted 3x
fuzziness: 'AUTO'
        }
        }
        ],
filter: [
filters.category && { term: { category: filters.category } },
filters.minPrice && { range: { price: { gte: filters.minPrice } } }
        ].filter(Boolean)
        }
      },
highlight: {
fields: { title: {}, description: {} }
      },
aggs: {
categories: { terms: { field: 'category' } },
price_ranges: {
range: {
field: 'price',
ranges: [
{ to: 50 },
{ from: 50, to: 100 },
{ from: 100 }
        ]
        }
        }
      }
    }
  });
};

```text

---

#### The Scar

> "Mapping change required. Dropped index, recreated.
> 10 minutes of downtime. Search broken during prime time.
> Lost $50k in sales. Users left.
> No strategy for schema migrations."

```python

> "100 shards for 1GB of data.
> Each search hits 100 shards. Massive overhead.
> p99 latency: 2 seconds. Should be 50ms.
> Over-sharding killed performance."

```python

> "Search p99 jumped from 100ms to 5 seconds.
> No idea which queries. No visibility.
> Turned out one user kept running 'select all' queries.
> No slow log enabled. Blind debugging."

```python

> "Semantic search: finds 'automobile' for 'car'. Great!
> But misses products named 'Car Mat'. Exact match failed.
> Keyword search: finds 'Car Mat'. But misses 'vehicle accessories'.
> Need both. Tried averaging scores. Terrible results."

```text

> "Autocomplete on every keystroke. 10 characters = 10 API calls.
> Each call: 200ms. User sees laggy suggestions.
> Server overloaded with autocomplete requests.
> Worse: showing results for outdated query."

```typescript
// VIBE: API call on every keystroke
input.addEventListener('keyup', async (e) => {
const results = await fetch(`/api/search?q=${e.target.value}`);
showSuggestions(results); // Race condition: old results may overwrite new
});

```python

// TITAN: Debounced autocomplete with request cancellation
class AutocompleteController {
| private debounceTimer: ReturnType<typeof setTimeout> | null = null; |
| private abortController: AbortController | null = null; |
private lastQuery: string = '';
private cache = new Map<string, SearchResult[]>();

    constructor(
private inputElement: HTMLInputElement,
private suggestionsElement: HTMLElement,
private config: {
debounceMs: number;
minChars: number;
maxCacheSize: number;
} = { debounceMs: 150, minChars: 2, maxCacheSize: 100 }
) {
this.inputElement.addEventListener('input', this.handleInput.bind(this));
this.inputElement.addEventListener('keydown', this.handleKeydown.bind(this));
    }

private handleInput(e: Event) {
const query = (e.target as HTMLInputElement).value.trim();

// Don't search for short queries
if (query.length < this.config.minChars) {
        this.hideSuggestions();
        return;
        }

// Check cache first
if (this.cache.has(query)) {
        this.showSuggestions(this.cache.get(query)!);
        return;
        }

// Debounce API calls
if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        }

this.debounceTimer = setTimeout(() => {
        this.search(query);
}, this.config.debounceMs);
    }

private async search(query: string) {
// Cancel previous in-flight request
if (this.abortController) {
        this.abortController.abort();
        }

this.abortController = new AbortController();
this.lastQuery = query;

try {
const response = await fetch(
        `/api/autocomplete?q=${encodeURIComponent(query)}`,
{ signal: this.abortController.signal }
        );

const results = await response.json();

// Only show if this is still the current query
if (query === this.lastQuery) {
this.cacheResults(query, results);
        this.showSuggestions(results);
        }
} catch (err) {
if (err.name !== 'AbortError') {
console.error('Autocomplete error:', err);
        }
        }
    }

private cacheResults(query: string, results: SearchResult[]) {
// LRU cache eviction
if (this.cache.size >= this.config.maxCacheSize) {
const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
        }
this.cache.set(query, results);
    }

private showSuggestions(results: SearchResult[]) {
// Render with highlighting
this.suggestionsElement.innerHTML = results.map(r => `
<div class="suggestion" data-id="${r.id}">
${this.highlightMatch(r.text, this.lastQuery)}
        </div>
        `).join('');
this.suggestionsElement.style.display = 'block';
    }

private highlightMatch(text: string, query: string): string {
const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
return text.replace(regex, '<mark>$1</mark>');
    }

private escapeRegex(str: string): string {
| return str.replace(/[.*+?^${}() | [\]\\]/g, '\\$&'); |
    }
}

```text

> "Full-text search for autocomplete. Works but slow.
> 'iph' doesn't match 'iPhone'. Users confused.
> No fuzzy matching. No prefix completion.
> Lost sales because users couldn't find products."

```sql

### VIBE: Delete and recreate

def migrate_index():
    es.indices.delete('products')
es.indices.create('products', body=new_mapping)
reindex_all() # Takes 30 minutes

### 30 minutes of 404 errors

```python

## TITAN: Blue-green reindexing with aliases

from elasticsearch import Elasticsearch
import time

class ZeroDowntimeReindex:
def __init__(self, es: Elasticsearch, alias: str):
self.es = es
self.alias = alias

def migrate(self, new_mapping: dict):
"""Zero-downtime index migration using aliases."""

## 1. Create timestamped new index

timestamp = int(time.time())
new_index = f"{self.alias}_v{timestamp}"

print(f"Creating new index: {new_index}")
self.es.indices.create(index=new_index, body=new_mapping)

## 2. Find current production index

current_indices = self.es.indices.get_alias(name=self.alias).keys()
old_index = list(current_indices)[0] if current_indices else None

## 3. Reindex data from old to new

if old_index:
print(f"Reindexing from {old_index} to {new_index}...")

## Use async reindex for large datasets

task = self.es.reindex(
        body={
"source": {"index": old_index},
"dest": {"index": new_index}
        },
        wait_for_completion=False
        )

## Monitor progress

task_id = task['task']
while True:
status = self.es.tasks.get(task_id=task_id)
if status['completed']:
        break

total = status['task']['status']['total']
created = status['task']['status']['created']
print(f"Progress: {created}/{total} documents")
        time.sleep(5)

## 4. Atomic alias swap - THE KEY STEP

print("Swapping aliases atomically...")
actions = [
{"add": {"index": new_index, "alias": self.alias}}
        ]

if old_index:
actions.append({"remove": {"index": old_index, "alias": self.alias}})

self.es.indices.update_aliases(body={"actions": actions})

## 5. Delete old index after verification

if old_index:

## Wait for any in-flight queries

time.sleep(30)

## Verify new index is serving traffic

new_count = self.es.count(index=new_index)['count']
print(f"New index has {new_count} documents")

## Delete old index

self.es.indices.delete(index=old_index)
print(f"Deleted old index: {old_index}")

return new_index

## Usage

reindexer = ZeroDowntimeReindex(es, 'products')
reindexer.migrate({
'settings': {'number_of_shards': 3},
'mappings': {
'properties': {
'name': {'type': 'text'},
'embedding': {
'type': 'dense_vector',  # NEW field
'dims': 768
        }
        }
    }
})

```text

### VIBE: Default or random shard count

es.indices.create('logs', body={
'settings': {'number_of_shards': 5}  # Why 5? Who knows
})

```python

## TITAN: Calculated shard sizing

from dataclasses import dataclass
from typing import Tuple

@dataclass
class ShardingStrategy:
    """
Optimal shard sizing rules:
1. Target 10-50GB per shard for search-heavy
2. Target 20-40GB per shard for logging
3. Never more than 20 shards per GB of heap
4. Each shard has ~20MB overhead
    """

def calculate_shard_count(
        self,
data_size_gb: float,
use_case: str = 'search',
expected_growth_factor: float = 2.0
) -> Tuple[int, str]:
"""Calculate optimal shard count for index."""

## Account for expected growth

projected_size = data_size_gb * expected_growth_factor

## Shard size targets based on use case

if use_case == 'logging':
target_shard_size_gb = 30  # Larger shards OK for time-series
elif use_case == 'search':
target_shard_size_gb = 20  # Smaller for faster queries
        else:
target_shard_size_gb = 25

## Calculate shard count

shard_count = max(1, int(projected_size / target_shard_size_gb))

## Don't over-shard small indices

if projected_size < 5:
shard_count = 1

reasoning = f"""
Data size: {data_size_gb}GB
Projected size (2x growth): {projected_size}GB
Target shard size: {target_shard_size_gb}GB
Recommended shards: {shard_count}
Average shard size: {projected_size / shard_count:.1f}GB
        """

return shard_count, reasoning

def calculate_replica_count(
        self,
availability_requirement: str = 'high',
read_throughput_multiplier: float = 1.0
) -> int:
"""Calculate replica count based on requirements."""

base_replicas = {
'low': 0,  # Dev/test
'medium': 1,   # Standard prod
'high': 2  # Critical systems
        }

replicas = base_replicas.get(availability_requirement, 1)

## Each replica can serve queries

if read_throughput_multiplier > 2:
replicas += 1
if read_throughput_multiplier > 4:
replicas += 1

return replicas

## Example usage

strategy = ShardingStrategy()

## Small product catalog

shards, reason = strategy.calculate_shard_count(
    data_size_gb=2,
    use_case='search'
)
print(f"Product index: {shards} shards")

## Large logging index

shards, reason = strategy.calculate_shard_count(
    data_size_gb=500,
    use_case='logging',
    expected_growth_factor=3.0
)
print(f"Logs index: {shards} shards")

## Output: 50 shards (1500GB / 30GB target)

```text

### Just hope everything is fast

```yaml

## elasticsearch.yml or index settings

PUT /products/_settings
{
"index.search.slowlog.threshold.query.warn": "2s",
"index.search.slowlog.threshold.query.info": "1s",
"index.search.slowlog.threshold.query.debug": "500ms",
"index.search.slowlog.threshold.fetch.warn": "1s",
"index.search.slowlog.threshold.fetch.info": "500ms",
"index.search.slowlog.level": "info"
}

```text

### TITAN: Query profiling and analysis

from elasticsearch import Elasticsearch
from dataclasses import dataclass
from datetime import datetime
import json

@dataclass
class SlowQuery:
timestamp: datetime
duration_ms: float
query: dict
index: str
user_id: str

class SearchQueryAnalyzer:
def __init__(self, es: Elasticsearch):
self.es = es
self.slow_queries: list[SlowQuery] = []

def profile_query(self, index: str, query: dict, user_id: str = None):
"""Execute query with profiling enabled."""

start = datetime.now()

### Enable query profiling

result = self.es.search(
        index=index,
        body={
        **query,
'profile': True
        }
        )

duration_ms = (datetime.now() - start).total_seconds() * 1000

### Log slow queries

if duration_ms > 500:
        self.slow_queries.append(SlowQuery(
        timestamp=datetime.now(),
        duration_ms=duration_ms,
        query=query,
        index=index,
        user_id=user_id
        ))

### Analyze the profile

self.analyze_profile(result.get('profile', {}), query)

return result

def analyze_profile(self, profile: dict, query: dict):
"""Analyze query profile for optimization opportunities."""

issues = []

for shard in profile.get('shards', []):
for search in shard.get('searches', []):
for query_profile in search.get('query', []):
query_type = query_profile.get('type', '')
time_ns = query_profile.get('time_in_nanos', 0)
time_ms = time_ns / 1_000_000

### Identify slow query types

if query_type == 'WildcardQuery' and time_ms > 100:
        issues.append(
f"Slow wildcard query: {time_ms:.1f}ms. "
"Consider using edge n-grams instead."
        )

if query_type == 'RegexpQuery':
        issues.append(
"Regex query detected. Very expensive. "
"Consider alternatives."
        )

### Check for expensive script scoring

if 'script' in query_type.lower() and time_ms > 50:
        issues.append(
f"Script scoring taking {time_ms:.1f}ms. "
"Consider precomputed fields."
        )

if issues:
Query Performance Issues:")
for issue in issues:
print(f" - {issue}")

def get_slow_query_report(self) -> dict:
"""Generate report of slow queries."""

if not self.slow_queries:
return {"message": "No slow queries recorded"}

### Group by query pattern

patterns = {}
for sq in self.slow_queries:
pattern = json.dumps(sq.query, sort_keys=True)[:100]
if pattern not in patterns:
patterns[pattern] = {
'count': 0,
'total_ms': 0,
'max_ms': 0,
'users': set()
        }
patterns[pattern]['count'] += 1
patterns[pattern]['total_ms'] += sq.duration_ms
patterns[pattern]['max_ms'] = max(patterns[pattern]['max_ms'], sq.duration_ms)
if sq.user_id:
        patterns[pattern]['users'].add(sq.user_id)

return {
'total_slow_queries': len(self.slow_queries),
'patterns': [
        {
'pattern': p[:100],
'count': v['count'],
'avg_ms': v['total_ms'] / v['count'],
'max_ms': v['max_ms'],
'unique_users': len(v['users'])
        }
for p, v in sorted(
        patterns.items(),
key=lambda x: x[1]['total_ms'],
        reverse=True
        )[:10]
        ]
        }

```json

## VIBE: Simple score averaging

def hybrid_search(query: str):
keyword_results = keyword_search(query)
semantic_results = semantic_search(query)

## Wrong: scores are on different scales

combined = []
for doc in keyword_results:
doc['score'] = (doc['bm25_score'] + doc['vector_score']) / 2
        combined.append(doc)

## BM25 scores: 0-20, Vector scores: 0-1. Can't average!

```text

### TITAN: Reciprocal Rank Fusion (RRF)

from dataclasses import dataclass
from collections import defaultdict

@dataclass
class SearchResult:
doc_id: str
score: float
source: str  # 'keyword' or 'semantic'
metadata: dict

class HybridSearchEngine:
def __init__(self, es, embedding_model, vector_db):
self.es = es
self.embedding_model = embedding_model
self.vector_db = vector_db
self.rrf_k = 60  # RRF constant, typically 60

async def hybrid_search(
        self,
query: str,
top_k: int = 10,
keyword_weight: float = 0.5,
semantic_weight: float = 0.5
) -> list[SearchResult]:
        """
Hybrid search using Reciprocal Rank Fusion.

RRF formula: score = sum(1 / (k + rank_i))

This works because:

1. Converts scores to ranks (position 1, 2, 3...)
2. Ranks are comparable across different scoring systems
3. Top-ranked documents get higher RRF scores

        """

### 1. Get keyword search results

keyword_results = await self.keyword_search(query, top_k * 2)

### 2. Get semantic search results

semantic_results = await self.semantic_search(query, top_k * 2)

### 3. Apply RRF fusion

rrf_scores = defaultdict(float)
doc_metadata = {}

### Score keyword results by rank

for rank, result in enumerate(keyword_results, start=1):
rrf_score = keyword_weight / (self.rrf_k + rank)
rrf_scores[result.doc_id] += rrf_score
doc_metadata[result.doc_id] = result.metadata

### Score semantic results by rank

for rank, result in enumerate(semantic_results, start=1):
rrf_score = semantic_weight / (self.rrf_k + rank)
rrf_scores[result.doc_id] += rrf_score
if result.doc_id not in doc_metadata:
doc_metadata[result.doc_id] = result.metadata

### 4. Sort by combined RRF score

sorted_docs = sorted(
        rrf_scores.items(),
key=lambda x: x[1],
        reverse=True
        )[:top_k]

return [
        SearchResult(
        doc_id=doc_id,
        score=score,
        source='hybrid',
        metadata=doc_metadata[doc_id]
        )
for doc_id, score in sorted_docs
        ]

async def keyword_search(self, query: str, limit: int) -> list[SearchResult]:
"""BM25 keyword search."""
result = self.es.search(
        index='products',
        body={
'query': {
'multi_match': {
'query': query,
'fields': ['name^3', 'description', 'tags'],
'type': 'best_fields',
'fuzziness': 'AUTO'
        }
        },
'size': limit
        }
        )

return [
        SearchResult(
        doc_id=hit['_id'],
        score=hit['_score'],
        source='keyword',
        metadata=hit['_source']
        )
for hit in result['hits']['hits']
        ]

async def semantic_search(self, query: str, limit: int) -> list[SearchResult]:
"""Vector similarity search."""

### Generate query embedding

embedding = await self.embedding_model.embed(query)

### Search vector database

results = await self.vector_db.query(
        vector=embedding,
        top_k=limit,
        include_metadata=True
        )

return [
        SearchResult(
        doc_id=r.id,
        score=r.score,
        source='semantic',
        metadata=r.metadata
        )
for r in results
        ]

### Elasticsearch 8.x native hybrid search (simpler)

def es8_hybrid_search(es, query: str, embedding: list[float]):
"""Elasticsearch 8.x has native RRF support."""
return es.search(
        index='products',
        body={
'query': {
'bool': {
'should': [
        {
'multi_match': {
'query': query,
'fields': ['name^3', 'description']
        }
        }
        ]
        }
        },
'knn': {
'field': 'embedding',
'query_vector': embedding,
'k': 10,
'num_candidates': 100
        },
'rank': {
'rrf': {
'window_size': 100,
'rank_constant': 60
        }
        }
        }
    )

```json

## END OF VOLUME 8: TITAN GEMINI RESEARCH - SEARCH PRODUCTION FAILURES

---

## VIBE: Regular search for autocomplete

def autocomplete(query: str):
return es.search(index='products', body={
'query': {'match': {'name': query}}
    })

## 'app' doesn't find 'Apple'. 'samsu' doesn't find 'Samsung'

```text

### TITAN: Dedicated autocomplete index with edge n-grams

AUTOCOMPLETE_INDEX_SETTINGS = {
'settings': {
'analysis': {
'filter': {
'autocomplete_filter': {
'type': 'edge_ngram',
'min_gram': 1,
'max_gram': 20
        },
'shingle_filter': {
'type': 'shingle',
'min_shingle_size': 2,
'max_shingle_size': 3,
'output_unigrams': True
        }
        },
'analyzer': {
'autocomplete_index': {
'type': 'custom',
'tokenizer': 'standard',
'filter': [
        'lowercase',
        'autocomplete_filter'
        ]
        },
'autocomplete_search': {
'type': 'custom',
'tokenizer': 'standard',
'filter': ['lowercase']
        }
        }
        }
    },
'mappings': {
'properties': {
'name': {
'type': 'text',
'analyzer': 'autocomplete_index',
'search_analyzer': 'autocomplete_search'
        },
'name_keyword': {
'type': 'keyword'  # For exact boosting
        },
'popularity': {
'type': 'float'  # For ranking popular items higher
        },
'category': {
'type': 'keyword'  # For filtering
        }
        }
    }
}

| def search_autocomplete(query: str, category: str | None = None, size: int = 10): |
"""Production autocomplete with multiple signals."""

must_clauses = [{
'multi_match': {
'query': query,
'fields': [
'name^3', # Boost name matches
'name.exact^5' # Boost exact prefix matches
        ],
'type': 'bool_prefix'  # Optimized for prefix matching
        }
    }]

### Optional category filter

filter_clauses = []
if category:
filter_clauses.append({'term': {'category': category}})

return es.search(
        index='products_autocomplete',
        body={
'query': {
'function_score': {
'query': {
'bool': {
'must': must_clauses,
'filter': filter_clauses
        }
        },
'functions': [

### Boost by popularity

{
'field_value_factor': {
'field': 'popularity',
'factor': 1.2,
'modifier': 'log1p',
'missing': 1
        }
        },

### Boost exact prefix matches

{
'filter': {
'prefix': {
'name_keyword': query.lower()
        }
        },
'weight': 10
        }
        ],
'boost_mode': 'multiply'
        }
        },
'size': size,
'_source': ['name', 'category', 'image_url', 'price'],
'highlight': {
'fields': {
'name': {
'pre_tags': ['<mark>'],
'post_tags': ['</mark>']
        }
        }
        }
        }
    )

### TITAN: Completion suggester for fastest autocomplete

COMPLETION_SUGGESTER_MAPPING = {
'properties': {
'suggest': {
'type': 'completion',
'analyzer': 'simple',
'preserve_separators': True,
'preserve_position_increments': True,
'max_input_length': 50,
'contexts': [
        {
'name': 'category',
'type': 'category'
        }
        ]
        }
    }
}

| def completion_suggest(prefix: str, category: str | None = None): |
"""Ultra-fast completion using FST data structure."""

contexts = {}
if category:
contexts['category'] = category

return es.search(
        index='products_suggest',
        body={
'suggest': {
'product-suggest': {
'prefix': prefix,
'completion': {
'field': 'suggest',
'size': 10,
'skip_duplicates': True,
'fuzzy': {
'fuzziness': 'AUTO'
        },
'contexts': contexts
        }
        }
        }
        }
    )

```text

## END OF VOLUME 9: TITAN GEMINI RESEARCH - AUTOCOMPLETE AND TYPEAHEAD

---

### Production Index Configuration

**The Scar**: LinkedIn search latency spiked to 5 seconds during peak hours due to wrong shard configuration

```json

// ? TITAN: Production Elasticsearch index settings
{
"settings": {
"number_of_shards": 6,
"number_of_replicas": 2,
"index": {
"refresh_interval": "30s",
"max_result_window": 10000,
"codec": "best_compression",
"translog": {
"durability": "async",
"sync_interval": "30s",
"flush_threshold_size": "512mb"
      }
    },
"analysis": {
"analyzer": {
"custom_analyzer": {
"type": "custom",
"tokenizer": "standard",
"filter": ["lowercase", "snowball", "synonym_filter"]
        }
      },
"filter": {
"synonym_filter": {
"type": "synonym",
"synonyms": [
        "quick,fast,speedy",
        "buy,purchase,acquire"
        ]
        }
      }
    }
  },
"mappings": {
"properties": {
"title": {
"type": "text",
"analyzer": "custom_analyzer",
"fields": {
"keyword": { "type": "keyword" },
"autocomplete": {
"type": "text",
"analyzer": "autocomplete"
        }
        }
      },
"description": {
"type": "text",
"analyzer": "custom_analyzer"
      },
"created_at": {
"type": "date"
      },
"location": {
"type": "geo_point"
      },
"price": {
"type": "scaled_float",
"scaling_factor": 100
      },
"categories": {
"type": "keyword"
      }
    }
  }
}

```text

---

#### Search Query with Relevance Tuning

```typescript

// ? TITAN: Production search query with boosting
async function searchProducts(
query: string,
filters: SearchFilters,
page: number = 1,
pageSize: number = 20
): Promise<SearchResult> {
const body = {
from: (page - 1) * pageSize,
size: pageSize,
query: {
bool: {
must: [
        {
multi_match: {
query: query,
fields: [
"title^3", // Title is 3x more important
        "title.autocomplete",
        "description",
        "categories^2"
        ],
type: "best_fields",
fuzziness: "AUTO",  // Handle typos
minimum_should_match: "75%"
        }
        }
        ],
filter: [
filters.category && { term: { categories: filters.category } },
filters.priceMin && { range: { price: { gte: filters.priceMin } } },
filters.priceMax && { range: { price: { lte: filters.priceMax } } },
filters.location && {
geo_distance: {
| distance: filters.radius |  | "50km", |
location: filters.location
        }
        }
        ].filter(Boolean),
should: [
{ term: { is_featured: { value: true, boost: 2 } } },
{ range: { rating: { gte: 4, boost: 1.5 } } }
        ]
      }
    },
sort: [
{ _score: "desc" },
{ created_at: "desc" }
    ],
highlight: {
fields: {
title: { fragment_size: 150 },
description: { fragment_size: 200, number_of_fragments: 3 }
      },
pre_tags: ["<mark>"],
post_tags: ["</mark>"]
    },
aggs: {
categories: { terms: { field: "categories", size: 20 } },
price_ranges: {
range: {
field: "price",
ranges: [
{ to: 50 },
{ from: 50, to: 100 },
{ from: 100, to: 500 },
{ from: 500 }
        ]
        }
      }
    }
  };

const response = await esClient.search({ index: "products", body });

return {
hits: response.hits.hits.map(formatHit),
total: response.hits.total.value,
aggregations: response.aggregations,
took: response.took
  };
}

```text

---

#### Embedding Generation and Indexing

```text

### TITAN: Vector search with OpenAI embeddings + Pinecone

import openai
import pinecone
from typing import List, Dict

class SemanticSearchEngine:
def __init__(self, openai_key: str, pinecone_key: str, index_name: str):
openai.api_key = openai_key
pinecone.init(api_key=pinecone_key, environment="us-east-1")
self.index = pinecone.Index(index_name)

def generate_embedding(self, text: str) -> List[float]:
response = openai.Embedding.create(
        input=text,
model="text-embedding-3-small" # 1536 dimensions
        )
return response['data'][0]['embedding']

def index_document(self, doc_id: str, text: str, metadata: Dict):
embedding = self.generate_embedding(text)

        self.index.upsert(vectors=[{
"id": doc_id,
"values": embedding,
"metadata": {
        **metadata,
"text_snippet": text[:500]  # Store snippet for display
        }
        }])

def search(self, query: str, top_k: int = 10, filter: Dict = None) -> List[Dict]:
query_embedding = self.generate_embedding(query)

results = self.index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        filter=filter
        )

return [
        {
"id": match.id,
"score": match.score,
"metadata": match.metadata
        }
for match in results.matches
        ]

def hybrid_search(self, query: str, keyword_weight: float = 0.3) -> List[Dict]:

### Combine semantic + keyword search

semantic_results = self.search(query, top_k=50)

### Re-rank with BM25-like keyword matching

reranked = []
for result in semantic_results:
text = result['metadata'].get('text_snippet', '')
keyword_score = self._keyword_score(query, text)
combined_score = (
(1 - keyword_weight) * result['score'] +
keyword_weight * keyword_score
        )
reranked.append({**result, 'combined_score': combined_score})

return sorted(reranked, key=lambda x: x['combined_score'], reverse=True)[:10]

```text

---

### Lines: ~200+ added

---

### Elasticsearch Integration

```typescript

import { Client } from '@elastic/elasticsearch';

const client = new Client({
node: process.env.ELASTICSEARCH_URL,
auth: {
apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

// Index document
async function indexDocument(index: string, document: any) {
return client.index({
    index,
    document,
refresh: true,
  });
}

// Search with filters and pagination
async function search(
index: string,
query: string,
filters: Record<string, any> = {},
page = 1,
pageSize = 20
) {
const must: any[] = [
    {
multi_match: {
        query,
fields: ['title^3', 'description^2', 'content'],
fuzziness: 'AUTO',
      },
    },
  ];

const filterClauses = Object.entries(filters).map(([field, value]) => ({
term: { [field]: value },
  }));

const response = await client.search({
    index,
from: (page - 1) * pageSize,
size: pageSize,
query: {
bool: {
        must,
filter: filterClauses,
      },
    },
highlight: {
fields: { content: {} },
    },
  });

return {
hits: response.hits.hits.map(hit => ({
      ...hit._source,
score: hit._score,
highlights: hit.highlight,
    })),
total: (response.hits.total as any).value,
    page,
    pageSize,
  };
}

// Autocomplete
async function autocomplete(index: string, prefix: string) {
const response = await client.search({
    index,
query: {
match_phrase_prefix: {
title: {
query: prefix,
max_expansions: 10,
        },
      },
    },
size: 5,
_source: ['title', 'id'],
  });

return response.hits.hits.map(hit => hit._source);
}

```text

---

### Full-Text Search with PostgreSQL

```text

-- Create search index
ALTER TABLE products ADD COLUMN search_vector tsvector;

CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Update trigger
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
NEW.search_vector :=
| setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') |  |
| setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') |  |
setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C');
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_update
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- Search query
SELECT
id, name, description,
ts_rank(search_vector, query) as rank
FROM products, plainto_tsquery('english', $1) query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;

```text

---

## 1. THE SCARS

- **The 'Slow Query'**: `LIKE '%term%'` on 10M rows. 30s timeout. Lesson: Inverted Index.

## 2. THE FOUNDATION

- **Inverted Index**: Map words to document IDs.
- **TF-IDF**: Term Frequency - Inverse Document Frequency. Relevance scoring.

## 3. TITAN PATTERNS

- **Vector Search**: Embeddings (OpenAI/BERT) for semantic search ("King - Man + Woman = Queen").
- **Fuzzy Matching**: Levenshtein distance for typos.

---


## TITAN IMPLEMENTATION: Distributed Search Indexing

> **The Pattern**: Avoiding **full table scan** with inverted indices and **distributed lock**.

```typescript

from elasticsearch import Elasticsearch
from redis import Redis

es = Elasticsearch()
redis = Redis()

def index_document(doc_id, content):

### # Distributed lock prevents race condition during concurrent updates

lock = redis.lock(f"lock:{doc_id}", timeout=5)

if lock.acquire(blocking=False):
        try:

### # Atomic update for eventual consistency

es.index(index="titan-index", id=doc_id, body=content)
print(f"Indexed {doc_id}")
        finally:
        lock.release()
    else:
print("Document is being indexed by another worker.")

def search(query):

### # Use Index Scan (Inverted Index) instead of Full Table Scan

res = es.search(index="titan-index", body={"query": {"match": {"content": query}}})
return res['hits']['hits']

```text

## VOLUME 7: TITAN SEARCH SCARS (Incidents & Post-Mortems)

### Incident #11.1: The Elasticsearch Split Brain Disaster
- **Root Cause**: Network partition between two master-eligible nodes. Both elected themselves as master.
- **Impact**: Two divergent versions of the index. Data loss on merge. 4 hours of downtime.
- **Titan Mitigation**:
- Set `discovery.zen.minimum_master_nodes = N/2 + 1` (quorum).
- Use dedicated master nodes (3 minimum).
- Monitor cluster health with `_cluster/health` API.

### Incident #11.2: The Deep Pagination OOM
- **Root Cause**: User requested page 10,000 of search results (`from=100000&size=10`).
- **Impact**: Elasticsearch fetched top 100,010 docs from every shard, causing massive heap usage and GC pause. Cluster crashed.
- **Titan Mitigation**:
- Use `search_after` cursor-based pagination.
- Set `max_result_window` to prevent deep pagination.
- Implement `scroll` API for large result sets.

### Incident #11.3: The Mapping Explosion
- **Root Cause**: Dynamic mapping enabled. User uploaded JSON with 10,000 unique fields.
- **Impact**: Mapping size exceeded cluster state limit. Index became read-only.
- **Titan Mitigation**:
- Use `dynamic_templates` to control field types.
- Set `index.mapping.total_fields.limit`.
- Disable dynamic mapping for production indices.

### TITAN Search Checklist
- [ ] **Recall**: Are we finding the right documents? (Synonyms, stemming)
- [ ] **Precision**: Are we showing garbage? (Stopwords, min_should_match)
- [ ] **Ranking**: Is the best doc #1? (Boosting, LTR)
- [ ] **Latency**: Is search < 100ms? (Caching, sharding)
- [ ] **Availability**: Can we survive node failures? (Replicas, cluster health)

### TITAN: Advanced Search Concepts
- **Vector Search Optimization**: Using HNSW (Hierarchical Navigable Small World) graphs for O(log N) k-NN search instead of brute-force O(N).
- **Hybrid Search**: Combining BM25 keyword search with vector embeddings using Reciprocal Rank Fusion (RRF) for best-of-both-worlds relevance.
- **Learning to Rank**: Using XGBoost to re-rank top 100 results based on user behavior (CTR, conversions, dwell time).
- **Geospatial Indexing**: Implementing Geohash and Quadtrees for efficient "Find points within polygon" queries.
- **Performance**: Monitoring p99 query latency and using caching strategies (filter cache, result cache) to maintain sub-100ms response times.

## VOLUME 8: THE TITAN SEARCH MANIFESTO

To achieve Titan status, a search system must survive these production scars:
1. **The Availability War**: Maintaining search uptime during node failures. We use replicas and monitor cluster health to ensure availability even when shards fail.
2. **The Latency Demon**: Keeping p99 query latency under 100ms. We use caching (filter cache, result cache), sharding strategies, and monitor throughput to prevent slow queries from killing the cluster.
3. **The Consistency Challenge**: Handling eventual consistency in distributed search. When documents are indexed, they may not appear immediately across all replicas. We use refresh intervals and monitor replication lag.
4. **The Incident Response**: Every search outage must result in a post-mortem that identifies the root cause. We measure success by SLA, SLO, and SLI metrics.
5. **The Optimization Path**: Using inverted indices for fast term lookups, B-tree structures for range queries, and LSM tree patterns for write-heavy workloads. We implement bloom filters to skip expensive disk lookups and use sharding to distribute load.
6. **The CAP Theorem**: In distributed search, we often trade consistency for availability and partition tolerance. Elasticsearch chooses AP (Availability + Partition Tolerance) over C (Consistency).
7. **The Memory Management**: Monitoring garbage collection pauses, heap usage, and implementing circuit breakers to prevent OOM (Out of Memory) errors. We track memory leaks and use profiling to identify hot spots.
8. **The Deadlock Prevention**: Avoiding race conditions in concurrent indexing operations. We use distributed locks and implement retry logic with exponential backoff and jitter to prevent thundering herd problems.
9. **The WAL (Write-Ahead Log)**: Elasticsearch uses transaction logs to ensure durability. We monitor WAL size and implement proper fsync strategies to prevent data loss.
10. **The Replication Strategy**: Using primary-replica architecture to ensure data availability. We monitor replication lag and implement proper failover mechanisms to handle primary shard failures.

### TITAN: Production Search Incidents (The Real Scars)
1. **The GC Pause Outage**: A stop-the-world garbage collection pause of 30 seconds caused all search queries to timeout. Root cause: heap size too small, causing frequent full GC. Fix: increased heap, tuned GC settings, monitored memory leaks.
2. **The Shard Imbalance**: One shard had 10x more documents than others, causing hot spot issues. Root cause: poor routing key selection. Fix: implemented custom routing with consistent hashing, monitored shard distribution.
3. **The Replication Lag**: Replicas fell behind primary by 5 minutes during high write throughput. Root cause: network partition and slow disk I/O. Fix: increased replica count, monitored replication lag, implemented circuit breakers.
4. **The Cache Stampede**: When cache expired, 1000 concurrent requests hit Elasticsearch simultaneously. Root cause: no cache warming strategy. Fix: implemented staggered cache expiration with jitter, added request coalescing.
5. **The Deadlock**: Two indexing jobs tried to update the same document simultaneously, causing a deadlock. Root cause: no distributed locking. Fix: implemented Redis-based distributed locks with exponential backoff and retry logic.
6. **The Memory Leak**: Elasticsearch heap usage grew linearly over 7 days until OOM. Root cause: unclosed scroll contexts. Fix: implemented scroll context cleanup, monitored open contexts, added alerts.
7. **The Thundering Herd**: After a cluster restart, all clients reconnected simultaneously, overwhelming the cluster. Root cause: no connection backoff. Fix: implemented exponential backoff with jitter for client reconnections.
8. **The Index Corruption**: A power failure during index merge caused segment corruption. Root cause: no fsync on critical operations. Fix: enabled transaction log fsync, implemented proper shutdown hooks, monitored WAL integrity.

### TITAN: Search System Architecture Patterns
- **Event Loop Optimization**: Implementing non-blocking I/O for search queries to handle high throughput without blocking the event loop.
- **Segfault Prevention**: Proper memory management in native search extensions to prevent segfaults during query execution.
- **Partition Tolerance**: Designing search clusters to handle network partitions gracefully, maintaining availability even when nodes are isolated.
- **Backpressure Handling**: Implementing backpressure mechanisms to prevent query queue overflow during traffic spikes.
- **Circuit Breaker Pattern**: Automatically stopping queries to unhealthy nodes to prevent cascade failures.
- **Bulkhead Isolation**: Isolating different search workloads (autocomplete vs full-text) to prevent resource contention.
- **Cache Stampede Prevention**: Using probabilistic early expiration and request coalescing to prevent cache stampede scenarios.
- **Hot Spot Mitigation**: Detecting and redistributing hot shards to prevent single-node bottlenecks.
- **Cold Start Optimization**: Pre-warming caches and indices after cluster restarts to minimize cold start latency.

```text
