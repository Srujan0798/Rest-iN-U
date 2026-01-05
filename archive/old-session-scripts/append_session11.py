def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

search_content = """
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
"""

payments_content = """
## VOLUME 7: TITAN PAYMENTS SCARS (Incidents & Post-Mortems)

### Incident #12.1: The Double Charge Race Condition
- **Root Cause**: User clicked "Pay" button twice. UI lag caused two HTTP requests. Backend processed both in parallel.
- **Impact**: User charged twice. Chargeback fee of $15. Angry support ticket.
- **Titan Mitigation**:
    - Implement idempotency keys (UUID per request).
    - Use Redis `SETNX` for atomic lock.
    - Cache response for 24 hours to handle retries.

### Incident #12.2: The Rounding Error (Office Space Style)
- **Root Cause**: Used `float` for money calculations. `0.1 + 0.2 = 0.30000000000000004` (IEEE 754).
- **Impact**: Over time, pennies disappeared. Accounting mismatch of $2,000 after 1 million transactions.
- **Titan Mitigation**:
    - Store money as integers in smallest unit (cents).
    - $10.00 = `1000` cents.
    - Use libraries like `Dinero.js` or `Money` pattern.

### Incident #12.3: The Webhook Failure (Free Product)
- **Root Cause**: Stripe webhook endpoint returned 500 error. Stripe stopped retrying after 3 days.
- **Impact**: Payment succeeded but product was never delivered. Revenue loss.
- **Titan Mitigation**:
    - Implement webhook retry queue (SQS/RabbitMQ).
    - Use `idempotency_key` to handle duplicate webhooks.
    - Monitor webhook delivery with Stripe Dashboard.

### TITAN Payments Checklist
- [ ] **Idempotency**: Can requests be retried safely?
- [ ] **Reconciliation**: Does Stripe balance match DB?
- [ ] **Fraud Detection**: Are we blocking suspicious transactions?
- [ ] **PCI Compliance**: Are we tokenizing card data?
- [ ] **Availability**: Can we survive payment gateway downtime?
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/11_Search.md', search_content)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/12_Payments.md', payments_content)

print("Expert content appended successfully!")
