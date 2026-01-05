def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

search_boost = """
### TITAN: Advanced Search Concepts
- **Vector Search Optimization**: Using HNSW (Hierarchical Navigable Small World) graphs for O(log N) k-NN search instead of brute-force O(N).
- **Hybrid Search**: Combining BM25 keyword search with vector embeddings using Reciprocal Rank Fusion (RRF) for best-of-both-worlds relevance.
- **Learning to Rank**: Using XGBoost to re-rank top 100 results based on user behavior (CTR, conversions, dwell time).
- **Geospatial Indexing**: Implementing Geohash and Quadtrees for efficient "Find points within polygon" queries.
- **Performance**: Monitoring p99 query latency and using caching strategies (filter cache, result cache) to maintain sub-100ms response times.
"""

payments_boost = """
### TITAN: Advanced Payments Concepts
- **Double-Entry Ledger**: Implementing accounting invariant (Sum(Debits) == Sum(Credits)) to prevent money creation or destruction.
- **Cross-Border Payments**: Handling FX rate slippage and using hedging strategies (currency futures) to lock in rates.
- **3D Secure (SCA)**: Implementing Strong Customer Authentication for PSD2 compliance while minimizing friction with exemptions (TRA, low-value).
- **Fraud Detection**: Using velocity checks, device fingerprinting, and ML models (Stripe Radar) to block suspicious transactions.
- **Reconciliation**: Automated daily matching of Stripe payout reports against DB transactions to catch discrepancies.
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/11_Search.md', search_boost)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/12_Payments.md', payments_boost)

print("Boost content appended successfully!")
