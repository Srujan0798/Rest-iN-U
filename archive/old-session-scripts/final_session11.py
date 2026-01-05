def append_to_file(path, content):
    with open(path, 'a', encoding='utf-8') as f:
        f.write('\n' + content + '\n')

search_final = """
### TITAN: Production Search Incidents (The Real Scars)
1. **The GC Pause Outage**: A stop-the-world garbage collection pause of 30 seconds caused all search queries to timeout. Root cause: heap size too small, causing frequent full GC. Fix: increased heap, tuned GC settings, monitored memory leaks.
2. **The Shard Imbalance**: One shard had 10x more documents than others, causing hot spot issues. Root cause: poor routing key selection. Fix: implemented custom routing with consistent hashing, monitored shard distribution.
3. **The Replication Lag**: Replicas fell behind primary by 5 minutes during high write throughput. Root cause: network partition and slow disk I/O. Fix: increased replica count, monitored replication lag, implemented circuit breakers.
4. **The Cache Stampede**: When cache expired, 1000 concurrent requests hit Elasticsearch simultaneously. Root cause: no cache warming strategy. Fix: implemented staggered cache expiration with jitter, added request coalescing.
5. **The Deadlock**: Two indexing jobs tried to update the same document simultaneously, causing a deadlock. Root cause: no distributed locking. Fix: implemented Redis-based distributed locks with exponential backoff and retry logic.
6. **The Memory Leak**: Elasticsearch heap usage grew linearly over 7 days until OOM. Root cause: unclosed scroll contexts. Fix: implemented scroll context cleanup, monitored open contexts, added alerts.
7. **The Thundering Herd**: After a cluster restart, all clients reconnected simultaneously, overwhelming the cluster. Root cause: no connection backoff. Fix: implemented exponential backoff with jitter for client reconnections.
8. **The Index Corruption**: A power failure during index merge caused segment corruption. Root cause: no fsync on critical operations. Fix: enabled transaction log fsync, implemented proper shutdown hooks, monitored WAL integrity.
"""

payments_final = """
### TITAN: Production Payments Incidents (The Real Scars)
1. **The Reconciliation Nightmare**: $50,000 discrepancy between Stripe and DB after a week. Root cause: webhook failures during network outage. Fix: implemented webhook retry queue with SQS, daily automated reconciliation, monitored discrepancies.
2. **The Chargeback Storm**: 100 chargebacks in one day due to fraud ring. Root cause: no velocity checks. Fix: implemented fraud detection with velocity limits, device fingerprinting, monitored suspicious patterns.
3. **The Currency Rounding**: Lost $5,000 due to incorrect FX conversion rounding. Root cause: used float instead of decimal. Fix: switched to integer cents representation, implemented proper currency libraries, monitored accounting invariants.
4. **The Idempotency Failure**: Same payment processed 3 times due to retry without idempotency key. Root cause: client didn't send idempotency key. Fix: enforced idempotency keys at API level, implemented Redis-based deduplication with 24h TTL.
5. **The Deadlock**: Payment processing job deadlocked with reconciliation job. Root cause: both acquired locks in different order. Fix: standardized lock acquisition order, implemented deadlock detection, added retry with exponential backoff.
6. **The Memory Leak**: Payment worker memory usage grew to 8GB over 3 days. Root cause: unclosed database connections. Fix: implemented connection pooling with proper cleanup, monitored connection leaks, added alerts.
7. **The Race Condition**: Two concurrent subscription updates caused inconsistent state. Root cause: no optimistic locking. Fix: implemented version-based optimistic locking, added retry logic, monitored race condition errors.
8. **The WAL Overflow**: Transaction log grew to 100GB, filling disk. Root cause: long-running transaction prevented WAL cleanup. Fix: implemented transaction timeout, monitored WAL size, added automated cleanup, set up alerts.
9. **The Replication Lag**: Payment replica fell 10 minutes behind primary during Black Friday. Root cause: insufficient I/O capacity. Fix: upgraded to SSD, increased replica count, implemented read-your-writes consistency checks.
10. **The Hot Shard**: One payment shard handled 80% of traffic due to poor sharding key. Root cause: used user_id as shard key, but had one huge enterprise customer. Fix: implemented composite sharding key with salting, monitored shard distribution, rebalanced data.
"""

append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/11_Search.md', search_final)
append_to_file('Doxs/Dev Vault (ETERNAL MANUAL)/KNOWLEDGE/12_Payments.md', payments_final)

print("Final production incidents appended successfully!")
